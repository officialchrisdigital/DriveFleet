-- Pricing Rules, Promos, and Redemptions
CREATE TABLE IF NOT EXISTS public.pricing_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('base', 'weekend', 'override', 'duration_tier')),
  scope TEXT NOT NULL CHECK (scope IN ('global', 'category', 'vehicle')),
  scope_id UUID,
  effective_start DATE NOT NULL,
  effective_end DATE NOT NULL,
  priority INT NOT NULL DEFAULT 0,
  rate_minor BIGINT,
  percentage DECIMAL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT chk_pricing_rule_dates CHECK (effective_end >= effective_start)
);

CREATE TABLE IF NOT EXISTS public.promos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value BIGINT NOT NULL CHECK (discount_value > 0),
  valid_from DATE NOT NULL,
  valid_to DATE NOT NULL,
  min_rental_days INT,
  max_uses INT,
  current_uses INT NOT NULL DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT chk_promo_dates CHECK (valid_to >= valid_from)
);

CREATE TABLE IF NOT EXISTS public.promo_redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  promo_id UUID NOT NULL REFERENCES public.promos(id) ON DELETE CASCADE,
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  discount_applied_minor BIGINT NOT NULL,
  redeemed_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.pricing_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo_redemptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read active pricing rules" ON public.pricing_rules FOR SELECT USING (active = true);
CREATE POLICY "Admin manage pricing rules" ON public.pricing_rules FOR ALL USING (public.is_admin());

CREATE POLICY "Public read active promos" ON public.promos FOR SELECT USING (active = true);
CREATE POLICY "Admin manage promos" ON public.promos FOR ALL USING (public.is_admin());

CREATE POLICY "Staff manage promo redemptions" ON public.promo_redemptions FOR ALL USING (public.is_staff_or_admin());
