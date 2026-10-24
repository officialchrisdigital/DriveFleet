import React, { useState } from 'react';
import { useOperations } from '@/contexts/OperationsContext';
import { downloadCsv } from '@/lib/csvExport';
import {
  Activity, Search, Filter, ShieldCheck, Clock,
  User, CheckCircle2, AlertTriangle, Lock, Download
} from 'lucide-react';

export function AuditTrailPage() {
  const { auditLogs } = useOperations();
  const [filterEntity, setFilterEntity] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = auditLogs.filter((e) => {
    if (filterEntity !== 'all' && e.type !== filterEntity) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        e.action.toLowerCase().includes(q) ||
        e.entity.toLowerCase().includes(q) ||
        e.actor.toLowerCase().includes(q) ||
        e.reason.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleExportCsv = () => {
    const rows = filtered.map((e) => ({
      'ID': e.id,
      'Timestamp': e.timestamp,
      'Action Event': e.action,
      'Affected Entity': e.entity,
      'Acting Staff / Sentinel': e.actor,
      'Operational Reason': e.reason,
      'Type': e.type,
    }));
    downloadCsv('drivefleet-audit-trail.csv', rows);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Operational Audit Trail & Ledger
            </h1>
            <span className="text-[10px] font-bold text-slate-500 uppercase px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200">
              Immutable Ledger
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Cryptographically sealed, immutable record of vehicle state transitions, booking lock mutations, and pricing overrides.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterEntity}
            onChange={(e) => setFilterEntity(e.target.value)}
            className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Audit Entities</option>
            <option value="booking">Bookings</option>
            <option value="vehicle">Vehicles</option>
            <option value="customer">Customers</option>
            <option value="maintenance">Maintenance</option>
            <option value="team">Team & Roles</option>
            <option value="inspection">Inspections</option>
            <option value="pricing">Pricing Rules</option>
            <option value="system">System Sentinel</option>
          </select>

          <button
            onClick={handleExportCsv}
            className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase text-[10px] font-semibold">
              <tr>
                <th className="py-3 px-4">Timestamp (UTC+1)</th>
                <th className="py-3 px-4">Action Event</th>
                <th className="py-3 px-4">Affected Entity</th>
                <th className="py-3 px-4">Acting Staff / Sentinel</th>
                <th className="py-3 px-4">Operational Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                    {item.timestamp}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-[11px] bg-slate-100 px-2 py-0.5 rounded text-slate-800 border border-slate-200">
                      {item.action}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    {item.entity}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-medium">
                    {item.actor}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate">
                    {item.reason}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
        <Lock className="w-3.5 h-3.5 text-emerald-600" />
        <span>
          Audit entries are append-only. Passwords, reset tokens, and customer identity documents are strictly omitted from payloads.
        </span>
      </div>
    </div>
  );
}
