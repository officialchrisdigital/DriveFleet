export interface CustomerBooking {
  id: string; // e.g. 'DF-2026-9812'
  vehicle: string;
  plate: string;
  category: string;
  status: 'confirmed' | 'active' | 'completed' | 'cancelled';
  dates: string;
  pickupAt?: string;
  returnAt?: string;
  hub: string;
  amountMinor: number;
  image: string;
  odometerDelta?: string;
  cancelReason?: string;
  cancelledAt?: string;
}

// Default seeded bookings for demo account: chukwudi@drivefleet.demo
export const CHUKWUDI_INITIAL_BOOKINGS: CustomerBooking[] = [
  {
    id: 'DF-2026-9812',
    vehicle: '2024 Toyota RAV4 XLE AWD',
    plate: 'LAG-802-AB',
    category: 'suv',
    status: 'confirmed',
    dates: 'Fri, Oct 23 – Mon, Oct 26, 2026 (72h)',
    pickupAt: '2026-10-23T10:00:00Z',
    returnAt: '2026-10-26T10:00:00Z',
    hub: 'Lagos Ikeja Main Hub',
    amountMinor: 12960000,
    image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'DF-2026-7814',
    vehicle: '2024 Toyota Camry XLE',
    plate: 'LAG-482-XY',
    category: 'sedan',
    status: 'completed',
    dates: 'Sep 12 – Sep 15, 2026 (3 Days)',
    pickupAt: '2026-09-12T10:00:00Z',
    returnAt: '2026-09-15T10:00:00Z',
    hub: 'Lagos Ikeja Main Hub',
    amountMinor: 9450000,
    odometerDelta: '480 km used',
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'DF-2026-6102',
    vehicle: '2023 Mercedes-Benz C200',
    plate: 'LAG-301-MZ',
    category: 'luxury',
    status: 'completed',
    dates: 'Jul 04 – Jul 06, 2026 (2 Days)',
    pickupAt: '2026-07-04T10:00:00Z',
    returnAt: '2026-07-06T10:00:00Z',
    hub: 'Lagos Ikeja Main Hub',
    amountMinor: 17100000,
    odometerDelta: '330 km used',
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'DF-2026-5520',
    vehicle: '2023 Hyundai Tucson AWD',
    plate: 'ABJ-119-KL',
    category: 'suv',
    status: 'cancelled',
    dates: 'May 18 – May 21, 2026',
    pickupAt: '2026-05-18T10:00:00Z',
    returnAt: '2026-05-21T10:00:00Z',
    hub: 'Abuja Central Terminal',
    amountMinor: 14500000,
    cancelReason: 'Customer requested 72h prior (100% refund processed)',
    cancelledAt: '2026-05-15T14:30:00Z',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=600',
  },
];

const STORAGE_PREFIX = 'drivefleet_user_bookings_';

export function getUserBookings(email: string | null | undefined): CustomerBooking[] {
  if (!email) return [];
  const normalizedEmail = email.toLowerCase().trim();
  const storageKey = `${STORAGE_PREFIX}${normalizedEmail}`;
  const stored = localStorage.getItem(storageKey);

  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // Fallback if corrupt
    }
  }

  // If Chukwudi demo user and no storage exists yet, initialize with demo bookings
  if (normalizedEmail === 'chukwudi@drivefleet.demo') {
    localStorage.setItem(storageKey, JSON.stringify(CHUKWUDI_INITIAL_BOOKINGS));
    return CHUKWUDI_INITIAL_BOOKINGS;
  }

  // For any new registered customer, start with empty list []
  return [];
}

export function saveUserBookings(email: string, bookings: CustomerBooking[]): void {
  const normalizedEmail = email.toLowerCase().trim();
  const storageKey = `${STORAGE_PREFIX}${normalizedEmail}`;
  localStorage.setItem(storageKey, JSON.stringify(bookings));
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('drivefleet_booking_sync', { detail: { email: normalizedEmail } }));
  }
}

export function addUserBooking(email: string, booking: CustomerBooking): CustomerBooking[] {
  const existing = getUserBookings(email);
  // Add new booking at the top
  const updated = [booking, ...existing.filter((b) => b.id !== booking.id)];
  saveUserBookings(email, updated);
  return updated;
}

