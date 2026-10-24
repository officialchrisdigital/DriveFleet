import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useOperations } from '@/contexts/OperationsContext';
import { Priority } from '@/lib/types';
import {
  Wrench, ArrowLeft, CheckCircle2, ShieldAlert,
  Calendar, DollarSign, Car, User
} from 'lucide-react';

export function AddMaintenancePage() {
  const { vehicles, teamMembers, addMaintenanceTask } = useOperations();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const preselectedVehicleId = searchParams.get('vehicleId') || '';

  const [vehicleId, setVehicleId] = useState(preselectedVehicleId || (vehicles[0]?.id ?? ''));
  const [taskType, setTaskType] = useState('Factory Routine Inspection & Service');
  const [reason, setReason] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [assigneeName, setAssigneeName] = useState('Babatunde Ade (Master Tech)');

  const todayStr = new Date().toISOString().split('T')[0];
  const endDefaultStr = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(endDefaultStr);
  const [estimatedCostNaira, setEstimatedCostNaira] = useState(45000);
  const [blocksAvailability, setBlocksAvailability] = useState(true);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskType.trim()) {
      setError('Service / Task title is required.');
      return;
    }

    const newTask = addMaintenanceTask({
      vehicleId,
      taskType: taskType.trim(),
      reason: reason.trim() || 'Routine preventative fleet inspection',
      priority,
      assigneeName: assigneeName.trim() || 'Duty Technician',
      scheduledStart: `${startDate}T08:00:00Z`,
      scheduledEnd: `${endDate}T18:00:00Z`,
      estimatedCostMinor: estimatedCostNaira * 100,
      blocksAvailability,
      notes: notes.trim(),
      createdBy: user?.id || user?.email || 'operations',
      createdByName: user ? `${user.firstName} ${user.lastName} (${user.role.toUpperCase()})` : 'Fleet Operations',
    });

    navigate(`/admin/maintenance/${newTask.id}`);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
        <Link
          to="/admin/maintenance"
          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Schedule Maintenance Work Order
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Authorize vehicle service, set technician assignments, and lock calendar availability.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
        <div>
          <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Wrench className="w-4 h-4 text-amber-600" />
            <span>Task Specifications & Target Asset</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Select Fleet Vehicle <span className="text-red-500">*</span>
              </label>
              <select
                value={vehicleId}
                onChange={(e) => setVehicleId(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.make} {v.model} ({v.year}) – {v.plate} – {v.branch?.city} Hub [{v.operationalState.toUpperCase()}]
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Service Task Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={taskType}
                onChange={(e) => setTaskType(e.target.value)}
                placeholder="e.g. Brake Pads & Rotor Overhaul"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Priority Level</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low Priority (Cosmetic / Detailing)</option>
                <option value="medium">Medium Priority (Scheduled Inspection)</option>
                <option value="high">High Priority (Approaching Limit)</option>
                <option value="urgent">Urgent / Safety Hazard</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Assigned Lead Technician / Station Staff
                </label>
                {teamMembers.length > 0 && (
                  <span className="text-[10px] text-blue-600 font-semibold">
                    Quick-pick from active team roster
                  </span>
                )}
              </div>
              <input
                type="text"
                value={assigneeName}
                onChange={(e) => setAssigneeName(e.target.value)}
                placeholder="e.g. Babatunde Ade (Master Tech)"
                list="team-members-list"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <datalist id="team-members-list">
                {teamMembers.map((tm) => (
                  <option key={tm.id} value={`${tm.firstName} ${tm.lastName} (${tm.role.toUpperCase()} - ${tm.branch})`} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Estimated Service Cost (₦)
              </label>
              <input
                type="number"
                step={1000}
                min={0}
                value={estimatedCostNaira}
                onChange={(e) => setEstimatedCostNaira(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Scheduled Start Date
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Estimated Completion Date
              </label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Trigger Reason / Fault Diagnosis
              </label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Brake lining wear threshold reached during return inspection audit"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Availability Locking Feature */}
        <div className="pt-4 border-t border-slate-100">
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 flex items-start gap-3">
            <input
              type="checkbox"
              id="blocksAvailability"
              checked={blocksAvailability}
              onChange={(e) => setBlocksAvailability(e.target.checked)}
              className="mt-0.5 rounded text-amber-600 focus:ring-amber-500"
            />
            <label htmlFor="blocksAvailability" className="text-xs cursor-pointer">
              <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                Lock Availability on Dispatch Calendar (Downtime Block)
              </span>
              <span className="text-slate-600 text-[11px] mt-0.5 block">
                When enabled, DriveFleet automatically transitions the vehicle to <strong>In Maintenance</strong> and creates a solid lock bar on the dispatch timeline to prevent double-booking.
              </span>
            </label>
          </div>
        </div>

        {/* Additional Workshop Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Workshop Instructions & Parts Requisition Notes
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Parts to replace (OEM oil filter, 5W-30 synthetic, front ceramic pads), special diagnostic notes..."
            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-medium text-slate-800 focus:outline-none"
          />
        </div>

        <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
          <Link
            to="/admin/maintenance"
            className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Schedule Work Order</span>
          </button>
        </div>
      </form>
    </div>
  );
}
