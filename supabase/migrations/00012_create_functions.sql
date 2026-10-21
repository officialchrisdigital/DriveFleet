-- Availability Check & Atomic Confirmation Functions

CREATE OR REPLACE FUNCTION public.check_vehicle_availability(
  p_vehicle_id UUID,
  p_pickup_at TIMESTAMPTZ,
  p_return_at TIMESTAMPTZ,
  p_exclude_booking_id UUID DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_buffer_minutes INT := 0;
  v_buffer INTERVAL;
  v_conflict RECORD;
BEGIN
  IF p_return_at <= p_pickup_at THEN
    RETURN jsonb_build_object('available', false, 'reason', 'Return date must be strictly after pickup date');
  END IF;

  SELECT COALESCE(turnaround_buffer_minutes, 0) INTO v_buffer_minutes FROM public.org_settings LIMIT 1;
  v_buffer := (v_buffer_minutes || ' minutes')::interval;

  -- 1. Check booking overlaps (half-open [pickup_at, return_at))
  SELECT id, reference, status, pickup_at, return_at INTO v_conflict
  FROM public.bookings
  WHERE vehicle_id = p_vehicle_id
    AND status IN ('confirmed', 'active')
    AND (p_exclude_booking_id IS NULL OR id <> p_exclude_booking_id)
    AND pickup_at < (p_return_at + v_buffer)
    AND (return_at + v_buffer) > p_pickup_at
  LIMIT 1;

  IF FOUND THEN
    RETURN jsonb_build_object(
      'available', false,
      'conflict_type', 'booking',
      'reference', v_conflict.reference,
      'status', v_conflict.status,
      'reason', 'Conflicting booking reservation exists'
    );
  END IF;

  -- 2. Check blocking maintenance
  SELECT id, task_type, scheduled_start, scheduled_end INTO v_conflict
  FROM public.maintenance_tasks
  WHERE vehicle_id = p_vehicle_id
    AND blocks_availability = true
    AND status IN ('scheduled', 'in_progress')
    AND scheduled_start < p_return_at
    AND scheduled_end > p_pickup_at
  LIMIT 1;

  IF FOUND THEN
    RETURN jsonb_build_object(
      'available', false,
      'conflict_type', 'maintenance',
      'task_type', v_conflict.task_type,
      'reason', 'Vehicle is scheduled for maintenance quarantine'
    );
  END IF;

  RETURN jsonb_build_object('available', true);
END;
$$;

-- Atomic Booking Confirmation with pg_advisory_xact_lock
CREATE OR REPLACE FUNCTION public.confirm_booking(
  p_vehicle_id UUID,
  p_customer_id UUID,
  p_branch_id UUID,
  p_pickup_at TIMESTAMPTZ,
  p_return_at TIMESTAMPTZ,
  p_idempotency_key TEXT,
  p_source_channel TEXT,
  p_created_by UUID,
  p_quote JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_existing_booking RECORD;
  v_avail JSONB;
  v_booking_id UUID;
  v_reference TEXT;
  v_year TEXT;
  v_seq INT;
BEGIN
  -- 1. Serialize concurrent requests for the same vehicle
  PERFORM pg_advisory_xact_lock(hashtext(p_vehicle_id::text));

  -- 2. Idempotency Check: if key already processed, return existing booking
  IF p_idempotency_key IS NOT NULL THEN
    SELECT b.*, jsonb_build_object('id', b.id, 'reference', b.reference, 'status', b.status) as payload
    INTO v_existing_booking
    FROM public.bookings b
    WHERE b.idempotency_key = p_idempotency_key;

    IF FOUND THEN
      RETURN jsonb_build_object('success', true, 'idempotent', true, 'booking', v_existing_booking.payload);
    END IF;
  END IF;

  -- 3. Authoritative Availability Validation
  v_avail := public.check_vehicle_availability(p_vehicle_id, p_pickup_at, p_return_at);
  IF NOT (v_avail->>'available')::boolean THEN
    INSERT INTO public.checkout_attempts (idempotency_key, simulated_outcome)
    VALUES (p_idempotency_key, 'conflict');
    
    RETURN jsonb_build_object('success', false, 'error', 'AVAILABILITY_CONFLICT', 'details', v_avail);
  END IF;

  -- 4. Generate Reference DF-YYYY-NNNN
  v_year := to_char(now() AT TIME ZONE 'Africa/Lagos', 'YYYY');
  v_seq := nextval('booking_reference_seq');
  v_reference := 'DF-' || v_year || '-' || lpad(v_seq::text, 4, '0');

  -- 5. Insert Confirmed Booking
  INSERT INTO public.bookings (
    reference, customer_id, vehicle_id, branch_id, pickup_at, return_at,
    status, source_channel, created_by, idempotency_key, current_version
  ) VALUES (
    v_reference, p_customer_id, p_vehicle_id, p_branch_id, p_pickup_at, p_return_at,
    'confirmed', p_source_channel, p_created_by, p_idempotency_key, 1
  ) RETURNING id INTO v_booking_id;

  -- 6. Insert Snapshot Booking Version
  INSERT INTO public.booking_versions (
    booking_id, version_number, billed_periods, line_items,
    subtotal_minor, duration_discount_minor, duration_tier,
    promo_discount_minor, fees_minor, deposit_minor, total_minor,
    currency, applied_rules, actor_id
  ) VALUES (
    v_booking_id, 1,
    (p_quote->>'billedPeriods')::int,
    p_quote->'lineItems',
    (p_quote->>'subtotalMinor')::bigint,
    (p_quote->>'durationDiscountMinor')::bigint,
    p_quote->>'durationTier',
    (p_quote->>'promoDiscountMinor')::bigint,
    (p_quote->>'feesMinor')::bigint,
    (p_quote->>'depositMinor')::bigint,
    (p_quote->>'totalMinor')::bigint,
    COALESCE(p_quote->>'currency', 'NGN'),
    p_quote,
    p_created_by
  );

  -- 7. Record Checkout Attempt (Simulated Success)
  INSERT INTO public.checkout_attempts (booking_id, idempotency_key, simulated_outcome)
  VALUES (v_booking_id, p_idempotency_key, 'success');

  RETURN jsonb_build_object(
    'success', true,
    'booking_id', v_booking_id,
    'reference', v_reference,
    'status', 'confirmed'
  );
END;
$$;
