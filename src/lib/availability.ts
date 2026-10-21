import { Booking, MaintenanceTask } from './types';

export interface IntervalCheckResult {
  available: boolean;
  conflictingBooking?: Booking;
  conflictingMaintenance?: MaintenanceTask;
  reason?: string;
}

/**
 * Validates availability using half-open intervals: [pickup_at, return_at)
 * Overlap exists when: existing_start < requested_end AND existing_end > requested_start
 * Turnaround buffer expands the blocked window.
 */
export function checkAvailability(
  vehicleId: string,
  pickupAt: string | Date,
  returnAt: string | Date,
  existingBookings: Booking[],
  maintenanceTasks: MaintenanceTask[] = [],
  turnaroundBufferMinutes: number = 0,
  excludeBookingId?: string
): IntervalCheckResult {
  const reqStart = typeof pickupAt === 'string' ? new Date(pickupAt) : pickupAt;
  const reqEnd = typeof returnAt === 'string' ? new Date(returnAt) : returnAt;

  if (reqEnd <= reqStart) {
    return { available: false, reason: 'Return date must be strictly after pickup date' };
  }

  const bufferMs = turnaroundBufferMinutes * 60 * 1000;

  // Check bookings for the same vehicle
  const relevantBookings = existingBookings.filter(
    b => b.vehicleId === vehicleId &&
         ['confirmed', 'active'].includes(b.status) &&
         b.id !== excludeBookingId
  );

  for (const b of relevantBookings) {
    const existStart = new Date(b.pickupAt);
    const existEnd = new Date(new Date(b.returnAt).getTime() + bufferMs);

    // Half-open interval overlap check
    if (existStart < reqEnd && existEnd > reqStart) {
      return {
        available: false,
        conflictingBooking: b,
        reason: `Vehicle has a ${b.status} reservation during this window (${b.reference})`,
      };
    }
  }

  // Check maintenance tasks
  const relevantMaintenance = maintenanceTasks.filter(
    m => m.vehicleId === vehicleId &&
         m.blocksAvailability &&
         ['scheduled', 'in_progress'].includes(m.status) &&
         m.scheduledStart && m.scheduledEnd
  );

  for (const m of relevantMaintenance) {
    const mStart = new Date(m.scheduledStart!);
    const mEnd = new Date(m.scheduledEnd!);

    if (mStart < reqEnd && mEnd > reqStart) {
      return {
        available: false,
        conflictingMaintenance: m,
        reason: `Vehicle scheduled for maintenance (${m.taskType})`,
      };
    }
  }

  return { available: true };
}
