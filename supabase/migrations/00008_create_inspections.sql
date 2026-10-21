-- Handover Pickup & Return Inspections
CREATE TABLE IF NOT EXISTS public.inspections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id),
  type TEXT NOT NULL CHECK (type IN ('pickup', 'return')),
  actual_time TIMESTAMPTZ NOT NULL DEFAULT now(),
  odometer_km INT NOT NULL CHECK (odometer_km >= 0),
  fuel_level TEXT NOT NULL,
  checklist JSONB DEFAULT '{}',
  condition_notes TEXT,
  damage_photos JSONB DEFAULT '[]',
  extras_breakdown TEXT,
  extras_charge_minor BIGINT DEFAULT 0,
  staff_id UUID NOT NULL REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT uq_booking_inspection_type UNIQUE (booking_id, type)
);

ALTER TABLE public.inspections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff manage inspections" ON public.inspections FOR ALL
  USING (public.is_staff_or_admin());
