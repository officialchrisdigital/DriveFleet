import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useOperations } from '@/contexts/OperationsContext';
import {
  getUserBookings,
  cancelUserBooking,
  CustomerBooking,
  toCustomerBookingStatus,
} from '@/lib/userBookings';
import { formatCurrency } from '@/lib/formatters';
import {
  Search, Calendar, MapPin, QrCode, FileText, CheckCircle2,
  Clock, AlertCircle, ArrowRight, Printer, XCircle, CarFront, AlertTriangle
} from 'lucide-react';

export function MyBookingsPage() {
  const { user } = useAuth();
  const { bookings: opBookings, vehicles, customers, cancelBooking } = useOperations();
  const [bookings, setBookings] = useState<CustomerBooking[]>([]);
  const [filterTab, setFilterTab] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Cancellation Modal State
  const [selectedBookingForCancel, setSelectedBookingForCancel] = useState<CustomerBooking | null>(null);
  const [cancelReason, setCancelReason] = useState('Change of travel plans');
  const [cancelNote, setCancelNote] = useState('');
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [cancelSuccessMsg, setCancelSuccessMsg] = useState<string | null>(null);
  const [isProcessingCancel, setIsProcessingCancel] = useState(false);

  useEffect(() => {
    if (!user?.email) return;

    const userList = getUserBookings(user.email);

    // Find matching bookings in Operations context
    const matchingCust = customers.find(
      (c) =>
        c.email?.toLowerCase() === user.email.toLowerCase() ||
        c.id === user.id ||
        (user.email === 'chukwudi@drivefleet.demo' && c.id === 'c-adeyemi')
    );
    const targetCustId =
      matchingCust?.id || (user.email === 'chukwudi@drivefleet.demo' ? 'c-adeyemi' : user.id);

    const relevantOpBookings = opBookings.filter(
      (b) =>
        b.customerId === targetCustId ||
        b.customerId === user.id ||
        b.customerId === user.email
    );

    // Merge operations bookings into user bookings list
    const combined: CustomerBooking[] = [...userList];

    for (const ob of relevantOpBookings) {
      const existingIdx = combined.findIndex((cb) => cb.id === ob.reference || cb.id === ob.id);
      const veh = vehicles.find((v) => v.id === ob.vehicleId);

      if (existingIdx === -1) {
        combined.push({
          id: ob.reference,
          vehicle: veh ? `${veh.make} ${veh.model} (${veh.year})` : 'Assigned Fleet Vehicle',
          plate: veh?.plate || 'TBD',
          category: veh?.category || 'sedan',
          status: toCustomerBookingStatus(ob.status),
          dates: `${ob.quote?.billedPeriods || 3} Days (${ob.pickupAt.split('T')[0]} → ${ob.returnAt.split('T')[0]})`,
          pickupAt: ob.pickupAt,
          returnAt: ob.returnAt,
          hub: veh?.branch?.name || (ob.branchId.includes('2') ? 'Abuja Central Terminal' : 'Lagos Ikeja Main Hub'),
          amountMinor: ob.quote?.totalMinor || 15000000,
          image: veh?.images?.[0] || 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=600',
        });
      } else {
        // Live sync status and updates from Operations
        combined[existingIdx] = {
          ...combined[existingIdx],
          status: toCustomerBookingStatus(ob.status),
          cancelReason: ob.latestVersion?.changeReason || combined[existingIdx].cancelReason,
        };
      }
    }

    setBookings(combined);
  }, [user?.email, user?.id, opBookings, vehicles, customers]);

  const upcomingCount = bookings.filter((b) => b.status === 'confirmed').length;
  const completedCount = bookings.filter((b) => b.status === 'completed').length;
  const cancelledCount = bookings.filter((b) => b.status === 'cancelled').length;

  const filtered = bookings.filter((b) => {
    if (filterTab === 'upcoming' && b.status !== 'confirmed') return false;
    if (filterTab === 'completed' && b.status !== 'completed') return false;
    if (filterTab === 'cancelled' && b.status !== 'cancelled') return false;
    if (
      searchQuery &&
      !b.id.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !b.vehicle.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const handleOpenCancelModal = (booking: CustomerBooking) => {
    setSelectedBookingForCancel(booking);
    setCancelReason('Change of travel plans');
    setCancelNote('');
    setCancelError(null);
  };

  const handleConfirmCancel = () => {
    if (!user?.email || !selectedBookingForCancel) return;
    setIsProcessingCancel(true);
    setCancelError(null);

    const fullReason = cancelNote.trim()
      ? `${cancelReason} - ${cancelNote.trim()}`
      : cancelReason;

    const result = cancelUserBooking(user.email, selectedBookingForCancel.id, fullReason);
    cancelBooking(selectedBookingForCancel.id, fullReason);

    setIsProcessingCancel(false);

    if (!result.success) {
      setCancelError(result.error || 'Failed to cancel reservation.');
      return;
    }

    if (result.updatedBookings) {
      setBookings(result.updatedBookings);
    }
    setCancelSuccessMsg(`Reservation #${selectedBookingForCancel.id} has been cancelled successfully.`);
    setSelectedBookingForCancel(null);

    // Auto-clear success message after 5 seconds
    setTimeout(() => {
      setCancelSuccessMsg(null);
    }, 5000);
  };

  return (
    <div className="space-y-6">
      {/* Success Notification */}
      {cancelSuccessMsg && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-800 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{cancelSuccessMsg}</span>
          </div>
          <button
            onClick={() => setCancelSuccessMsg(null)}
            className="text-emerald-700 hover:text-emerald-900 text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Filter and Search Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: `All Bookings (${bookings.length})` },
            { id: 'upcoming', label: `Upcoming (${upcomingCount})` },
            { id: 'completed', label: `Completed (${completedCount})` },
            { id: 'cancelled', label: `Cancelled (${cancelledCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                filterTab === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by reference, make, or plate..."
            className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
      </div>

      {/* Bookings List Cards */}
      {filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Photo */}
                <img
                  src={item.image}
                  alt={item.vehicle}
                  className="w-full md:w-56 h-36 rounded-xl object-cover border border-slate-200 shrink-0"
                />

                {/* Middle Details */}
                <div className="flex-1 space-y-3 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-bold text-sm text-slate-900">{item.id}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        item.status === 'confirmed'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : item.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}
                    >
                      {item.status}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">Plate: {item.plate}</span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900">{item.vehicle}</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.dates}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.hub}</span>
                    </div>
                  </div>

                  {item.odometerDelta && (
                    <div className="text-[11px] text-emerald-700 font-medium bg-emerald-50/60 px-2.5 py-1 rounded-lg border border-emerald-200/60 inline-block">
                      ✓ Returned & Inspected: {item.odometerDelta} • 0 defects recorded
                    </div>
                  )}

                  {item.cancelReason && (
                    <div className="text-[11px] text-red-700 bg-red-50/60 p-2.5 rounded-lg border border-red-200/80">
                      <span className="font-semibold block mb-0.5">Cancellation Details:</span>
                      {item.cancelReason}
                    </div>
                  )}
                </div>

                {/* Right Financial & Actions */}
                <div className="w-full md:w-48 text-left md:text-right shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100 space-y-3">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">Total Billed</div>
                    <div className="text-xl font-black text-slate-900">
                      {formatCurrency(item.amountMinor)}
                    </div>
                    <span className="text-[10px] text-slate-400 block">
                      {item.status === 'cancelled' ? 'Deposit released' : 'Guaranteed reservation rate'}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {item.status === 'confirmed' ? (
                      <>
                        <Link
                          to={`/booking-confirmation/${item.id}`}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          <span>Pickup Voucher</span>
                        </Link>
                        
                        {/* Cancel Reservation Button */}
                        <button
                          type="button"
                          onClick={() => handleOpenCancelModal(item)}
                          className="w-full text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 font-semibold py-1.5 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <XCircle className="w-3.5 h-3.5 text-red-500" />
                          <span>Cancel Reservation</span>
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => alert('Download VAT invoice PDF (demo)')}
                        className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-1.5 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Download Receipt</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <CarFront className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-1.5">
            <h3 className="text-lg font-bold text-slate-900">
              {filterTab === 'all'
                ? 'No reservations found'
                : `No ${filterTab} reservations found`}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {bookings.length === 0
                ? "You haven't made any car rental reservations yet. Explore our verified fleet across Lagos and Abuja to plan your next journey."
                : `There are currently no bookings in the "${filterTab}" category matching your search.`}
            </p>
          </div>
          <div>
            <Link
              to="/vehicles"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm transition-colors"
            >
              <span>Book a Car Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Cancel Reservation Modal */}
      {selectedBookingForCancel && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-red-600">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Cancel Reservation</h3>
                  <p className="text-xs text-slate-500 font-mono">Ref: {selectedBookingForCancel.id}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBookingForCancel(null)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none p-1"
              >
                ✕
              </button>
            </div>

            {/* Vehicle Card Info */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center gap-3">
              <img
                src={selectedBookingForCancel.image}
                alt={selectedBookingForCancel.vehicle}
                className="w-16 h-12 rounded-lg object-cover border border-slate-200"
              />
              <div className="text-xs">
                <div className="font-bold text-slate-900">{selectedBookingForCancel.vehicle}</div>
                <div className="text-slate-500">{selectedBookingForCancel.dates}</div>
                <div className="font-mono text-blue-600 font-semibold">{formatCurrency(selectedBookingForCancel.amountMinor)}</div>
              </div>
            </div>

            {/* Policy Notice Box */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-amber-950">
                <span>Free Cancellation Policy</span>
              </div>
              <p className="text-amber-800 leading-relaxed text-[11px]">
                Free cancellation is permitted up to <strong>24 hours prior to scheduled pickup</strong>. 
                Upon cancellation, the reserved vehicle is released back to active inventory and your pre-authorization/deposit hold is immediately released.
              </p>
            </div>

            {/* Error in modal if any */}
            {cancelError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{cancelError}</span>
              </div>
            )}

            {/* Reason selection */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Reason for Cancellation
                </label>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="Change of travel plans">Change of travel plans</option>
                  <option value="Selected wrong dates or time">Selected wrong dates or time</option>
                  <option value="Need a different vehicle class">Need a different vehicle class</option>
                  <option value="Found alternative transport">Found alternative transport</option>
                  <option value="Emergency or personal reasons">Emergency or personal reasons</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Additional Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={cancelNote}
                  onChange={(e) => setCancelNote(e.target.value)}
                  placeholder="Provide any feedback for our dispatch concierge..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedBookingForCancel(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Keep Reservation
              </button>
              <button
                type="button"
                disabled={isProcessingCancel}
                onClick={handleConfirmCancel}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 shadow-sm transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                {isProcessingCancel ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Confirm Cancellation</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
