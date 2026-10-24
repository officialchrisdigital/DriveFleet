import React, { useState } from 'react';
import { useOperations } from '@/contexts/OperationsContext';
import { formatCurrency } from '@/lib/formatters';
import { downloadCsv } from '@/lib/csvExport';
import {
  DollarSign, Plus, Calendar, ShieldCheck, Tag,
  Calculator, ArrowRight, CheckCircle2, AlertCircle, X, Download
} from 'lucide-react';

export function PricingManagementPage() {
  const { pricingOverrides, addPricingOverride, vehicles } = useOperations();

  const [weekendSurcharge, setWeekendSurcharge] = useState(10); // 10% default
  const [testBaseRate, setTestBaseRate] = useState(45000); // NGN 45,000
  const [testDays, setTestDays] = useState(3);
  const [includeWeekend, setIncludeWeekend] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newScope, setNewScope] = useState<'global' | 'category' | 'vehicle'>('global');
  const [newTargetId, setNewTargetId] = useState('');
  const [newStartDate, setNewStartDate] = useState('');
  const [newEndDate, setNewEndDate] = useState('');
  const [newMultiplier, setNewMultiplier] = useState(1.20); // +20%
  const [newReason, setNewReason] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Simulated Test Quote
  const testSubtotal = includeWeekend
    ? testBaseRate + Math.round(testBaseRate * (1 + weekendSurcharge / 100)) * (testDays - 1)
    : testBaseRate * testDays;

  const handleCreateOverride = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newStartDate || !newEndDate) {
      return;
    }

    addPricingOverride({
      name: newName.trim(),
      scope: newScope,
      targetId: newTargetId || undefined,
      startDate: newStartDate,
      endDate: newEndDate,
      multiplier: Number(newMultiplier),
      reason: newReason.trim() || 'Seasonal demand dynamic rate rule',
    });

    setIsModalOpen(false);
    setNewName('');
    setNewStartDate('');
    setNewEndDate('');
    setNewReason('');
    setFeedbackMsg('New pricing override successfully saved to the active billing engine!');
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const handleExportCsv = () => {
    const rows = pricingOverrides.map((ov) => ({
      'Rule Name': ov.name,
      'Scope': ov.scope,
      'Target Asset / Category': ov.targetId || 'All Fleet',
      'Start Date': ov.startDate,
      'End Date': ov.endDate,
      'Multiplier': `${Math.round((ov.multiplier - 1) * 100)}% surcharge`,
      'Reason': ov.reason,
    }));
    downloadCsv('drivefleet-pricing-rules.csv', rows);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Pricing Rules & Date Override Engine
            </h1>
            <span className="text-[10px] font-bold text-blue-700 uppercase px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200">
              Deterministic Engine Active
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Configure vehicle category base tariffs, automated weekend surcharges (+10%), and scope-prioritized date overrides.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>New Date Override</span>
          </button>
        </div>
      </div>

      {feedbackMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left (7 cols): Active Rules and Precedence Hierarchy */}
        <div className="lg:col-span-7 space-y-6">
          {/* Standing Weekend Rule Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>Deterministic Weekend Rate Rule</span>
              </h3>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Active System Rule
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              When a rental period commences on Saturday or Sunday (evaluated in Africa/Lagos business timezone), the base daily rate automatically applies a <strong className="text-slate-900">+{weekendSurcharge}% surcharge</strong>, unless superceded by a date-specific override.
            </p>

            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
              <span className="font-bold text-slate-800">Current Weekend Surcharge:</span>
              <span className="font-mono text-base font-black text-blue-600">+{weekendSurcharge}%</span>
              <span className="text-[10px] text-slate-400 font-mono">(Applies half-up minor unit rounding)</span>
            </div>
          </div>

          {/* Active Overrides Table */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Configured Date-Range Overrides</h3>
              <span className="text-xs font-bold text-blue-600 font-mono">{pricingOverrides.length} rules active</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase text-[10px] font-semibold">
                  <tr>
                    <th className="py-2.5 px-4">Rule Title</th>
                    <th className="py-2.5 px-4">Scope</th>
                    <th className="py-2.5 px-4">Dates</th>
                    <th className="py-2.5 px-4">Rate Adjustment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {pricingOverrides.map((ov) => {
                    const surchargePct = Math.round((ov.multiplier - 1) * 100);
                    return (
                      <tr key={ov.id} className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 font-bold text-slate-900">
                          {ov.name}
                          <div className="text-[10px] text-slate-400 font-normal mt-0.5">{ov.reason}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="capitalize px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-semibold text-[10px]">
                            {ov.scope}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                          {ov.startDate} to {ov.endDate}
                        </td>
                        <td className="py-3 px-4 font-bold text-blue-600">
                          {surchargePct >= 0 ? `+${surchargePct}%` : `${surchargePct}%`}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right (5 cols): Live Interactive Calculator */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Calculator className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">Live Rate Simulator</h3>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Base Daily Tariff (₦)</label>
              <input
                type="number"
                step={5000}
                value={testBaseRate}
                onChange={(e) => setTestBaseRate(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Rental Duration (Days)</label>
              <input
                type="number"
                min={1}
                max={30}
                value={testDays}
                onChange={(e) => setTestDays(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="incWeekend"
                checked={includeWeekend}
                onChange={(e) => setIncludeWeekend(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-slate-300"
              />
              <label htmlFor="incWeekend" className="font-semibold text-slate-700 cursor-pointer">
                Commence on weekend (+{weekendSurcharge}%)
              </label>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 mt-4">
              <div className="flex justify-between font-medium text-slate-600">
                <span>Calculated Total Quote:</span>
                <span className="font-black font-mono text-base text-slate-900">
                  {formatCurrency(testSubtotal * 100)}
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                Pricing engine enforces 24-hour clock quantization and half-up arithmetic rounding.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* New Override Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">Add Date-Specific Rate Override</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOverride} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Override Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Easter Holiday Peak Surcharge"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Scope</label>
                  <select
                    value={newScope}
                    onChange={(e) => setNewScope(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="global">Global (All Fleet)</option>
                    <option value="category">Category Specific</option>
                    <option value="vehicle">Single Vehicle Asset</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Rate Surcharge</label>
                  <select
                    value={newMultiplier}
                    onChange={(e) => setNewMultiplier(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value={1.10}>+10% Holiday Surcharge</option>
                    <option value={1.15}>+15% Peak Surcharge</option>
                    <option value={1.20}>+20% High Demand</option>
                    <option value={1.25}>+25% Super Peak</option>
                    <option value={0.90}>-10% Off-Peak Discount</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={newStartDate}
                    onChange={(e) => setNewStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">End Date *</label>
                  <input
                    type="date"
                    required
                    value={newEndDate}
                    onChange={(e) => setNewEndDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Business Reason</label>
                <textarea
                  rows={2}
                  placeholder="e.g. High demand during national conference dates."
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-sm"
                >
                  Save Override Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
