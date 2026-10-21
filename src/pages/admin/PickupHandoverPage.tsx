import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { formatCurrency, formatKilometers } from '@/lib/formatters';
import {
  ClipboardCheck, Camera, CheckCircle2, AlertTriangle,
  Fuel, Gauge, ShieldCheck, ArrowLeft, Lock
} from 'lucide-react';

export function PickupHandoverPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();

  const [odometer, setOdometer] = useState<number>(18420);
  const [fuelLevel, setFuelLevel] = useState('8/8');
  const [exteriorClean, setExteriorClean] = useState(true);
  const [interiorClean, setInteriorClean] = useState(true);
  const [spareTirePresent, setSpareTirePresent] = useState(true);
  const [jackToolboxPresent, setJackToolboxPresent] = useState(true);
  const [notes, setNotes] = useState('Vehicle in pristine staging condition. Zero visible dents.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMarkPickedUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (odometer < 18420) {
      alert('ODOMETER_REGRESSION: Pickup odometer cannot be less than current recorded reading (18,420 km)');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Pickup Handover inspection verified & logged. Booking #DF-2026-9812 transitioned to ACTIVE.');
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
          SOP Protocol FR-09
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div>
          <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider">
            Vehicle Handover Inspection
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
            Pickup Handover: Booking #DF-2026-9812
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Toyota RAV4 XLE AWD (LAG-802-AB) • Assigned Renter: Chukwudi Adeyemi
          </p>
        </div>

        <form onSubmit={handleMarkPickedUp} className="space-y-6">
          {/* Driver License & Identity Verification Check */}
          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-2 text-xs">
            <div className="font-bold text-blue-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Identity & License Verification Checklist</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700 text-[11px]">
              <div>✓ FRSC Driver's License: FRSC-LAG-8492018B (Valid through 2028)</div>
              <div>✓ National Identity Slip: Verified against Chukwudi Adeyemi</div>
            </div>
          </div>

          {/* Odometer & Fuel Reading */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <label className="block text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Gauge className="w-4 h-4 text-slate-500" />
                <span>Odometer Reading (km)</span>
              </label>
              <input
                type="number"
                value={odometer}
                onChange={(e) => setOdometer(Number(e.target.value))}
                min={18420}
                required
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono font-bold text-slate-900"
              />
              <span className="text-[10px] text-slate-500 block">
                Baseline recorded in master registry: 18,420 km
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <label className="block text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Fuel className="w-4 h-4 text-slate-500" />
                <span>Fuel Tank Level at Dispatch</span>
              </label>
              <select
                value={fuelLevel}
                onChange={(e) => setFuelLevel(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-bold text-slate-900"
              >
                <option value="8/8">8/8 Full (Standard Dispatch)</option>
                <option value="7/8">7/8 Full</option>
                <option value="6/8">6/8 Full</option>
              </select>
              <span className="text-[10px] text-emerald-700 font-semibold block">
                ✓ Full-to-Full fuel policy active
              </span>
            </div>
          </div>

          {/* Condition Checklist */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-900">Station Condition Inspection:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <label className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={exteriorClean}
                  onChange={(e) => setExteriorClean(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span className="font-semibold text-slate-800">Exterior Clean & Washed</span>
              </label>

              <label className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={interiorClean}
                  onChange={(e) => setInteriorClean(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span className="font-semibold text-slate-800">Interior Clean & Sanitized</span>
              </label>

              <label className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={spareTirePresent}
                  onChange={(e) => setSpareTirePresent(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span className="font-semibold text-slate-800">Spare Tire & Wheel Lock Present</span>
              </label>

              <label className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={jackToolboxPresent}
                  onChange={(e) => setJackToolboxPresent(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span className="font-semibold text-slate-800">Jack & Emergency Warning Triangle</span>
              </label>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-900 mb-1">
              Station Handover Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-medium text-slate-800"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              Logged by: Marcus Vance (Operations Lead)
            </span>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl text-xs shadow-sm transition-colors flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Recording SOP...' : 'Complete Pickup & Activate Rental'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
