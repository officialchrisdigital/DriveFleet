import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useOperations } from '@/contexts/OperationsContext';
import { formatCurrency, formatKilometers } from '@/lib/formatters';
import {
  Bookmark, ArrowLeft, Printer, Edit, KeyRound, CheckCircle2,
  XCircle, Car, User, Calendar, DollarSign, ShieldCheck,
  AlertTriangle, Phone, Mail, Clock, Download
} from 'lucide-react';

export function BookingDetailPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const { bookings, vehicles, customers, cancelBooking } = useOperations();
  const navigate = useNavigate();

  const booking = bookings.find((b) => b.id === bookingId || b.reference === bookingId);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  if (!booking) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <Bookmark className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h2 className="text-base font-bold text-slate-900">Reservation Record Not Found</h2>
        <p className="text-xs text-slate-500 mt-1">The requested booking does not exist or has been removed.</p>
        <Link
          to="/admin/bookings"
          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Booking Ledger
        </Link>
      </div>
    );
  }

  const customer = customers.find((c) => c.id === booking.customerId);
  const vehicle = vehicles.find((v) => v.id === booking.vehicleId);

  const handlePrintVoucher = () => {
    window.print();
  };

  const handleConfirmCancel = () => {
    cancelBooking(booking.id, cancelReason || 'Customer requested operational cancellation');
    setCancelModalOpen(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full uppercase flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Active On Road
          </span>
        );
      case 'confirmed':
        return (
          <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full uppercase flex items-center gap-1.5">
            Confirmed Upcoming
          </span>
        );
      case 'completed':
        return (
          <span className="text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full uppercase">
            Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-3 py-1 rounded-full uppercase">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full uppercase">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 print:hidden">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/bookings"
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight font-mono">
                {booking.reference}
              </h1>
              {getStatusBadge(booking.status)}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Logged via <span className="font-semibold uppercase">{booking.sourceChannel} Channel</span> on{' '}
              {new Date(booking.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handlePrintVoucher}
            className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
            title="Print or Save Official Booking Voucher as PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Receipt / PDF</span>
          </button>

          {booking.status === 'confirmed' && (
            <Link
              to={`/admin/bookings/${booking.id}/pickup`}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <KeyRound className="w-4 h-4" />
              <span>Launch Pickup SOP</span>
            </Link>
          )}

          {booking.status === 'active' && (
            <Link
              to={`/admin/bookings/${booking.id}/return`}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Launch Return SOP</span>
            </Link>
          )}

          {booking.status !== 'cancelled' && booking.status !== 'completed' && (
            <>
              <Link
                to={`/admin/bookings/${booking.id}/edit`}
                className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Amend</span>
              </Link>

              <button
                onClick={() => setCancelModalOpen(true)}
                className="bg-white hover:bg-red-50 border border-red-200 text-red-600 text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Cancel</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Printable Receipt / Voucher Container */}
      <div className="space-y-6 print:p-4">
        {/* Reservation Timeline Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>Rental Schedule & Dispatch Milestones</span>
            </span>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
              {booking.quote?.billedPeriods || 1} Billed Day(s)
            </span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                Scheduled Pickup Handover
              </span>
              <div className="text-base font-bold text-slate-900 mt-2">
                {new Date(booking.pickupAt).toLocaleDateString(undefined, {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </div>
              <div className="text-xs text-slate-500 font-mono mt-0.5">
                Time: {new Date(booking.pickupAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className="text-xs text-slate-600 mt-2 font-medium">
                Node: {vehicle?.branch?.name || 'Lagos Ikeja Main Hub'}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] uppercase font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                Scheduled Return Check-in
              </span>
              <div className="text-base font-bold text-slate-900 mt-2">
                {new Date(booking.returnAt).toLocaleDateString(undefined, {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </div>
              <div className="text-xs text-slate-500 font-mono mt-0.5">
                Time: {new Date(booking.returnAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className="text-xs text-slate-600 mt-2 font-medium">
                Node: {vehicle?.branch?.name || 'Lagos Ikeja Main Hub'}
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Split: Customer & Vehicle */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer Dossier */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                <span>Customer & Driver Record</span>
              </h2>
              {customer && (
                <Link
                  to={`/admin/customers/${customer.id}`}
                  className="text-xs font-bold text-blue-600 hover:underline print:hidden"
                >
                  View Full CRM Dossier
                </Link>
              )}
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] block uppercase font-bold">Renter Name</span>
                <span className="font-bold text-slate-900 text-sm">
                  {customer ? `${customer.firstName} ${customer.lastName}` : 'Walk-in Client'}
                </span>
                <span className="text-slate-500 block">{customer?.company || 'Private Account'}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                <div>
                  <span className="text-slate-400 text-[10px] block uppercase font-bold">Email Address</span>
                  <span className="font-mono text-slate-800">{customer?.email || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block uppercase font-bold">Phone Number</span>
                  <span className="text-slate-800">{customer?.phone || 'N/A'}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                <div className="flex items-center gap-1 font-bold text-slate-800 text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>FRSC Driver License Validation</span>
                </div>
                <div className="font-mono font-bold text-slate-900">
                  {customer?.renterDetails?.licenseNumber || 'Verified at Counter'}
                </div>
                <div className="text-[10px] text-slate-500">
                  Expiry: {customer?.renterDetails?.licenseExpiry || 'N/A'}
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle Dossier */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Car className="w-4 h-4 text-blue-600" />
                <span>Assigned Fleet Vehicle</span>
              </h2>
              {vehicle && (
                <Link
                  to={`/admin/vehicles/${vehicle.id}`}
                  className="text-xs font-bold text-blue-600 hover:underline print:hidden"
                >
                  View Vehicle Dossier
                </Link>
              )}
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3">
                <img
                  src={vehicle?.images?.[0] || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=300'}
                  alt={vehicle?.model || 'Fleet Asset'}
                  className="w-16 h-12 object-cover rounded-lg border border-slate-200 shrink-0"
                />
                <div>
                  <div className="font-bold text-slate-900 text-sm">
                    {vehicle?.make} {vehicle?.model} ({vehicle?.year})
                  </div>
                  <div className="font-mono font-bold text-blue-600 mt-0.5">
                    Plate: {vehicle?.plate} • {vehicle?.category.toUpperCase()}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                <div>
                  <span className="text-slate-400 text-[10px] block uppercase font-bold">Odometer Telemetry</span>
                  <span className="font-mono font-bold text-slate-800">
                    {formatKilometers(vehicle?.currentOdometerKm || 0)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block uppercase font-bold">Mileage Allowance</span>
                  <span className="font-semibold text-slate-800">
                    {vehicle?.mileageAllowanceKm || 200} km / day
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] text-slate-600">
                Transmission: <span className="font-bold capitalize">{vehicle?.transmission}</span> • Fuel:{' '}
                <span className="font-bold capitalize">{vehicle?.fuelType}</span> • Seats:{' '}
                <span className="font-bold">{vehicle?.seats}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Quote Ledger */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span>Financial Ledger & Quote Breakdown</span>
          </h2>

          <div className="space-y-3 text-xs max-w-lg">
            <div className="flex justify-between items-center text-slate-600">
              <span>Rental Charge ({booking.quote?.billedPeriods || 1} Days @ Daily Tariff)</span>
              <span className="font-semibold text-slate-900">
                {formatCurrency(booking.quote?.subtotalMinor || 0)}
              </span>
            </div>

            {(booking.quote?.feesMinor || 0) > 0 && (
              <div className="flex justify-between items-center text-slate-600">
                <span>Selected Add-ons & Equipment</span>
                <span className="font-semibold text-slate-900">
                  {formatCurrency(booking.quote?.feesMinor || 0)}
                </span>
              </div>
            )}

            <div className="flex justify-between items-center text-slate-600">
              <span>Caution Security Deposit (100% Refundable)</span>
              <span className="font-semibold text-slate-900">
                {formatCurrency(booking.quote?.depositMinor || 5000000)}
              </span>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-base">
              <span className="font-black text-slate-900">Total Billed Volume</span>
              <span className="font-black text-blue-600 text-lg">
                {formatCurrency(booking.quote?.totalMinor || 0)}
              </span>
            </div>

            <div className="text-[11px] text-slate-500 pt-1">
              Payment Status: <span className="font-bold text-emerald-600">Pre-Authorized / Verified via Gateway</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cancellation Modal */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center gap-2 text-red-600 font-bold text-sm">
              <AlertTriangle className="w-5 h-5" />
              <span>Cancel Reservation #{booking.reference}</span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to cancel this reservation? This will immediately release the vehicle back into available inventory on the dispatch calendar.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Cancellation Reason / Note
              </label>
              <textarea
                rows={2}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="e.g. Customer requested schedule shift or flight cancelled..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCancelModalOpen(false)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Keep Booking
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-sm"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
