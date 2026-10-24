import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useOperations } from '@/contexts/OperationsContext';
import { formatCurrency, formatKilometers } from '@/lib/formatters';
import {
  Wrench, ArrowLeft, CheckCircle2, ShieldAlert,
  Calendar, Car, DollarSign, User, Edit, Clock,
  Printer, AlertCircle
} from 'lucide-react';

export function MaintenanceDetailPage() {
  const { maintenanceId } = useParams<{ maintenanceId: string }>();
  const { maintenanceTasks, vehicles, completeMaintenanceTask } = useOperations();
  const navigate = useNavigate();

  const task = maintenanceTasks.find((t) => t.id === maintenanceId);

  if (!task) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <Wrench className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h2 className="text-base font-bold text-slate-900">Work Order Not Found</h2>
        <p className="text-xs text-slate-500 mt-1">The requested maintenance record does not exist or has been removed.</p>
        <Link
          to="/admin/maintenance"
          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Maintenance Registry
        </Link>
      </div>
    );
  }

  const vehicle = vehicles.find((v) => v.id === task.vehicleId);

  const handleComplete = () => {
    completeMaintenanceTask(task.id);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 print:hidden">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/maintenance"
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                {task.taskType}
              </h1>
              <span
                className={`text-xs font-bold uppercase px-3 py-1 rounded-full ${
                  task.status === 'completed'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}
              >
                {task.status}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-mono">Work Order: {task.id}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print Work Order</span>
          </button>

          <Link
            to={`/admin/maintenance/${task.id}/edit`}
            className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Edit className="w-3.5 h-3.5 text-slate-500" />
            <span>Edit</span>
          </Link>

          {task.status !== 'completed' && (
            <button
              onClick={handleComplete}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Mark Complete & Release Vehicle</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Left Column (2 cols): Work Order Dossier */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-amber-600" />
              <span>Service Diagnosis & Action Plan</span>
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] block uppercase font-bold">Diagnosis / Trigger Reason</span>
                <p className="text-slate-800 font-medium mt-0.5 leading-relaxed">{task.reason}</p>
              </div>

              {task.notes && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                  <span className="font-bold text-slate-900 block">Workshop Instructions & Requisition Notes:</span>
                  <p className="text-slate-600 leading-relaxed">{task.notes}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                <div>
                  <span className="text-slate-400 text-[10px] block uppercase font-bold">Assigned Technician</span>
                  <span className="font-bold text-slate-900 mt-0.5 block">{task.assigneeName}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block uppercase font-bold">Priority Classification</span>
                  <span className="font-bold uppercase text-amber-700 mt-0.5 block">{task.priority} Priority</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                <div>
                  <span className="text-slate-400 text-[10px] block uppercase font-bold">Scheduled Timeline</span>
                  <span className="font-medium text-slate-800 mt-0.5 block">
                    {task.scheduledStart ? new Date(task.scheduledStart).toLocaleDateString() : 'Immediate'} –{' '}
                    {task.scheduledEnd ? new Date(task.scheduledEnd).toLocaleDateString() : 'TBD'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block uppercase font-bold">Estimated Cost</span>
                  <span className="font-bold text-slate-900 mt-0.5 block">
                    {formatCurrency(task.estimatedCostMinor || 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Status Release Banner */}
          {task.status === 'completed' ? (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold block">Service Work Order Completed</span>
                <span className="text-[11px] text-emerald-700">
                  Vehicle has been cleared by technician inspection and released to <strong>Ready for Dispatch</strong>.
                </span>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <span className="font-bold block">Active Availability Downtime Block</span>
                  <span className="text-[11px] text-amber-700">
                    Vehicle is currently locked out of consumer storefront search until work order completion.
                  </span>
                </div>
              </div>
              <button
                onClick={handleComplete}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs shrink-0 shadow-xs"
              >
                Complete & Release
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Vehicle Information */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Car className="w-4 h-4 text-blue-600" />
              <span>Target Asset</span>
            </h2>

            {vehicle ? (
              <div className="space-y-3 text-xs">
                <img
                  src={vehicle.images?.[0] || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=300'}
                  alt={vehicle.model}
                  className="w-full h-32 object-cover rounded-xl border border-slate-200"
                />
                <div>
                  <div className="font-bold text-slate-900 text-sm">
                    {vehicle.make} {vehicle.model} ({vehicle.year})
                  </div>
                  <div className="font-mono text-xs font-bold text-blue-600 mt-0.5">
                    Plate: {vehicle.plate} • {vehicle.category.toUpperCase()}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-1 text-slate-600">
                  <div>
                    Telemetry: <span className="font-mono font-bold text-slate-800">{formatKilometers(vehicle.currentOdometerKm)}</span>
                  </div>
                  <div>
                    Duty Station: <span className="font-bold text-slate-800">{vehicle.branch?.name}</span>
                  </div>
                </div>

                <Link
                  to={`/admin/vehicles/${vehicle.id}`}
                  className="block text-center text-xs font-bold text-blue-600 hover:underline pt-2"
                >
                  View Vehicle Operational Dossier →
                </Link>
              </div>
            ) : (
              <p className="text-xs text-slate-400">Target vehicle information not available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
