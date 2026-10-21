import { PricingRule, Promo, QuoteCalculation, QuoteLineItem } from './types';
import { BUSINESS_TIMEZONE, DEFAULT_CURRENCY } from './constants';

export interface PricingEngineInput {
  vehicleId: string;
  category: string;
  baseRateMinor: number;
  pickupAt: string | Date;
  returnAt: string | Date;
  pricingRules?: PricingRule[];
  promo?: Promo | null;
  feesMinor?: number;
  depositMinor?: number;
}

/**
 * Calculates deterministic quotes compliant with PRD Section 9.3 & Section 9.4:
 * 1. Billed periods = max(1, ceil((return_at - pickup_at) / 24 hours))
 * 2. Evaluate date at period start in business local time (Africa/Lagos)
 * 3. Base rate or Date override: vehicle > category > global override.
 *    If no override: Saturday/Sunday receives +10% weekend rate.
 * 4. Duration discount tiers: 7-29 periods = 10% off; 30+ periods = 20% off.
 * 5. Single promo code after duration discount. Fixed discount capped at total.
 * 6. Integer minor units rounding half-up.
 */
export function calculateQuote(input: PricingEngineInput): QuoteCalculation {
  const {
    vehicleId,
    category,
    baseRateMinor,
    pickupAt,
    returnAt,
    pricingRules = [],
    promo,
    feesMinor = 0,
    depositMinor = 5000000, // Default 50,000 NGN demo deposit
  } = input;

  const start = typeof pickupAt === 'string' ? new Date(pickupAt) : pickupAt;
  const end = typeof returnAt === 'string' ? new Date(returnAt) : returnAt;

  const diffMs = Math.max(0, end.getTime() - start.getTime());
  const diffHours = diffMs / (1000 * 60 * 60);
  const billedPeriods = Math.max(1, Math.ceil(diffHours / 24));

  const lineItems: QuoteLineItem[] = [];
  let subtotalMinor = 0;

  for (let i = 0; i < billedPeriods; i++) {
    const periodStart = new Date(start.getTime() + i * 24 * 60 * 60 * 1000);
    
    // Get date parts in business timezone
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: BUSINESS_TIMEZONE,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      weekday: 'short',
    });
    
    const parts = formatter.formatToParts(periodStart);
    const dateStr = `${parts.find(p => p.type === 'year')?.value}-${parts.find(p => p.type === 'month')?.value}-${parts.find(p => p.type === 'day')?.value}`;
    const weekday = parts.find(p => p.type === 'weekday')?.value?.toLowerCase();
    const isWeekend = weekday === 'sat' || weekday === 'sun';

    // Find applicable overrides (scope: vehicle > category > global)
    const activeRules = pricingRules.filter(r => r.active && r.type === 'override');
    const matchedRules = activeRules.filter(r => {
      const matchScope =
        (r.scope === 'vehicle' && r.scopeId === vehicleId) ||
        (r.scope === 'category' && r.scopeId === category) ||
        r.scope === 'global';
      const inDateRange = (!r.effectiveStart || dateStr >= r.effectiveStart) && (!r.effectiveEnd || dateStr <= r.effectiveEnd);
      return matchScope && inDateRange;
    });

    let chosenRule: PricingRule | undefined;
    if (matchedRules.length > 0) {
      // Sort by scope priority (vehicle > category > global) then explicit rule priority desc
      matchedRules.sort((a, b) => {
        const scopeWeight = (s: string) => (s === 'vehicle' ? 3 : s === 'category' ? 2 : 1);
        const weightDiff = scopeWeight(b.scope) - scopeWeight(a.scope);
        if (weightDiff !== 0) return weightDiff;
        return (b.priority || 0) - (a.priority || 0);
      });
      chosenRule = matchedRules[0];
    }

    let rateMinor = baseRateMinor;
    let ruleApplied = 'Base Weekday Rate';
    let isOverride = false;

    if (chosenRule && chosenRule.rateMinor !== undefined) {
      rateMinor = chosenRule.rateMinor;
      ruleApplied = `Date Override (${chosenRule.scope})`;
      isOverride = true;
    } else if (isWeekend) {
      // 10% weekend surcharge
      rateMinor = Math.round(baseRateMinor * 1.1);
      ruleApplied = 'Weekend Surcharge (+10%)';
    }

    lineItems.push({
      periodIndex: i + 1,
      periodDate: dateStr,
      rateMinor,
      ruleApplied,
      isWeekend,
      isOverride,
    });

    subtotalMinor += rateMinor;
  }

  // Duration tier discount
  let durationTier: string | null = null;
  let durationDiscountPercent = 0;
  if (billedPeriods >= 30) {
    durationTier = '30+ Days (20% Off)';
    durationDiscountPercent = 20;
  } else if (billedPeriods >= 7) {
    durationTier = '7+ Days (10% Off)';
    durationDiscountPercent = 10;
  }

  const durationDiscountMinor = Math.round((subtotalMinor * durationDiscountPercent) / 100);
  const afterDurationMinor = Math.max(0, subtotalMinor - durationDiscountMinor);

  // Promo code calculation
  let promoDiscountMinor = 0;
  if (promo && promo.active) {
    if (promo.discountType === 'percentage') {
      promoDiscountMinor = Math.round((afterDurationMinor * promo.discountValue) / 100);
    } else {
      // Fixed discount capped at eligible total
      promoDiscountMinor = Math.min(afterDurationMinor, promo.discountValue);
    }
  }

  const afterPromoMinor = Math.max(0, afterDurationMinor - promoDiscountMinor);
  const totalMinor = afterPromoMinor + feesMinor;

  return {
    billedPeriods,
    lineItems,
    subtotalMinor,
    durationTier,
    durationDiscountPercent,
    durationDiscountMinor,
    afterDurationMinor,
    promoCode: promo?.code,
    promoDiscountMinor,
    afterPromoMinor,
    feesMinor,
    depositMinor,
    totalMinor,
    currency: DEFAULT_CURRENCY,
  };
}