export function toCustomerBookingStatus(status: string): CustomerBooking['status'] {
  if (status === 'active') return 'active';
  if (status === 'completed') return 'completed';
  if (status === 'cancelled') return 'cancelled';
  return 'confirmed';
}

export function updateCustomerBookingStatus(
  bookingId: string,
  status: string,
  cancelReason?: string
): void {
  if (typeof window === 'undefined') return;
  const normalizedStatus = toCustomerBookingStatus(status);
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_PREFIX)) {
        const stored = localStorage.getItem(key);
        if (stored) {
          const list: CustomerBooking[] = JSON.parse(stored);
          let modified = false;
          const updatedList = list.map((item) => {
            if (item.id === bookingId) {
              modified = true;
              return {
                ...item,
                status: normalizedStatus,
                ...(cancelReason ? { cancelReason, cancelledAt: new Date().toISOString() } : {}),
              };
            }
            return item;
          });
          if (modified) {
            localStorage.setItem(key, JSON.stringify(updatedList));
            window.dispatchEvent(new CustomEvent('drivefleet_booking_sync'));
          }
        }
      }
    }
  } catch (err) {
    console.warn('Failed to update customer booking status in storage:', err);
  }
}

export function cancelUserBooking(
  email: string,
  bookingId: string,
  reason?: string
): { success: boolean; error?: string; updatedBookings?: CustomerBooking[] } {
  const existing = getUserBookings(email);
  const targetIndex = existing.findIndex((b) => b.id === bookingId);

  if (targetIndex === -1) {
    return { success: false, error: 'Booking reference not found in your account.' };
  }

  const booking = existing[targetIndex];
  if (booking.status === 'cancelled') {
    return { success: false, error: 'This booking is already cancelled.' };
  }
  if (booking.status === 'completed' || booking.status === 'active') {
    return { success: false, error: 'Active or completed rentals cannot be self-cancelled online. Please contact dispatch.' };
  }

  // Check 24-hour cancellation policy rule
  if (booking.pickupAt) {
    const pickupTime = new Date(booking.pickupAt).getTime();
    const nowTime = new Date().getTime();
    const hoursUntilPickup = (pickupTime - nowTime) / (1000 * 60 * 60);

    // If pickup is in less than 24 hours (and pickup is in the future)
    if (hoursUntilPickup < 24 && hoursUntilPickup > 0) {
      // Per PRD policy: Free cancellation permitted up to 24 hours prior to scheduled pickup
      return {
        success: false,
        error: 'Cancellation deadline passed. Bookings can only be cancelled up to 24 hours prior to scheduled pickup. Please contact concierge support for emergency adjustments.',
      };
    }
  }

  const updatedBooking: CustomerBooking = {
    ...booking,
    status: 'cancelled',
    cancelReason: reason || 'Customer requested online cancellation (100% refund processed)',
    cancelledAt: new Date().toISOString(),
  };

  const updated = [...existing];
  updated[targetIndex] = updatedBooking;
  saveUserBookings(email, updated);

  return { success: true, updatedBookings: updated };
}

// Selected rental dates helper for fleet search
export interface RentalSearchCriteria {
  hub: string;
  pickupDate: string; // YYYY-MM-DD
  pickupTime: string; // HH:mm
  returnDate: string; // YYYY-MM-DD
  returnTime: string; // HH:mm
}

export function getDefaultSearchCriteria(): RentalSearchCriteria {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const returnDay = new Date(tomorrow);
  returnDay.setDate(returnDay.getDate() + 3);

  const formatYMD = (d: Date) => d.toISOString().split('T')[0];

  return {
    hub: 'Lagos Ikeja Main Hub',
    pickupDate: formatYMD(tomorrow),
    pickupTime: '10:00',
    returnDate: formatYMD(returnDay),
    returnTime: '10:00',
  };
}

export function getSavedSearchCriteria(): RentalSearchCriteria {
  const stored = localStorage.getItem('drivefleet_search_criteria');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // Fallback
    }
  }
  return getDefaultSearchCriteria();
}

export function saveSearchCriteria(criteria: RentalSearchCriteria): void {
  localStorage.setItem('drivefleet_search_criteria', JSON.stringify(criteria));
}
