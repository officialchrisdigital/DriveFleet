import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useOperations } from '@/contexts/OperationsContext';
import { formatCurrency, formatKilometers } from '@/lib/formatters';
import {
  ClipboardCheck, CheckCircle2, AlertTriangle, Fuel, Gauge,
  ShieldAlert, ArrowLeft, RefreshCw, Wrench
} from 'lucide-react';

export function ReturnInspectionPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { bookings, vehicles, updateBooking, updateVehicle, addMaintenanceTask } = useOperations();

  const booking = bookings.find((b) => b.id === bookingId || b.reference === bookingId);
  const vehicle = booking ? vehicles.find((v) => v.id === booking.vehicleId) : null;

  const pickupKm = vehicle?.currentOdometerKm || 18420;
  const includedAllowanceKm = 600; // default 3 days x 200 km
  const excessRateMinor = 15000; // NGN 150/km

  const [returnKm, setReturnKm] = useState<number>(pickupKm + 250);
  const [returnFuel, setReturnFuel] = useState('8/8');
  const [vehicleSafe, setVehicleSafe] = useState(true);
  const [newDefectsRecorded, setNewDefectsRecorded] = useState(false);
  const [defectNotes, setDefectNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (pickupKm) {
      setReturnKm(pickupKm + 180);
    }
  }, [pickupKm]);

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

  // Calculations
  const distanceDrivenKm = Math.max(0, returnKm - pickupKm);
  const excessKm = Math.max(0, distanceDrivenKm - includedAllowanceKm);
  const excessOdometerChargeMinor = excessKm * excessRateMinor;

  const refuelChargeMinor = returnFuel === '8/8' ? 0 : 1250000; // NGN 12,500 demo refuel fee if not 8/8
  const totalExtraChargesMinor = excessOdometerChargeMinor + refuelChargeMinor;

  const handleCompleteReturn = (e: React.FormEvent) => {
    e.preventDefault();
    if (returnKm < pickupKm) {
      setError(`Return odometer (${returnKm} km) cannot decrease relative to pickup reading (${pickupKm} km)`);
      return;
    }

    setIsSubmitting(true);

    const officerName = user ? `${user.firstName} ${user.lastName} (${user.role.toUpperCase()})` : 'Return Officer';

    // 1. Mark booking completed with authenticated officer attribution
    updateBooking(booking.id, {
      status: 'completed',
      latestVersion: {
        changeReason: `Vehicle checked in by ${officerName}. Final odometer: ${returnKm} km. Fuel: ${returnFuel}.`,
        actorId: officerName,
      } as any,
    });

    // 2. If vehicle marked unsafe or defects noted, put in maintenance; otherwise ready
    if (vehicle) {
      if (!vehicleSafe || newDefectsRecorded) {
        updateVehicle(vehicle.id, {
          operationalState: 'in_maintenance',
          currentOdometerKm: returnKm,
        });

        // Auto-add maintenance work order
        addMaintenanceTask({
          vehicleId: vehicle.id,
          taskType: 'Post-Return Inspection & Damage Remediation',
          reason: defectNotes || 'Safety issues or physical damage flagged during return inspection SOP.',
          priority: 'urgent',
          assigneeName: 'Station Workshop Supervisor',
          blocksAvailability: true,
          notes: `Return Odometer: ${returnKm} km. Issues: ${defectNotes || 'Inspection flagged.'}`,
          createdBy: user?.id || user?.email || 'operations',
          createdByName: officerName,
        });
      } else {
        updateVehicle(vehicle.id, {
          operationalState: 'ready',
          currentOdometerKm: returnKm,
        });
      }
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
          SOP Protocol FR-09 / FR-11
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div>
          <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">
            Vehicle Return Inspection & Fuel SOP
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
            Return Inspection: #{booking.reference}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model} (${vehicle.plate})` : booking.vehicleId} • Renter: {customerName}
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleCompleteReturn} className="space-y-6">
          {/* Telemetry Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Gauge className="w-4 h-4 text-blue-600" />
                <span>Return Odometer (KM) *</span>
              </label>
              <input
                type="number"
                value={returnKm}
                onChange={(e) => setReturnKm(Number(e.target.value))}
                min={pickupKm}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono text-sm font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <div className="flex justify-between text-[11px] text-slate-500 pt-0.5 font-mono">
                <span>Pickup reading: {formatKilometers(pickupKm)}</span>
                <span className="text-blue-600 font-bold">Driven: {distanceDrivenKm} km</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Fuel className="w-4 h-4 text-blue-600" />
                <span>Return Fuel Tank Level *</span>
              </label>
              <select
                value={returnFuel}
                onChange={(e) => setReturnFuel(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
              >
                <option value="8/8">8/8 Full Tank (No Refuel Surcharge)</option>
                <option value="7/8">7/8 Tank (1/8 Deficiency)</option>
                <option value="6/8">3/4 Tank (2/8 Deficiency)</option>
                <option value="4/8">1/2 Tank (Half Empty)</option>
                <option value="2/8">1/4 Tank (Low Fuel)</option>
              </select>
              {returnFuel !== '8/8' && (
                <span className="text-[10px] text-amber-700 font-semibold block">
                  Automatic refuel surcharge of {formatCurrency(refuelChargeMinor)} will be applied.
                </span>
              )}
            </div>
          </div>

          {/* Safety & Physical Damage Check */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Roadworthiness & Safety Quarantine Assessment
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 bg-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={vehicleSafe}
                  onChange={(e) => setVehicleSafe(e.target.checked)}
                  className="rounded text-blue-600 w-4 h-4"
                />
                <span className="font-semibold text-slate-800">
                  Vehicle Safe for Immediate Re-dispatch
                </span>
              </label>

              <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 bg-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={newDefectsRecorded}
                  onChange={(e) => setNewDefectsRecorded(e.target.checked)}
                  className="rounded text-amber-600 w-4 h-4"
                />
                <span className="font-semibold text-slate-800">
                  New Damage / Scratches Recorded
                </span>
              </label>
            </div>

            {(!vehicleSafe || newDefectsRecorded) && (
              <div className="space-y-1.5 pt-2">
                <label className="block text-xs font-bold text-amber-900">
                  Defect Description & Quarantine Work Order Scope *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Describe scratches, dent locations, or mechanical faults..."
                  value={defectNotes}
                  onChange={(e) => setDefectNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-amber-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Settle Summary Box */}
          <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-2 text-xs">
            <div className="flex justify-between font-bold text-slate-800">
              <span>Security Deposit Status:</span>
              <span className="text-emerald-700">Eligible for Full / Adjusted Release</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Excess Mileage Charges ({excessKm} km over allowance):</span>
              <span className="font-mono">{formatCurrency(excessOdometerChargeMinor)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Refuel Surcharge:</span>
              <span className="font-mono">{formatCurrency(refuelChargeMinor)}</span>
            </div>
            <div className="flex justify-between font-bold text-slate-900 pt-2 border-t border-blue-200">
              <span>Total Extra Deductions:</span>
              <span className="font-mono text-sm text-blue-700">{formatCurrency(totalExtraChargesMinor)}</span>
            </div>
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
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Closing Out...' : 'Complete Return & Audit Inspection'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
