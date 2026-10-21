-- CRM Customers and Private Internal Notes
CREATE TABLE IF NOT EXISTS public.crm_customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  renter_details JSONB DEFAULT '{}',
  linked_user_id UUID UNIQUE REFERENCES public.users(id),
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.crm_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES public.crm_customers(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.users(id),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.crm_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_notes ENABLE ROW LEVEL SECURITY;

-- Customers can view their own CRM profile if linked, but NEVER crm_notes
CREATE POLICY "Customers view own linked crm profile" ON public.crm_customers FOR SELECT USING (linked_user_id = public.get_user_id() OR public.is_staff_or_admin());
CREATE POLICY "Staff manage crm customers" ON public.crm_customers FOR ALL USING (public.is_staff_or_admin());

-- CRM notes are strictly internal staff/admin records
CREATE POLICY "Staff manage crm notes" ON public.crm_notes FOR ALL USING (public.is_staff_or_admin());
