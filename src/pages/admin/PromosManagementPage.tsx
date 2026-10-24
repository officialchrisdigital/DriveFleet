import React, { useState } from 'react';
import { useOperations } from '@/contexts/OperationsContext';
import { formatCurrency } from '@/lib/formatters';
import { downloadCsv } from '@/lib/csvExport';
import {
  Tag, Plus, Calendar, CheckCircle2, XCircle,
  Clock, RefreshCw, AlertCircle, X, Download
} from 'lucide-react';

export function PromosManagementPage() {
  const { promos, addPromo, togglePromo } = useOperations();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'flat'>('percentage');
  const [discountValue, setDiscountValue] = useState(10);
  const [minDurationDays, setMinDurationDays] = useState(1);
  const [expiresAt, setExpiresAt] = useState('2026-12-31');
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleCreatePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    addPromo({
      code: code.trim().toUpperCase(),
      name: name.trim() || `${code.trim().toUpperCase()} Promo`,
      discountType,
      discountValue: Number(discountValue),
      minDurationDays: Number(minDurationDays),
      active: true,
      expiresAt,
    });

    setIsModalOpen(false);
    setCode('');
    setName('');
    setFeedback(`Promo code ${code.trim().toUpperCase()} successfully created!`);
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleExportCsv = () => {
    const rows = promos.map((p) => ({
      'Promo Code': p.code,
      'Campaign Name': p.name,
      'Discount Type': p.discountType,
      'Discount Value': p.discountType === 'percentage' ? `${p.discountValue}%` : `NGN ${p.discountValue}`,
      'Min Duration Days': p.minDurationDays,
      'Redemptions': p.usageCount,
      'Expires At': p.expiresAt,
      'Active': p.active ? 'Yes' : 'No',
    }));
    downloadCsv('drivefleet-promos.csv', rows);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Promotions & Voucher Management
            </h1>
            <span className="text-[10px] font-bold text-blue-700 uppercase px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200">
              {promos.length} Vouchers Configured
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage promotional discount vouchers, redemption limits, and validity windows.
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
            <span>New Promo Code</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Promos Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase text-[10px] font-semibold">
              <tr>
                <th className="py-3 px-4">Promo Code</th>
                <th className="py-3 px-4">Campaign Name</th>
                <th className="py-3 px-4">Discount Value</th>
                <th className="py-3 px-4">Min. Duration</th>
                <th className="py-3 px-4">Redemptions</th>
                <th className="py-3 px-4">Validity</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Toggle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {promos.map((p) => (
                <tr key={p.code} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                      {p.code}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    {p.name}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-blue-600">
                    {p.discountType === 'percentage' ? `${p.discountValue}% Off` : `₦${p.discountValue.toLocaleString()} Off`}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-medium">
                    {p.minDurationDays} {p.minDurationDays === 1 ? 'day' : 'days'}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                    {p.usageCount} uses
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                    Expires: {p.expiresAt}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                        p.active
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}
                    >
                      {p.active ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => togglePromo(p.code)}
                      className={`text-xs font-bold px-2.5 py-1 rounded-lg transition-colors ${
                        p.active
                          ? 'text-rose-600 hover:bg-rose-50'
                          : 'text-emerald-600 hover:bg-emerald-50'
                      }`}
                    >
                      {p.active ? 'Disable' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Promo Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">Create Promotional Voucher</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePromo} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Voucher Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. WEEKEND20"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono font-bold uppercase text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Campaign Title</label>
                <input
                  type="text"
                  placeholder="e.g. Weekend Flash Sale"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Discount Type</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Fixed Naira (₦)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Value {discountType === 'percentage' ? '(%)' : '(₦)'}
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Min Days</label>
                  <input
                    type="number"
                    min={1}
                    value={minDurationDays}
                    onChange={(e) => setMinDurationDays(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Expiration Date</label>
                  <input
                    type="date"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
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
                  Create Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
