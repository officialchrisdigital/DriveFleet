import React, { useState } from 'react';
import { formatCurrency } from '@/lib/formatters';
import {
  Tag, Plus, Calendar, CheckCircle2, XCircle,
  Clock, RefreshCw, AlertCircle
} from 'lucide-react';

export function PromosManagementPage() {
  const promos = [
    {
      code: 'FLEETDEMO10',
      type: 'percentage',
      value: '10% Off',
      validity: 'Jan 01, 2026 – Dec 31, 2026',
      minDuration: '1 Day',
      maxUses: 1000,
      currentUses: 14,
      status: 'active',
    },
    {
      code: 'EXPIRED20',
      type: 'percentage',
      value: '20% Off',
      validity: 'Jan 01, 2025 – Dec 31, 2025',
      minDuration: '3 Days',
      maxUses: 50,
      currentUses: 50,
      status: 'expired',
    },
    {
      code: 'CORPEXEC5000',
      type: 'fixed',
      value: 'NGN 5,000 Off',
      validity: 'Jul 01, 2026 – Nov 30, 2026',
      minDuration: '7 Days',
      maxUses: 200,
      currentUses: 32,
      status: 'active',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Promotions & Voucher Management
            </h1>
            <span className="text-[10px] font-bold text-slate-500 uppercase px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
              PRD §9.3 Promo Rules
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage promotional discount vouchers, redemption limits, and validity windows.
          </p>
        </div>

        <button
          onClick={() => alert('New promo creation dialog (Admin action)')}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Promo Code</span>
        </button>
      </div>

      {/* Promos Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase text-[10px] font-semibold">
              <tr>
                <th className="py-3 px-4">Promo Code</th>
                <th className="py-3 px-4">Discount Type & Value</th>
                <th className="py-3 px-4">Validity Window</th>
                <th className="py-3 px-4">Min. Duration</th>
                <th className="py-3 px-4">Redemptions / Cap</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
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
                  <td className="py-3.5 px-4 font-bold text-blue-600">
                    {p.value}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                    {p.validity}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 font-medium">
                    {p.minDuration}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-medium text-slate-800">
                    {p.currentUses} / {p.maxUses} used
                  </td>
                  <td className="py-3.5 px-4">
                    {p.status === 'active' ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Active
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500">
                        Expired
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => alert(`Edit promo ${p.code}`)}
                      className="text-xs text-blue-600 hover:text-blue-800 font-semibold p-1 hover:bg-blue-50 rounded"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1">
        <div className="font-bold text-slate-800">PRD Promo Enforcement Constraints:</div>
        <div>• At most <strong>one promo code</strong> is applicable per booking version.</div>
        <div>• Promos apply strictly <em>after</em> the duration discount tier (7d=10%, 30d=20%).</div>
        <div>• Fixed promos are capped at the eligible rental charge and cannot produce a negative amount.</div>
      </div>
    </div>
  );
}
