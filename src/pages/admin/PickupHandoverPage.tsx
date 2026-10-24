import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useOperations } from '@/contexts/OperationsContext';
import { formatCurrency, formatKilometers } from '@/lib/formatters';
import {
  ClipboardCheck, Camera, CheckCircle2, AlertTriangle,
  Fuel, Gauge, ShieldCheck, ArrowLeft, Lock
} from 'lucide-react';

export function PickupHandoverPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { bookings, vehicles, updateBooking, updateVehicle } = useOperations();

  const booking = bookings.find((b) => b.id === bookingId || b.reference === bookingId);
  const vehicle = booking ? vehicles.find((v) => v.id === booking.vehicleId) : null;

  const currentOdometer = vehicle?.currentOdometerKm || 18420;

  const [odometer, setOdometer] = useState<number>(currentOdometer);
  const [fuelLevel, setFuelLevel] = useState('8/8');
  const [exteriorClean, setExteriorClean] = useState(true);
  const [interiorClean, setInteriorClean] = useState(true);
  const [spareTirePresent, setSpareTirePresent] = useState(true);
  const [jackToolboxPresent, setJackToolboxPresent] = useState(true);
  const [notes, setNotes] = useState('Vehicle in pristine staging condition. Zero visible dents.');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (vehicle) {
      setOdometer(vehicle.currentOdometerKm);
    }
  }, [vehicle]);

  if (!booking) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 max-w-xl mx-auto">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h2 className="text-base font-bold text-slate-900">Booking Record Not Found</h2>
        <p className="text-xs text-slate-500 mt-1">Unable to locate reservation #{bookingId}.</p>
        <Link
          to="/admin/bookings"
          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Reservations Ledger
        </Link>
      </div>
    );
  }

  const handleMarkPickedUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (odometer < currentOdometer) {
      setError(`Pickup odometer (${odometer} km) cannot be less than current recorded reading (${currentOdometer} km)`);
      return;
    }

    setIsSubmitting(true);

    const officerName = user ? `${user.firstName} ${user.lastName} (${user.role.toUpperCase()})` : 'Station Officer';

    // Update booking status to active with authenticated officer attribution
    updateBooking(booking.id, {
      status: 'active',
      latestVersion: {
        changeReason: `Vehicle and keys handed over by ${officerName}. Inspection confirmed pristine.`,
        actorId: officerName,
      } as any,
    });

    // Update vehicle odometer
    if (vehicle) {
      updateVehicle(vehicle.id, {
        currentOdometerKm: odometer,
      });
    }

    setTimeout(() => {
      setIsSubmitting(false);
      navigate(`/admin/bookings/${booking.id}`);
    }, 400);
  };

  const customerName = booking.customer
    ? `${booking.customer.firstName} ${booking.customer.lastName}`
    : 'Customer';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Breadcrumb Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 text-xs">
        <Link to={`/admin/bookings/${booking.id}`} className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Booking #{booking.reference}</span>
        </Link>
        <span className="text-[10px] font-bold text-slate-500 uppercase bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
          SOP Protocol FR-09
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div>
          <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider">
            Vehicle Handover Inspection
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
            Pickup Handover: #{booking.reference}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model} (${vehicle.plate})` : booking.vehicleId} • Assigned Renter: {customerName}
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleMarkPickedUp} className="space-y-6">
          {/* Driver License & Identity Verification Check */}
          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-2 text-xs">
            <div className="font-bold text-blue-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Identity & License Verification Checklist</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700 text-[11px]">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                <span>Physical Driver's License Inspected & Valid</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                <span>Renter Identity Matches Reservation Name</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                <span>Security Deposit Authorized</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                <span>Digital Rental Agreement Counter-Signed</span>
              </label>
            </div>
          </div>

          {/* Odometer & Fuel Reading */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Gauge className="w-4 h-4 text-blue-600" />
                <span>Pickup Odometer (KM)</span>
              </label>
              <input
                type="number"
                value={odometer}
                onChange={(e) => setOdometer(Number(e.target.value))}
                min={currentOdometer}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono text-sm font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <span className="text-[10px] text-slate-400">
                Current fleet reading: {formatKilometers(currentOdometer)}
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Fuel className="w-4 h-4 text-blue-600" />
                <span>Pickup Fuel Tank Level</span>
              </label>
              <select
                value={fuelLevel}
                onChange={(e) => setFuelLevel(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
              >
                <option value="8/8">8/8 Full Tank (Standard Fleet Staging)</option>
                <option value="7/8">7/8 Tank</option>
                <option value="6/8">3/4 Tank</option>
                <option value="4/8">1/2 Tank</option>
              </select>
            </div>
          </div>

          {/* Physical Condition Checklist */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Physical Asset Condition & Safety Gear
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={exteriorClean}
                  onChange={(e) => setExteriorClean(e.target.checked)}
                  className="rounded text-blue-600 w-4 h-4"
                />
                <span className="font-medium text-slate-800">Exterior Washed & Inspected</span>
              </label>

              <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={interiorClean}
                  onChange={(e) => setInteriorClean(e.target.checked)}
                  className="rounded text-blue-600 w-4 h-4"
                />
                <span className="font-medium text-slate-800">Interior Valeted & Sanitized</span>
              </label>

              <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={spareTirePresent}
                  onChange={(e) => setSpareTirePresent(e.target.checked)}
                  className="rounded text-blue-600 w-4 h-4"
                />
                <span className="font-medium text-slate-800">Full Spare Tire Verified</span>
              </label>

              <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={jackToolboxPresent}
                  onChange={(e) => setJackToolboxPresent(e.target.checked)}
                  className="rounded text-blue-600 w-4 h-4"
                />
                <span className="font-medium text-slate-800">Jack, Warning Triangle & First Aid</span>
              </label>
            </div>
          </div>

          {/* Inspection Notes */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Handover Remarks & Pre-existing Markings
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <Link
              to={`/admin/bookings/${booking.id}`}
              className="px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Verifying...' : 'Complete Handover & Release Vehicle'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
