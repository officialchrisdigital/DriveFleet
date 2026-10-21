import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency, formatKilometers } from '@/lib/formatters';
import {
  Wrench, Plus, AlertTriangle, ShieldAlert, CheckCircle2,
  Calendar, Clock, User, Filter, AlertCircle
} from 'lucide-react';

export function MaintenanceRegistryPage() {
  const [filterStatus, setFilterStatus] = useState('all');

  const tasks = [
    {
      id: 'm-rio-brake',
      vehicle: 'Kia Rio EX (2022)',
      plate: 'LAG-330-MT',
      hub: 'Lagos Ikeja Main Hub',
      taskType: 'Brake Pads & Rotor Overhaul',
      reason: 'Brake lining wear threshold reached during 50,000 km audit',
      priority: 'urgent',
      status: 'in_progress',
      assignee: 'Babatunde Ade (Master Tech)',
      scheduledStart: 'Oct 20, 2026',
      scheduledEnd: 'Oct 22, 2026',
      estimatedCostMinor: 8500000, // NGN 85,000
      blocksAvailability: true,
    },
    {
      id: 'm-camry-40k',
      vehicle: 'Toyota Camry XLE (2024)',
      plate: 'LAG-104-AB',
      hub: 'Lagos Ikeja Main Hub',
      taskType: '40,000 km Scheduled Factory Service',
      reason: 'Telemetry threshold approaching (39,850 km current)',
      priority: 'high',
      status: 'scheduled',
      assignee: 'Amara Kalu (Fleet Lead)',
      scheduledStart: 'Oct 28, 2026',
      scheduledEnd: 'Oct 29, 2026',
      estimatedCostMinor: 4500000, // NGN 45,000
      blocksAvailability: true,
    },
    {
      id: 'm-c300-detail',
      vehicle: 'Mercedes-Benz C300 (2023)',
      plate: 'LAG-992-ZZ',
      hub: 'Lagos Ikeja Main Hub',
      taskType: 'Executive Ceramic Coating & Detailing',
      reason: 'VIP Diplomatic Escort Preparation',
      priority: 'low',
      status: 'completed',
      assignee: 'Marcus Vance',
      scheduledStart: 'Oct 15, 2026',
      scheduledEnd: 'Oct 16, 2026',
      estimatedCostMinor: 6000000,
      actualCostMinor: 5800000,
      blocksAvailability: false,
    },
  ];

  const filtered = tasks.filter((t) => {
    if (filterStatus !== 'all' && t.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Fleet Maintenance & Work Order Registry</h1>
            <span className="text-[10px] font-bold text-slate-500 uppercase px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
              PRD FR-11
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Track scheduled servicing, mileage threshold alerts, and vehicle downtime quarantine blocks.
          </p>
        </div>

        <Link
          to="/admin/maintenance/new"
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Work Order</span>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 text-xs">
        {['all', 'in_progress', 'scheduled', 'completed'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-3 py-1.5 rounded-lg font-bold capitalize transition-colors ${
              filterStatus === status
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {status.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Work Orders List (Exact Mockup Match) */}
      <div className="space-y-4">
        {filtered.map((task) => (
          <div
            key={task.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    task.priority === 'urgent'
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : task.priority === 'high'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {task.priority} Priority
                </span>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    task.status === 'in_progress'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : task.status === 'scheduled'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}
                >
                  {task.status.replace('_', ' ')}
                </span>

                {task.blocksAvailability && (
                  <span className="text-[10px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                    🔒 Availability Blocked
                  </span>
                )}
              </div>

              <div className="text-xs font-mono font-bold text-slate-600">
                Est. Cost: {formatCurrency(task.estimatedCostMinor)}
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">{task.taskType}</h3>
              <p className="text-xs text-slate-500">
                Target Asset: <strong>{task.vehicle}</strong> (Plate: {task.plate}) • {task.hub}
              </p>
              <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mt-2">
                Reason: {task.reason}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
              <div className="flex items-center gap-4">
                <span>Assignee: <strong>{task.assignee}</strong></span>
                <span>Scheduled: <strong>{task.scheduledStart} – {task.scheduledEnd}</strong></span>
              </div>

              <div className="flex items-center gap-2">
                {task.status !== 'completed' && (
                  <button
                    onClick={() => alert(`Task ${task.id} marked COMPLETED. Availability block released in master fleet calendar.`)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs shadow-sm transition-colors"
                  >
                    Mark Work Completed ✓
                  </button>
                )}
                <Link
                  to={`/admin/maintenance/${task.id}/edit`}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-3 py-1.5 rounded-lg text-xs transition-colors"
                >
                  Edit Task
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
