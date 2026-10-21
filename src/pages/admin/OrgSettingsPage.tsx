import React, { useState } from 'react';
import {
  Settings, Building, MapPin, Calendar, Clock,
  ShieldCheck, CheckCircle2, Save
} from 'lucide-react';

export function OrgSettingsPage() {
  const [orgName, setOrgName] = useState('DriveFleet Technologies Ltd');
  const [currency, setCurrency] = useState('NGN');
  const [timezone, setTimezone] = useState('Africa/Lagos');
  const [cutoffHours, setCutoffHours] = useState(24);
  const [defaultMileageKm, setDefaultMileageKm] = useState(200);
  const [excessMileageRateMinor, setExcessMileageRateMinor] = useState(15000); // NGN 150/km
  const [turnaroundBufferMins, setTurnaroundBufferMins] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Enterprise Organization Settings
          </h1>
          <span className="text-[10px] font-bold text-slate-500 uppercase px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
            PRD FR-13
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Master business policy parameters, operating hub defaults, and currency/timezone standards.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Brand & Identity */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Building className="w-4 h-4 text-blue-600" />
            <span>Organization Profile</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Company Legal Name</label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Operating Currency</label>
              <input
                type="text"
                value="Nigerian Naira (NGN)"
                disabled
                className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Business Operating Timezone</label>
              <input
                type="text"
                value="Africa/Lagos (WAT, UTC+1)"
                disabled
                className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Turnaround Buffer Window (Minutes)</label>
              <input
                type="number"
                value={turnaroundBufferMins}
                onChange={(e) => setTurnaroundBufferMins(Number(e.target.value))}
                min={0}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-medium"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Source default is 0 minutes. If set, expands the blocked availability window after rental.
              </span>
            </div>
          </div>
        </div>

        {/* Booking & Cancellation SLA Policies */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Rental & Cancellation Policies (PRD Section 15)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Fee-Free Cancellation Cutoff (Hours Prior to Pickup)
              </label>
              <input
                type="number"
                value={cutoffHours}
                onChange={(e) => setCutoffHours(Number(e.target.value))}
                min={1}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-medium"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Changes within this window require authorized staff handling with a recorded reason.
              </span>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Default Daily Mileage Allowance (km)
              </label>
              <input
                type="number"
                value={defaultMileageKm}
                onChange={(e) => setDefaultMileageKm(Number(e.target.value))}
                min={50}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-medium"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between pt-2">
          {isSaved ? (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Settings updated & applied to future calculations.</span>
            </span>
          ) : (
            <div />
          )}

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-colors shadow-sm flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
}
