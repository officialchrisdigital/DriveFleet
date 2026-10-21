import { BUSINESS_TIMEZONE, DEFAULT_CURRENCY } from './constants';

/**
 * Formats integer minor units (kobo) into a readable currency string.
 * Example: 3000000 kobo -> "NGN 30,000"
 */
export function formatCurrency(amountMinor: number, currency: string = DEFAULT_CURRENCY): string {
  const major = Math.round(amountMinor) / 100;
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0,
  }).format(major).replace('NGN', 'NGN ');
}

/**
 * Formats a date or ISO string into local business date display.
 */
export function formatDate(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return '—';
  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(d.getTime())) return '—';

  return new Intl.DateTimeFormat('en-GB', {
    timeZone: BUSINESS_TIMEZONE,
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(d);
}

/**
 * Formats a date or ISO string into local business date + time display.
 */
export function formatDateTime(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return '—';
  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(d.getTime())) return '—';

  return new Intl.DateTimeFormat('en-GB', {
    timeZone: BUSINESS_TIMEZONE,
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(d);
}

/**
 * Normalizes vehicle license plates for uniqueness matching (e.g. "LAG-802-AB" -> "LAG802AB")
 */
export function normalizePlate(plate: string): string {
  return plate.toUpperCase().replace(/[^A-Z0-9]/g, '');
}

/**
 * Formats kilometers (e.g. 18420 -> "18,420 km")
 */
export function formatKilometers(km: number | null | undefined): string {
  if (km === null || km === undefined) return '—';
  return `${new Intl.NumberFormat('en-US').format(km)} km`;
}

/**
 * Calculates rental duration display text
 */
export function formatDuration(pickupAt: string | Date, returnAt: string | Date): { days: number; hours: number; label: string } {
  const p = typeof pickupAt === 'string' ? new Date(pickupAt) : pickupAt;
  const r = typeof returnAt === 'string' ? new Date(returnAt) : returnAt;
  const diffMs = r.getTime() - p.getTime();
  const totalHours = Math.max(1, Math.round(diffMs / (1000 * 60 * 60)));
  const days = Math.max(1, Math.ceil(totalHours / 24));
  return {
    days,
    hours: totalHours,
    label: `${days} Day${days > 1 ? 's' : ''} (${totalHours}h)`
  };
}
