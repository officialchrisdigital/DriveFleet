import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { formatCurrency, formatKilometers } from '@/lib/formatters';
import {
  ClipboardCheck, CheckCircle2, AlertTriangle, Fuel, Gauge,
  ShieldAlert, ArrowLeft, RefreshCw, Wrench
} from 'lucide-react';

export function ReturnInspectionPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();

  const pickupKm = 18420;
  const includedAllowanceKm = 600; // 3 days x 200 km
  const excessRateMinor = 15000; // NGN 150/km

  const [returnKm, setReturnKm] = useState<number>(18900); // 480 km used
  const [returnFuel, setReturnFuel] = useState('8/8');
  const [vehicleSafe, setVehicleSafe] = useState(true);
  const [newDefectsRecorded, setNewDefectsRecorded] = useState(false);
  const [defectNotes, setDefectNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculations
  const distanceDrivenKm = Math.max(0, returnKm - pickupKm);
  const excessKm = Math.max(0, distanceDrivenKm - includedAllowanceKm);
  const excessOdometerChargeMinor = excessKm * excessRateMinor;

  const refuelChargeMinor = returnFuel === '8/8' ? 0 : 1250000; // NGN 12,500 demo refuel fee if not 8/8
  const totalExtraChargesMinor = excessOdometerChargeMinor + refuelChargeMinor;

  const handleCompleteReturn = (e: React.FormEvent) => {
    e.preventDefault();
    if (returnKm < pickupKm) {
      alert(`ODOMETER_REGRESSION: Return odometer (${returnKm} km) cannot decrease relative to pickup reading (${pickupKm} km)`);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      if (!vehicleSafe) {
        alert('Inspection Completed: Vehicle marked UNSAFE. Automatically quarantined to In Maintenance state (PRD FR-11).');
      } else {
        alert('Inspection Completed: Rental marked COMPLETED. Vehicle returned to READY for pickup.');
      }
      navigate('/admin/bookings');
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Breadcrumb Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 text-xs">
        <Link to="/admin/bookings" className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Bookings</span>
        </Link>
        <span className="text-[10px] font-bold text-slate-500 uppercase bg-slate-100 px-2 py-0.5 rounded">
          SOP Protocol FR-09 / FR-11
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div>
          <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">
            Vehicle Return Inspection & Fuel SOP
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
            Return Inspection: Booking #DF-2026-9812
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Toyota RAV4 XLE AWD (LAG-802-AB) • Pickup Baseline: 18,420 km
          </p>
        </div>

        <form onSubmit={handleCompleteReturn} className="space-y-6">
          {/* Telemetry and Odometer Differential */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Pickup Odometer</span>
              <div className="text-lg font-mono font-bold text-slate-800 mt-0.5">
                {formatKilometers(pickupKm)}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-blue-600 shadow-sm">
              <label className="text-[10px] uppercase font-bold text-blue-600 block mb-1">
                Return Odometer (km)
              </label>
              <input
                type="number"
                value={returnKm}
                onChange={(e) => setReturnKm(Number(e.target.value))}
                min={pickupKm}
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-base font-mono font-bold text-slate-900"
              />
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Telemetry Delta</span>
              <div className="text-lg font-mono font-bold text-emerald-600 mt-0.5">
                +{distanceDrivenKm} km driven
              </div>
              <span className="text-[10px] text-slate-400">
                {excessKm > 0 ? `${excessKm} km excess` : 'Within 600 km allowance'}
              </span>
            </div>
          </div>

          {/* Fuel Inspection */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <label className="block text-xs font-bold text-slate-900 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Fuel className="w-4 h-4 text-slate-500" />
                <span>Return Fuel Level</span>
              </span>
              <span className="text-[10px] text-slate-500">Dispatch was 8/8 Full</span>
            </label>
            <select
              value={returnFuel}
              onChange={(e) => setReturnFuel(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold text-slate-900"
            >
              <option value="8/8">8/8 Full (Compliant - No Refueling Fee)</option>
              <option value="7/8">7/8 Tank (Incurs Refueling Surcharge)</option>
              <option value="6/8">6/8 Tank (Incurs Refueling Surcharge)</option>
              <option value="4/8">4/8 Half Tank (Incurs Refueling Surcharge)</option>
            </select>
          </div>

          {/* Safety & Damage Assessment (PRD FR-11 Integration) */}
          <div className="p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
            <div className="font-bold text-slate-900 flex items-center justify-between">
              <span>Vehicle Operational Condition Disposition</span>
              <span className="text-[10px] text-slate-400 font-normal">Routes vehicle post-return</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                className={`p-3 rounded-xl border cursor-pointer transition-colors ${
                  vehicleSafe
                    ? 'border-emerald-500 bg-emerald-50/50 text-emerald-900'
                    : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                <input
                  type="radio"
                  name="safety"
                  checked={vehicleSafe}
                  onChange={() => setVehicleSafe(true)}
                  className="mr-2 text-emerald-600"
                />
                <strong className="block">Vehicle Clean & Ready for Rental</strong>
                <span className="text-[10px] text-slate-500">Routes asset back to Ready fleet pool</span>
              </label>

              <label
                className={`p-3 rounded-xl border cursor-pointer transition-colors ${
                  !vehicleSafe
                    ? 'border-red-500 bg-red-50/50 text-red-900'
                    : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                <input
                  type="radio"
                  name="safety"
                  checked={!vehicleSafe}
                  onChange={() => setVehicleSafe(false)}
                  className="mr-2 text-red-600"
                />
                <strong className="block text-red-700">Unsafe / Requires Maintenance Quarantine</strong>
                <span className="text-[10px] text-slate-500">
                  Blocks availability & triggers urgent maintenance work order
                </span>
              </label>
            </div>

            {!vehicleSafe && (
              <div className="pt-2">
                <label className="block text-xs font-semibold text-red-800 mb-1">
                  Describe Mechanical / Body Defect Reason
                </label>
                <textarea
                  value={defectNotes}
                  onChange={(e) => setDefectNotes(e.target.value)}
                  placeholder="e.g. Cracked windshield on Lagos-Ibadan expressway or engine warning light active..."
                  rows={2}
                  className="w-full bg-red-50 border border-red-200 rounded-xl p-2.5 text-xs text-red-900"
                  required
                />
              </div>
            )}
          </div>

          {/* Extra Charges Breakdown if applicable */}
          {totalExtraChargesMinor > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-2 text-xs text-amber-900">
              <div className="font-bold flex items-center justify-between">
                <span>Disclosed Configured Excess Charges:</span>
                <span className="font-mono text-sm">{formatCurrency(totalExtraChargesMinor)}</span>
              </div>
              {excessOdometerChargeMinor > 0 && (
                <div className="flex justify-between text-[11px] text-amber-800">
                  <span>Excess Mileage ({excessKm} km @ NGN 150/km):</span>
                  <span className="font-mono">{formatCurrency(excessOdometerChargeMinor)}</span>
                </div>
              )}
              {refuelChargeMinor > 0 && (
                <div className="flex justify-between text-[11px] text-amber-800">
                  <span>Depot Refuel Surcharge:</span>
                  <span className="font-mono">{formatCurrency(refuelChargeMinor)}</span>
                </div>
              )}
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              Staff Agent: Marcus Vance (Inspector)
            </span>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-6 rounded-xl text-xs shadow-sm transition-colors flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Recording Inspection...' : 'Complete Return & Settle Rental'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
