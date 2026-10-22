import React, { useState } from 'react';
import {
  Activity, Search, Filter, ShieldCheck, Clock,
  User, CheckCircle2, AlertTriangle, Lock
} from 'lucide-react';

export function AuditTrailPage() {
  const [filterEntity, setFilterEntity] = useState('all');

  const auditEntries = [
    {
      id: 'aud-001',
      actor: 'Marcus Vance (Admin)',
      action: 'BOOKING_LOCKED',
      entity: 'Booking #DF-2026-9812',
      reason: 'Customer completed simulated atomic checkout',
      timestamp: 'Today @ 10:14:02 AM',
      type: 'booking',
    },
    {
      id: 'aud-002',
      actor: 'Amara Kalu (Staff)',
      action: 'MAINTENANCE_QUARANTINE_LOCKED',
      entity: 'Vehicle LAG-330-MT (Kia Rio)',
      reason: 'Brake pads worn past threshold. Availability blocked.',
      timestamp: 'Yesterday @ 03:22:15 PM',
      type: 'maintenance',
    },
    {
      id: 'aud-003',
      actor: 'Marcus Vance (Admin)',
      action: 'RATE_OVERRIDE_CREATED',
      entity: 'Override: Diplomatic Prado Weekend Peak',
      reason: 'Peak holiday demand rate adjustment',
      timestamp: 'Oct 19, 2026 @ 11:05:40 AM',
      type: 'pricing',
    },
    {
      id: 'aud-004',
      actor: 'System Sentinel',
      action: 'CONCURRENCY_COLLISION_PREVENTED',
      entity: 'Vehicle LAG-802-AB (Toyota RAV4)',
      reason: 'Rejected concurrent conflicting interval attempt during checkout race',
      timestamp: 'Oct 18, 2026 @ 02:40:19 PM',
      type: 'system',
    },
    {
      id: 'aud-005',
      actor: 'Marcus Vance (Admin)',
      action: 'RETURN_INSPECTION_RECORDED',
      entity: 'Booking #DF-2026-7814',
      reason: 'Return odometer logged (18,420 km). 0 defects.',
      timestamp: 'Sep 15, 2026 @ 10:00:00 AM',
      type: 'inspection',
    },
  ];

  const filtered = auditEntries.filter((e) => {
    if (filterEntity !== 'all' && e.type !== filterEntity) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Operational Audit Trail & Ledger
            </h1>
            <span className="text-[10px] font-bold text-slate-500 uppercase px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
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
            className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-800 shadow-sm"
          >
            <option value="all">All Audit Entities</option>
            <option value="booking">Bookings</option>
            <option value="maintenance">Maintenance</option>
            <option value="pricing">Pricing Rules</option>
            <option value="system">System Sentinel</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table (Exact Mockup Match) */}
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
