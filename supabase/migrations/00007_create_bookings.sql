-- Sequence for booking references (DF-YYYY-NNNN)
CREATE SEQUENCE IF NOT EXISTS booking_reference_seq START 1000;

-- Bookings, Versions (Quotes), and Checkout Attempts
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference TEXT NOT NULL UNIQUE,
  customer_id UUID NOT NULL REFERENCES public.crm_customers(id),
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id),
  branch_id UUID NOT NULL REFERENCES public.branches(id),
  pickup_at TIMESTAMPTZ NOT NULL,
  return_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'confirmed', 'active', 'completed', 'cancelled')),
  source_channel TEXT NOT NULL DEFAULT 'customer' CHECK (source_channel IN ('customer', 'staff')),
  created_by UUID REFERENCES public.users(id),
  idempotency_key TEXT UNIQUE,
  current_version INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT chk_booking_dates CHECK (return_at > pickup_at)
);

CREATE TABLE IF NOT EXISTS public.booking_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  version_number INT NOT NULL,
  billed_periods INT NOT NULL,
  line_items JSONB NOT NULL,
  subtotal_minor BIGINT NOT NULL,
  duration_discount_minor BIGINT NOT NULL DEFAULT 0,
  duration_tier TEXT,
  promo_id UUID,
  promo_discount_minor BIGINT NOT NULL DEFAULT 0,
  fees_minor BIGINT NOT NULL DEFAULT 0,
  deposit_minor BIGINT NOT NULL DEFAULT 0,
  total_minor BIGINT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'NGN',
  applied_rules JSONB DEFAULT '{}',
  change_reason TEXT,
  actor_id UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT uq_booking_version UNIQUE (booking_id, version_number)
);

CREATE TABLE IF NOT EXISTS public.checkout_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  idempotency_key TEXT NOT NULL,
  simulated_outcome TEXT NOT NULL CHECK (simulated_outcome IN ('success', 'conflict', 'failure')),
  attempted_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checkout_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers view own bookings" ON public.bookings FOR SELECT
  USING (
    customer_id IN (SELECT id FROM public.crm_customers WHERE linked_user_id = public.get_user_id())
    OR public.is_staff_or_admin()
  );

CREATE POLICY "Customers create booking drafts" ON public.bookings FOR INSERT
  WITH CHECK (
    customer_id IN (SELECT id FROM public.crm_customers WHERE linked_user_id = public.get_user_id())
    OR public.is_staff_or_admin()
  );

CREATE POLICY "Staff manage all bookings" ON public.bookings FOR ALL
  USING (public.is_staff_or_admin());

CREATE POLICY "Booking versions read" ON public.booking_versions FOR SELECT
  USING (
    booking_id IN (
      SELECT id FROM public.bookings WHERE customer_id IN (
        SELECT id FROM public.crm_customers WHERE linked_user_id = public.get_user_id()
      )
    )
    OR public.is_staff_or_admin()
  );

CREATE POLICY "Staff manage booking versions" ON public.booking_versions FOR ALL
  USING (public.is_staff_or_admin());

CREATE POLICY "Staff manage checkout attempts" ON public.checkout_attempts FOR ALL
  USING (public.is_staff_or_admin());
