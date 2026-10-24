import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useOperations } from '@/contexts/OperationsContext';
import { formatCurrency, formatKilometers } from '@/lib/formatters';
import {
  Car, ArrowLeft, Edit, Wrench, Calendar, Gauge,
  Fuel, Settings, MapPin, Users, CheckCircle2,
  AlertTriangle, ShieldAlert, Plus, Bookmark
} from 'lucide-react';

export function VehicleDossierPage() {
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const { vehicles, bookings, maintenanceTasks, updateVehicle } = useOperations();
  const navigate = useNavigate();

  const vehicle = vehicles.find((v) => v.id === vehicleId);

  if (!vehicle) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <Car className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h2 className="text-base font-bold text-slate-900">Vehicle Not Found</h2>
        <p className="text-xs text-slate-500 mt-1">The requested vehicle record does not exist or was archived.</p>
        <Link
          to="/admin/vehicles"
          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Fleet Register
        </Link>
      </div>
    );
  }

  const vehicleBookings = bookings.filter((b) => b.vehicleId === vehicle.id);
  const vehicleMaintenance = maintenanceTasks.filter((m) => m.vehicleId === vehicle.id);

  const getStatusBadge = (state: string) => {
    switch (state) {
      case 'ready':
        return (
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full uppercase flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Ready for Dispatch
          </span>
        );
      case 'in_maintenance':
        return (
          <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full uppercase flex items-center gap-1.5">
            <Wrench className="w-3.5 h-3.5 text-amber-600" />
            In Maintenance
          </span>
        );
      default:
        return (
          <span className="text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-3 py-1 rounded-full uppercase flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
            Out of Service
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/vehicles"
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                {vehicle.make} {vehicle.model} ({vehicle.year})
              </h1>
              {getStatusBadge(vehicle.operationalState)}
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-mono">
              Plate: <span className="font-bold text-slate-800">{vehicle.plate}</span> • Node: {vehicle.branch?.city} Hub
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/admin/vehicles/${vehicle.id}/edit`}
            className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Edit Vehicle</span>
          </Link>

          <Link
            to={`/admin/bookings/new?vehicleId=${vehicle.id}`}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Reserve Vehicle</span>
          </Link>
        </div>
      </div>

      {/* Main Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Image & Quick Specs */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <img
              src={vehicle.images?.[0] || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800'}
              alt={`${vehicle.make} ${vehicle.model}`}
              className="w-full h-48 object-cover bg-slate-100"
            />
            <div className="p-4 space-y-3 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Daily Tariff</span>
                <span className="font-black text-slate-900 text-sm">
                  {formatCurrency(vehicle.baseRateMinor)}/day
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Telemetry Odometer</span>
                <span className="font-mono font-bold text-slate-900">
                  {formatKilometers(vehicle.currentOdometerKm)}
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Mileage Allowance</span>
                <span className="font-bold text-slate-900">{vehicle.mileageAllowanceKm} km/day</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Assigned Hub</span>
                <span className="font-bold text-blue-600">{vehicle.branch?.name}</span>
              </div>
            </div>
          </div>

          {/* Quick Operational State Switch */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3 text-xs">
            <span className="font-bold text-slate-900 block">Manage Operational State</span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => updateVehicle(vehicle.id, { operationalState: 'ready' })}
                className={`py-2 px-1 text-center font-bold text-[11px] rounded-xl border transition-colors ${
                  vehicle.operationalState === 'ready'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200'
                }`}
              >
                Ready
              </button>
              <button
                onClick={() => updateVehicle(vehicle.id, { operationalState: 'in_maintenance' })}
                className={`py-2 px-1 text-center font-bold text-[11px] rounded-xl border transition-colors ${
                  vehicle.operationalState === 'in_maintenance'
                    ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200'
                }`}
              >
                Maintenance
              </button>
              <button
                onClick={() => updateVehicle(vehicle.id, { operationalState: 'out_of_service' })}
                className={`py-2 px-1 text-center font-bold text-[11px] rounded-xl border transition-colors ${
                  vehicle.operationalState === 'out_of_service'
                    ? 'bg-red-600 text-white border-red-600 shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200'
                }`}
              >
                Out of Service
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (2 cols): Specifications, Maintenance, & Linked Bookings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Detailed Specs Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Settings className="w-4 h-4 text-blue-600" />
              <span>Technical & Fleet Specifications</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Transmission</span>
                <span className="font-bold text-slate-900 capitalize mt-0.5 block">{vehicle.transmission}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Fuel Propulsion</span>
                <span className="font-bold text-slate-900 capitalize mt-0.5 block">{vehicle.fuelType}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Capacity</span>
                <span className="font-bold text-slate-900 mt-0.5 block">{vehicle.seats} Passengers</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Class Category</span>
                <span className="font-bold text-blue-600 uppercase mt-0.5 block">{vehicle.category}</span>
              </div>
            </div>
          </div>

          {/* Linked Reservations */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <Bookmark className="w-4 h-4 text-blue-600" />
                <span>Linked Fleet Reservations ({vehicleBookings.length})</span>
              </div>
              <Link
                to={`/admin/bookings/new?vehicleId=${vehicle.id}`}
                className="text-xs font-bold text-blue-600 hover:text-blue-700"
              >
                + New Reservation
              </Link>
            </div>

            {vehicleBookings.length === 0 ? (
              <p className="text-xs text-slate-400 py-3 italic">No active or scheduled reservations for this unit.</p>
            ) : (
              <div className="divide-y divide-slate-100 text-xs">
                {vehicleBookings.map((b) => (
                  <div
                    key={b.id}
                    onClick={() => navigate(`/admin/bookings/${b.id}`)}
                    className="py-3 flex items-center justify-between hover:bg-slate-50 px-2 rounded-lg cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="font-bold text-slate-900 font-mono text-xs flex items-center gap-2">
                        <span>{b.reference}</span>
                        <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                          {b.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {new Date(b.pickupAt).toLocaleDateString()} – {new Date(b.returnAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right font-bold text-slate-900">
                      {formatCurrency(b.quote?.totalMinor || 0)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Maintenance Logs */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <Wrench className="w-4 h-4 text-amber-600" />
                <span>Maintenance Work Orders ({vehicleMaintenance.length})</span>
              </div>
              <Link
                to={`/admin/maintenance/new?vehicleId=${vehicle.id}`}
                className="text-xs font-bold text-amber-600 hover:text-amber-700"
              >
                + Schedule Service
              </Link>
            </div>

            {vehicleMaintenance.length === 0 ? (
              <p className="text-xs text-slate-400 py-3 italic">No maintenance tasks recorded for this unit.</p>
            ) : (
              <div className="divide-y divide-slate-100 text-xs">
                {vehicleMaintenance.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => navigate(`/admin/maintenance/${m.id}`)}
                    className="py-3 flex items-center justify-between hover:bg-slate-50 px-2 rounded-lg cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="font-bold text-slate-900 text-xs">{m.taskType}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Tech: {m.assigneeName} • Priority: <span className="uppercase font-semibold">{m.priority}</span>
                      </div>
                    </div>
                    <span
                      className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        m.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {m.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
