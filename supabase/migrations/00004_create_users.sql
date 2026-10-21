-- Users and Profile Table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id UUID UNIQUE,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'staff', 'admin')),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  active BOOLEAN DEFAULT true,
  preferred_branch_id UUID REFERENCES public.branches(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own profile" ON public.users FOR SELECT USING (auth_id = auth.uid() OR public.is_staff_or_admin());
CREATE POLICY "Users update own profile" ON public.users FOR UPDATE USING (auth_id = auth.uid() OR public.is_admin());
CREATE POLICY "Admin manage users" ON public.users FOR ALL USING (public.is_admin());
