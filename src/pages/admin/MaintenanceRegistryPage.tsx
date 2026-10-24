import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useOperations } from '@/contexts/OperationsContext';
import { formatCurrency, formatKilometers } from '@/lib/formatters';
import { downloadCsv } from '@/lib/csvExport';
import {
  Wrench, Plus, AlertTriangle, ShieldAlert, CheckCircle2,
  Calendar, Clock, User, Filter, AlertCircle, Download, ChevronRight, Edit
} from 'lucide-react';

export function MaintenanceRegistryPage() {
  const { maintenanceTasks, vehicles, completeMaintenanceTask } = useOperations();
  const navigate = useNavigate();

  const [filterStatus, setFilterStatus] = useState('all');

  const filtered = maintenanceTasks.filter((t) => {
    if (filterStatus !== 'all' && t.status !== filterStatus) return false;
    return true;
  });

  const handleExportCsv = () => {
    const headers = [
      'Task ID',
      'Vehicle Plate',
      'Vehicle Model',
      'Service Type',
      'Reason',
      'Priority',
      'Status',
      'Technician',
      'Start Date',
      'End Date',
      'Estimated Cost (NGN)',
      'Blocks Availability',
    ];

    const rows = filtered.map((t) => {
      const v = vehicles.find((veh) => veh.id === t.vehicleId);
      return [
        t.id,
        v?.plate || 'N/A',
        v ? `${v.make} ${v.model}` : 'Fleet Unit',
        t.taskType,
        t.reason || '',
        t.priority.toUpperCase(),
        t.status.toUpperCase(),
        t.assigneeName || 'Unassigned',
        t.scheduledStart ? new Date(t.scheduledStart).toLocaleDateString() : 'N/A',
        t.scheduledEnd ? new Date(t.scheduledEnd).toLocaleDateString() : 'N/A',
        (t.estimatedCostMinor || 0) / 100,
        t.blocksAvailability ? 'YES' : 'NO',
      ];
    });

    downloadCsv('drivefleet-maintenance-ledger.csv', headers, rows);
  };

  const inProgressCount = maintenanceTasks.filter((m) => m.status === 'in_progress').length;
  const scheduledCount = maintenanceTasks.filter((m) => m.status === 'scheduled').length;
  const completedCount = maintenanceTasks.filter((m) => m.status === 'completed').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Fleet Maintenance & Work Order Registry
            </h1>
            <span className="text-[10px] font-bold text-slate-500 uppercase px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
              Active Registry
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Service work orders, downtime availability blocking, telemetry trigger thresholds, and repair authorizations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
            title="Download Maintenance Records CSV"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Maintenance CSV</span>
          </button>

          <Link
            to="/admin/maintenance/new"
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>+ Schedule Service Work Order</span>
          </Link>
        </div>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-[10px] uppercase font-bold text-slate-400">Total Work Orders</div>
          <div className="text-xl font-black text-slate-900 mt-0.5">{maintenanceTasks.length} Tasks</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-[10px] uppercase font-bold text-amber-600">In Progress (Bay Locked)</div>
          <div className="text-xl font-black text-amber-600 mt-0.5">{inProgressCount} Units</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-[10px] uppercase font-bold text-blue-600">Scheduled Approaching</div>
          <div className="text-xl font-black text-blue-600 mt-0.5">{scheduledCount} Units</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-[10px] uppercase font-bold text-emerald-600">Completed & Released</div>
          <div className="text-xl font-black text-emerald-600 mt-0.5">{completedCount} Units</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-slate-700">Filter Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="all">All Maintenance Statuses</option>
            <option value="in_progress">In Progress Only</option>
            <option value="scheduled">Scheduled Only</option>
            <option value="completed">Completed Only</option>
          </select>
        </div>
      </div>

      {/* Task List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            No maintenance records match this status filter.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 text-xs">
            {filtered.map((task) => {
              const v = vehicles.find((veh) => veh.id === task.vehicleId);

              return (
                <div
                  key={task.id}
                  className="p-4 hover:bg-slate-50 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  {/* Left: Task & Vehicle info */}
                  <div className="flex items-start gap-3.5 min-w-[280px]">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        task.priority === 'urgent'
                          ? 'bg-red-50 text-red-600 border border-red-200'
                          : task.priority === 'high'
                          ? 'bg-amber-50 text-amber-600 border border-amber-200'
                          : 'bg-blue-50 text-blue-600 border border-blue-200'
                      }`}
                    >
                      <Wrench className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/admin/maintenance/${task.id}`}
                          className="font-bold text-slate-900 text-sm hover:text-blue-600 transition-colors"
                        >
                          {task.taskType}
                        </Link>
                        <span
                          className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            task.priority === 'urgent'
                              ? 'bg-red-100 text-red-700'
                              : task.priority === 'high'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {task.priority} Priority
                        </span>
                      </div>

                      <div className="text-slate-600 text-xs font-semibold mt-0.5">
                        {v ? `${v.make} ${v.model}` : 'Fleet Vehicle'} •{' '}
                        <span className="font-mono font-bold text-slate-900">{v?.plate}</span> •{' '}
                        <span className="text-slate-500 font-normal">{v?.branch?.name}</span>
                      </div>

                      <p className="text-slate-500 text-[11px] mt-1 line-clamp-1">{task.reason}</p>
                    </div>
                  </div>

                  {/* Middle: Technician & Dates */}
                  <div className="text-xs space-y-1 min-w-[220px]">
                    <div className="text-slate-700 font-medium">
                      Assigned Tech: <span className="font-bold text-slate-900">{task.assigneeName}</span>
                    </div>
                    <div className="text-slate-500 text-[11px] flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        {task.scheduledStart ? new Date(task.scheduledStart).toLocaleDateString() : 'Immediate'} –{' '}
                        {task.scheduledEnd ? new Date(task.scheduledEnd).toLocaleDateString() : 'TBD'}
                      </span>
                    </div>
                    {task.blocksAvailability && (
                      <span className="text-[10px] font-bold text-red-600 flex items-center gap-1">
                        <ShieldAlert className="w-3 h-3" />
                        Locks Calendar Availability
                      </span>
                    )}
                  </div>

                  {/* Right: Estimated Cost & Actions */}
                  <div className="flex items-center justify-between lg:justify-end gap-3 shrink-0">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Est. Cost</span>
                      <span className="font-bold text-slate-900 text-sm">
                        {formatCurrency(task.estimatedCostMinor || 0)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {task.status !== 'completed' ? (
                        <button
                          type="button"
                          onClick={() => completeMaintenanceTask(task.id)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors flex items-center gap-1"
                          title="Complete service and return vehicle to READY state"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Mark Complete</span>
                        </button>
                      ) : (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-lg">
                          ✓ Completed
                        </span>
                      )}

                      <Link
                        to={`/admin/maintenance/${task.id}`}
                        className="p-1.5 rounded-lg border border-slate-200 hover:border-blue-500 hover:text-blue-600 text-slate-600 transition-colors"
                        title="View Work Order details"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Link>

                      <Link
                        to={`/admin/maintenance/${task.id}/edit`}
                        className="p-1.5 rounded-lg border border-slate-200 hover:border-blue-500 hover:text-blue-600 text-slate-600 transition-colors"
                        title="Edit Work Order"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
