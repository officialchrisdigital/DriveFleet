import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useOperations } from '@/contexts/OperationsContext';
import { formatCurrency, formatKilometers } from '@/lib/formatters';
import {
  Car, Calendar, AlertTriangle, ShieldCheck, Clock,
  ArrowRight, CheckCircle2, AlertCircle, Wrench, ChevronRight, Download
} from 'lucide-react';

export function AdminDashboardPage() {
  const { vehicles, bookings, maintenanceTasks, customers } = useOperations();
  const [selectedHub, setSelectedHub] = useState('ikeja');

  const totalFleet = vehicles.length;
  const readyForPickup = vehicles.filter((v) => v.operationalState === 'ready').length;
  const activeRentals = bookings.filter((b) => b.status === 'active').length;
  const inMaintenance = vehicles.filter((v) => v.operationalState === 'in_maintenance').length;
  const overdueCount = bookings.filter(
    (b) => b.status === 'active' && new Date(b.returnAt).getTime() < Date.now()
  ).length;

  // Active or upcoming handovers (recent bookings)
  const recentBookings = bookings.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Top Banner / Sentinel Notice */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm shrink-0">
            DF
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-slate-900 tracking-tight">Operations Command Center</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Live Operations Active
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Live handover dispatch, availability quarantine sentinel, and vehicle health milestones.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/calendar"
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors shadow-sm flex items-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Open Fleet Calendar</span>
          </Link>
          <Link
            to="/admin/bookings/new"
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors shadow-sm"
          >
            + New Reservation
          </Link>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <Link to="/admin/vehicles" className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-400 transition-colors">
          <div className="text-[11px] font-bold uppercase text-slate-400">Total Fleet</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{totalFleet}</div>
          <span className="text-[10px] text-slate-500 mt-1 block">Active vehicle roster</span>
        </Link>

        <Link to="/admin/vehicles?status=available" className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-400 transition-colors">
          <div className="text-[11px] font-bold uppercase text-emerald-600">Ready for Pickup</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">{readyForPickup}</div>
          <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">Available for booking</span>
        </Link>

        <Link to="/admin/bookings" className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-400 transition-colors">
          <div className="text-[11px] font-bold uppercase text-blue-600">Active Rentals</div>
          <div className="text-2xl font-black text-blue-600 mt-1">{activeRentals}</div>
          <span className="text-[10px] text-blue-600 font-semibold mt-1 block">On road dispatch</span>
        </Link>

        <Link to="/admin/maintenance" className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-amber-400 transition-colors">
          <div className="text-[11px] font-bold uppercase text-amber-600">In Maintenance</div>
          <div className="text-2xl font-black text-amber-600 mt-1">{inMaintenance}</div>
          <span className="text-[10px] text-amber-700 font-semibold mt-1 block">Quarantine active</span>
        </Link>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-[11px] font-bold uppercase text-red-600">Overdue Returns</div>
          <div className="text-2xl font-black text-red-600 mt-1">{overdueCount}</div>
          <span className="text-[10px] text-red-600 font-semibold mt-1 block">Requires staff triage</span>
        </div>
      </div>

      {/* Critical Overdue Alert Banner if overdueCount > 0 */}
      {overdueCount > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-red-900">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
            <div>
              <span className="font-bold">Overdue Return Warning: </span>
              <span>
                {overdueCount} active reservation is past its scheduled return time. Overdue state retains vehicle availability lock.
              </span>
            </div>
          </div>
          <Link
            to="/admin/bookings"
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1.5 rounded-lg shrink-0 text-center transition-colors shadow-sm"
          >
            Review Active Reservations
          </Link>
        </div>
      )}

      {/* Two Column Layout: Today's Dispatch Handovers & Service Milestones */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left (7 cols): Today's Handovers & Returns */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Recent Dispatch Reservations</h3>
                <p className="text-xs text-slate-500">Live operational booking queue</p>
              </div>
              <Link to="/admin/bookings" className="text-xs font-bold text-blue-600 hover:underline">
                View All Reservations ({bookings.length})
              </Link>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {recentBookings.map((b) => {
                const vehicle = vehicles.find((v) => v.id === b.vehicleId);
                return (
                  <div key={b.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-blue-600">#{b.reference}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            b.status === 'confirmed'
                              ? 'bg-blue-50 text-blue-700'
                              : b.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {b.status}
                        </span>
                      </div>
                      <div className="font-bold text-slate-900">
                        {vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model} (${vehicle.plate})` : b.vehicleId}
                      </div>
                      <div className="text-slate-500 text-[11px]">
                        Renter: {b.customer ? `${b.customer.firstName} ${b.customer.lastName}` : 'Customer'} • Pickup: {b.pickupAt.split('T')[0]}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/admin/bookings/${b.id}`}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-3 py-1.5 rounded-lg shrink-0 transition-colors"
                      >
                        Dossier
                      </Link>
                      {b.status === 'confirmed' && (
                        <Link
                          to={`/admin/bookings/${b.id}/pickup`}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-lg shrink-0 transition-colors shadow-sm"
                        >
                          Pickup SOP
                        </Link>
                      )}
                      {b.status === 'active' && (
                        <Link
                          to={`/admin/bookings/${b.id}/return`}
                          className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-3 py-1.5 rounded-lg shrink-0 transition-colors shadow-sm"
                        >
                          Return SOP
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right (5 cols): Scheduled Service Milestones & Utilization */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Wrench className="w-4 h-4 text-amber-600" />
                <span>Service Milestones & Work Orders</span>
              </h3>
              <Link to="/admin/maintenance" className="text-xs font-bold text-blue-600 hover:underline">
                Registry ({maintenanceTasks.length})
              </Link>
            </div>

            <div className="space-y-3 text-xs">
              {maintenanceTasks.slice(0, 3).map((task) => {
                const v = vehicles.find((item) => item.id === task.vehicleId);
                return (
                  <div key={task.id} className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-1">
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>{v ? `${v.make} ${v.model} (${v.plate})` : task.vehicleId}</span>
                      <span className="text-amber-700 uppercase text-[10px]">{task.status}</span>
                    </div>
                    <p className="text-slate-600 text-[11px]">
                      Task: {task.taskType} • Priority: {task.priority}
                    </p>
                    <div className="pt-1 flex justify-between text-[10px]">
                      <span className="text-amber-800 font-semibold">{task.assigneeName || 'Technician'}</span>
                      <Link to={`/admin/maintenance/${task.id}`} className="text-blue-600 font-bold hover:underline">
                        View Work Order →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Fleet Quick Links */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-3 text-xs">
            <div className="font-bold flex items-center justify-between">
              <span>Quick Dispatch Links</span>
              <span className="text-[10px] text-slate-400 font-mono">STAFF-OPS</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Link to="/admin/vehicles" className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200">
                Fleet Register ({vehicles.length})
              </Link>
              <Link to="/admin/customers" className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200">
                Customer CRM ({customers.length})
              </Link>
              <Link to="/admin/reports" className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200">
                Reports & KPI Ledger
              </Link>
              <Link to="/admin/pricing" className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200">
                Pricing Overrides
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
