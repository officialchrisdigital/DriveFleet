-- Vehicles, Images, and Operational State History
CREATE TABLE IF NOT EXISTS public.vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id UUID NOT NULL REFERENCES public.branches(id),
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INT NOT NULL CHECK (year >= 1990 AND year <= 2030),
  plate TEXT NOT NULL,
  plate_normalized TEXT GENERATED ALWAYS AS (UPPER(REGEXP_REPLACE(plate, '[^A-Za-z0-9]', '', 'g'))) STORED,
  category TEXT NOT NULL CHECK (category IN ('economy', 'sedan', 'suv', 'luxury')),
  seats INT NOT NULL CHECK (seats > 0),
  transmission TEXT NOT NULL CHECK (transmission IN ('automatic', 'manual')),
  fuel_type TEXT NOT NULL CHECK (fuel_type IN ('petrol', 'diesel', 'hybrid', 'electric')),
  base_rate_minor BIGINT NOT NULL CHECK (base_rate_minor > 0),
  mileage_allowance_km INT NOT NULL DEFAULT 200 CHECK (mileage_allowance_km >= 0),
  current_odometer_km INT NOT NULL DEFAULT 0 CHECK (current_odometer_km >= 0),
  operational_state TEXT NOT NULL DEFAULT 'ready' CHECK (operational_state IN ('ready', 'in_maintenance', 'out_of_service')),
  archived BOOLEAN DEFAULT false,
  service_thresholds JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT uq_vehicle_plate UNIQUE (plate_normalized)
);

CREATE TABLE IF NOT EXISTS public.vehicle_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.vehicle_state_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  prior_state TEXT,
  new_state TEXT NOT NULL,
  reason TEXT,
  actor_id UUID REFERENCES public.users(id),
  effective_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_state_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read active vehicles" ON public.vehicles FOR SELECT USING (archived = false OR public.is_staff_or_admin());
CREATE POLICY "Public read vehicle images" ON public.vehicle_images FOR SELECT USING (true);
CREATE POLICY "Staff read vehicle state history" ON public.vehicle_state_history FOR SELECT USING (public.is_staff_or_admin());
CREATE POLICY "Admin manage vehicles" ON public.vehicles FOR ALL USING (public.is_admin());
CREATE POLICY "Admin manage vehicle images" ON public.vehicle_images FOR ALL USING (public.is_admin());
CREATE POLICY "Staff insert state history" ON public.vehicle_state_history FOR INSERT WITH CHECK (public.is_staff_or_admin());
