import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useOperations } from '@/contexts/OperationsContext';
import { Priority } from '@/lib/types';
import {
  Wrench, ArrowLeft, CheckCircle2, ShieldAlert,
  Calendar, DollarSign, Car, User
} from 'lucide-react';

export function EditMaintenancePage() {
  const { maintenanceId } = useParams<{ maintenanceId: string }>();
  const { maintenanceTasks, vehicles, updateMaintenanceTask } = useOperations();
  const navigate = useNavigate();

  const task = maintenanceTasks.find((t) => t.id === maintenanceId);

  const [vehicleId, setVehicleId] = useState('');
  const [taskType, setTaskType] = useState('');
  const [reason, setReason] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [status, setStatus] = useState<'scheduled' | 'in_progress' | 'completed' | 'cancelled'>('scheduled');
  const [assigneeName, setAssigneeName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [estimatedCostNaira, setEstimatedCostNaira] = useState(0);
  const [actualCostNaira, setActualCostNaira] = useState<number | ''>('');
  const [blocksAvailability, setBlocksAvailability] = useState(true);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (task) {
      setVehicleId(task.vehicleId);
      setTaskType(task.taskType);
      setReason(task.reason || '');
      setPriority(task.priority);
      setStatus(task.status);
      setAssigneeName(task.assigneeName || '');
      setStartDate(task.scheduledStart ? task.scheduledStart.split('T')[0] : '');
      setEndDate(task.scheduledEnd ? task.scheduledEnd.split('T')[0] : '');
      setEstimatedCostNaira(Math.round(task.estimatedCostMinor / 100));
      setActualCostNaira(task.actualCostMinor ? Math.round(task.actualCostMinor / 100) : '');
      setBlocksAvailability(task.blocksAvailability);
      setNotes(task.notes || '');
    }
  }, [task]);

  if (!task) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 max-w-xl mx-auto">
        <Wrench className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h2 className="text-base font-bold text-slate-900">Work Order Not Found</h2>
        <p className="text-xs text-slate-500 mt-1">The maintenance order #{maintenanceId} was not found.</p>
        <Link
          to="/admin/maintenance"
          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Maintenance Registry
        </Link>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskType.trim()) {
      setError('Service / Task title is required.');
      return;
    }

    updateMaintenanceTask(task.id, {
      vehicleId,
      taskType: taskType.trim(),
      reason: reason.trim() || 'Routine preventative fleet inspection',
      priority,
      status,
      assigneeName: assigneeName.trim() || 'Duty Technician',
      scheduledStart: startDate ? `${startDate}T08:00:00Z` : task.scheduledStart,
      scheduledEnd: endDate ? `${endDate}T18:00:00Z` : task.scheduledEnd,
      estimatedCostMinor: Number(estimatedCostNaira) * 100,
      actualCostMinor: actualCostNaira !== '' ? Number(actualCostNaira) * 100 : undefined,
      blocksAvailability,
      notes: notes.trim(),
    });

    navigate(`/admin/maintenance/${task.id}`);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
        <Link
          to={`/admin/maintenance/${task.id}`}
          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Edit Work Order</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Update maintenance order details, costs, and downtime flags for {task.id}
          </p>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-red-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
        {/* Vehicle & Status Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Car className="w-3.5 h-3.5 text-blue-600" />
              Target Vehicle
            </label>
            <select
              value={vehicleId}
              onChange={(e) => setVehicleId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.year} {v.make} {v.model} ({v.plate}) - {v.branch?.name || v.branchId}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Work Order Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="scheduled">Scheduled</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Task Title & Priority */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-blue-600" />
              Service / Task Title *
            </label>
            <input
              type="text"
              value={taskType}
              onChange={(e) => setTaskType(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Priority Level
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
              <option value="urgent">Urgent (Safety Critical)</option>
            </select>
          </div>
        </div>

        {/* Reason / Diagnostic Scope */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Diagnostic Scope & Issues Noted
          </label>
          <textarea
            rows={2}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Assignee & Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-blue-600" />
              Technician / Workshop
            </label>
            <input
              type="text"
              value={assigneeName}
              onChange={(e) => setAssigneeName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              Scheduled Start
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              Est. Completion
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Costing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-blue-600" />
              Estimated Cost (₦)
            </label>
            <input
              type="number"
              min={0}
              step={1000}
              value={estimatedCostNaira}
              onChange={(e) => setEstimatedCostNaira(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
              Actual Final Cost (₦)
            </label>
            <input
              type="number"
              min={0}
              step={1000}
              placeholder="Leave empty if not invoiced yet"
              value={actualCostNaira}
              onChange={(e) => setActualCostNaira(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Availability Lock Box */}
        <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/60 flex items-start gap-3">
          <input
            id="blocksAvailability"
            type="checkbox"
            checked={blocksAvailability}
            onChange={(e) => setBlocksAvailability(e.target.checked)}
            className="w-4 h-4 mt-0.5 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
          />
          <label htmlFor="blocksAvailability" className="text-xs cursor-pointer select-none">
            <span className="font-bold text-slate-900 block">
              Block Vehicle Dispatch Availability
            </span>
            <span className="text-slate-600 block mt-0.5">
              When checked, this vehicle is marked in 'maintenance' state and cannot be reserved for rental trips that overlap these service dates.
            </span>
          </label>
        </div>

        {/* Additional Notes */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Technician Notes & Part Numbers
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Replaced front brake pads with OEM Toyota parts; oil filter changed."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          <Link
            to={`/admin/maintenance/${task.id}`}
            className="px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Save Work Order Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
}
