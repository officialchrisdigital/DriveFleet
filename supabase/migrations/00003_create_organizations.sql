-- Organizations, Branches, and Org Settings
CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT,
  currency TEXT NOT NULL DEFAULT 'NGN',
  timezone TEXT NOT NULL DEFAULT 'Africa/Lagos',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.branches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  operating_hours JSONB DEFAULT '{}',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.org_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID UNIQUE REFERENCES public.organizations(id) ON DELETE CASCADE,
  booking_policy JSONB DEFAULT '{"min_rental_hours": 24, "max_rental_days": 90}',
  cancellation_policy JSONB DEFAULT '{"cutoff_hours": 24}',
  mileage_settings JSONB DEFAULT '{"default_allowance_km": 200, "excess_rate_minor": 15000}',
  maintenance_settings JSONB DEFAULT '{"service_interval_km": 10000}',
  demo_checkout_settings JSONB DEFAULT '{"enabled": true, "require_simulated_card": true}',
  turnaround_buffer_minutes INT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now(),
  updated_by UUID
);

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.org_settings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public read active branches" ON public.branches FOR SELECT USING (active = true);
CREATE POLICY "Staff and Admin read organizations" ON public.organizations FOR SELECT USING (true);
CREATE POLICY "Staff and Admin read settings" ON public.org_settings FOR SELECT USING (true);
CREATE POLICY "Admin update settings" ON public.org_settings FOR ALL USING (public.is_admin());
CREATE POLICY "Admin manage branches" ON public.branches FOR ALL USING (public.is_admin());
