import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DEMO_VEHICLES } from '@/lib/demo-data';
import { formatCurrency, formatKilometers } from '@/lib/formatters';
import {
  Car, Calendar, AlertTriangle, ShieldCheck, Clock,
  ArrowRight, CheckCircle2, AlertCircle, Wrench, ChevronRight, Download
} from 'lucide-react';

export function AdminDashboardPage() {
  const [selectedHub, setSelectedHub] = useState('ikeja');

  return (
    <div className="space-y-6">
      {/* Top Banner / Sentinel Notice (From Mockup) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm shrink-0">
            DF
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-slate-900 tracking-tight">Operations Command Center</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Lagos Ikeja Active Node
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
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-[11px] font-bold uppercase text-slate-400">Total Fleet</div>
          <div className="text-2xl font-black text-slate-900 mt-1">32</div>
          <span className="text-[10px] text-slate-500 mt-1 block">Lagos & Abuja units</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-[11px] font-bold uppercase text-emerald-600">Ready for Pickup</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">24</div>
          <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">100% Inspected</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-[11px] font-bold uppercase text-blue-600">Active Rentals</div>
          <div className="text-2xl font-black text-blue-600 mt-1">5</div>
          <span className="text-[10px] text-blue-600 font-semibold mt-1 block">On road dispatch</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-[11px] font-bold uppercase text-amber-600">In Maintenance</div>
          <div className="text-2xl font-black text-amber-600 mt-1">3</div>
          <span className="text-[10px] text-amber-700 font-semibold mt-1 block">Quarantine active</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-[11px] font-bold uppercase text-red-600">Overdue Returns</div>
          <div className="text-2xl font-black text-red-600 mt-1">1</div>
          <span className="text-[10px] text-red-600 font-semibold mt-1 block">3h 45m past window</span>
        </div>
      </div>

      {/* Critical Overdue Alert Banner */}
      <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-red-900">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
          <div>
            <span className="font-bold">Overdue Return Alert: </span>
            <span>
              Booking <strong>#DF-2026-3829</strong> (Toyota Camry 2024, LAG-482-XY) was due at 08:00 AM at Lagos Ikeja Hub. Overdue Active state retains vehicle availability lock.
            </span>
          </div>
        </div>
        <Link
          to="/admin/bookings/DF-2026-3829/return"
          className="bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1.5 rounded-lg shrink-0 text-center transition-colors shadow-sm"
        >
          Process Immediate Return SOP
        </Link>
      </div>

      {/* Two Column Layout: Today's Dispatch Handovers & Service Milestones */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left (7 cols): Today's Handovers & Returns */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Today's Station Dispatch & Returns</h3>
                <p className="text-xs text-slate-500">Scheduled vehicle handover inspections</p>
              </div>
              <Link to="/admin/bookings" className="text-xs font-bold text-blue-600 hover:underline">
                View All Reservations
              </Link>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              <div className="py-3 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-blue-600">#DF-2026-9812</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700">
                      Confirmed Pickup
                    </span>
                  </div>
                  <div className="font-bold text-slate-900">Toyota RAV4 XLE AWD (LAG-802-AB)</div>
                  <div className="text-slate-500 text-[11px]">Renter: Chukwudi Adeyemi • Oct 23 @ 10:00 AM</div>
                </div>

                <Link
                  to="/admin/bookings/DF-2026-9812/pickup"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-lg shrink-0 transition-colors shadow-sm"
                >
                  Start Pickup Handover
                </Link>
              </div>

              <div className="py-3 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-red-600">#DF-2026-3829</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700">
                      Overdue Return
                    </span>
                  </div>
                  <div className="font-bold text-slate-900">Toyota Camry 2024 (LAG-482-XY)</div>
                  <div className="text-slate-500 text-[11px]">Renter: Chidi Okonkwo • +3h 45m past window</div>
                </div>

                <Link
                  to="/admin/bookings/DF-2026-3829/return"
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-3 py-1.5 rounded-lg shrink-0 transition-colors shadow-sm"
                >
                  Return Inspection
                </Link>
              </div>

              <div className="py-3 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-600">#DF-2026-9044</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700">
                      VIP Confirmed
                    </span>
                  </div>
                  <div className="font-bold text-slate-900">Mercedes-Benz C300 (LAG-992-ZZ)</div>
                  <div className="text-slate-500 text-[11px]">Renter: Tariq Al-Mansoor • Airport Escort</div>
                </div>

                <Link
                  to="/admin/bookings/DF-2026-9044"
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-3 py-1.5 rounded-lg shrink-0 transition-colors"
                >
                  Dossier
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right (5 cols): Scheduled Service Milestones & Utilization */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Wrench className="w-4 h-4 text-amber-600" />
                <span>Service Milestones Approaching</span>
              </h3>
              <Link to="/admin/maintenance" className="text-xs font-bold text-blue-600 hover:underline">
                Registry
              </Link>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-1">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>Toyota Camry 2024 (LAG-104-AB)</span>
                  <span className="text-amber-700">150 km left</span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  Current: 39,850 km • 40,000 km mandatory scheduled service threshold.
                </p>
                <div className="pt-1 flex justify-between text-[10px]">
                  <span className="text-amber-800 font-semibold">Automatic alert active</span>
                  <Link to="/admin/maintenance/new" className="text-blue-600 font-bold hover:underline">
                    Schedule Quarantine Block →
                  </Link>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>Kia Rio EX (LAG-330-MT)</span>
                  <span className="text-red-600 font-bold">In Maintenance</span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  Task: Brake pads & rotor overhaul • Availability block active.
                </p>
              </div>
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
                Fleet Register (32)
              </Link>
              <Link to="/admin/customers" className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200">
                Customer CRM
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
