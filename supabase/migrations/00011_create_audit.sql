-- Immutable Audit Ledger and Public Inquiries
CREATE TABLE IF NOT EXISTS public.audit_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES public.users(id),
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  action TEXT NOT NULL,
  reason TEXT,
  before_state JSONB,
  after_state JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  submitted_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.audit_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Audit entries are admin-only and append-only
CREATE POLICY "Admin read audit log" ON public.audit_entries FOR SELECT USING (public.is_admin());
CREATE POLICY "System insert audit log" ON public.audit_entries FOR INSERT WITH CHECK (true);

-- Public can submit inquiries
CREATE POLICY "Public create inquiries" ON public.inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Staff read inquiries" ON public.inquiries FOR SELECT USING (public.is_staff_or_admin());
