import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useOperations } from '@/contexts/OperationsContext';
import { BookingStatus } from '@/lib/types';
import {
  Bookmark, ArrowLeft, CheckCircle2, Calendar,
  Clock, DollarSign, Car
} from 'lucide-react';

export function EditBookingPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const { bookings, vehicles, updateBooking } = useOperations();
  const navigate = useNavigate();

  const booking = bookings.find((b) => b.id === bookingId || b.reference === bookingId);

  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [vehicleId, setVehicleId] = useState('');
  const [status, setStatus] = useState<BookingStatus>('confirmed');
  const [amendmentReason, setAmendmentReason] = useState('');

  useEffect(() => {
    if (booking) {
      setPickupDate(booking.pickupAt.split('T')[0]);
      setReturnDate(booking.returnAt.split('T')[0]);
      setVehicleId(booking.vehicleId);
      setStatus(booking.status);
    }
  }, [booking]);

  if (!booking) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <h2 className="text-base font-bold text-slate-900">Reservation Not Found</h2>
        <Link to="/admin/bookings" className="text-xs text-blue-600 font-bold mt-2 inline-block">
          Return to Ledger
        </Link>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const pIso = `${pickupDate}T09:00:00Z`;
    const rIso = `${returnDate}T18:00:00Z`;

    updateBooking(booking.id, {
      pickupAt: pIso,
      returnAt: rIso,
      vehicleId,
      status,
      latestVersion: {
        id: `bv-${Date.now()}`,
        bookingId: booking.id,
        versionNumber: (booking.currentVersion || 1) + 1,
        billedPeriods: booking.quote?.billedPeriods || 1,
        lineItems: [],
        subtotalMinor: booking.quote?.subtotalMinor || 0,
        durationDiscountMinor: 0,
        promoDiscountMinor: 0,
        feesMinor: booking.quote?.feesMinor || 0,
        depositMinor: booking.quote?.depositMinor || 5000000,
        totalMinor: booking.quote?.totalMinor || 0,
        currency: 'NGN',
        changeReason: amendmentReason || 'Operational schedule adjustment by staff',
        createdAt: new Date().toISOString(),
      },
      currentVersion: (booking.currentVersion || 1) + 1,
    });

    navigate(`/admin/bookings/${booking.id}`);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
        <Link
          to={`/admin/bookings/${booking.id}`}
          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight font-mono">
            Amend Reservation #{booking.reference}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational date adjustments, vehicle reassignment, and reason logging.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Pickup Date</label>
            <input
              type="date"
              required
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Return Date</label>
            <input
              type="date"
              required
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Vehicle</label>
            <select
              value={vehicleId}
              onChange={(e) => setVehicleId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none"
            >
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.make} {v.model} ({v.year}) – {v.plate} – {v.operationalState.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Booking Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as BookingStatus)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none"
            >
              <option value="confirmed">Confirmed (Upcoming)</option>
              <option value="active">Active (On Road)</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Amendment Reason / Operational Justification
            </label>
            <textarea
              rows={3}
              value={amendmentReason}
              onChange={(e) => setAmendmentReason(e.target.value)}
              placeholder="Record operational reason for date or vehicle shift (audited)..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs focus:outline-none"
            />
          </div>
        </div>

        <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
          <Link
            to={`/admin/bookings/${booking.id}`}
            className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Save Amendment</span>
          </button>
        </div>
      </form>
    </div>
  );
}
