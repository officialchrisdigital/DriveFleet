import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar as CalendarIcon, ChevronLeft, ChevronRight,
  Filter, Plus, Lock, AlertTriangle, Clock, Wrench
} from 'lucide-react';

export function DispatchCalendarPage() {
  const [selectedHub, setSelectedHub] = useState('ikeja');
  const [viewMode, setViewMode] = useState<'2week' | 'month'>('2week');

  const days = [
    { date: '18', day: 'Sun', isToday: false },
    { date: '19', day: 'Mon', isToday: false },
    { date: '20', day: 'Tue', isToday: false },
    { date: '21', day: 'Wed', isToday: false },
    { date: '22', day: 'Thu', isToday: false },
    { date: '23', day: 'Fri', isToday: false },
    { date: '24', day: 'Sat', isToday: false },
    { date: '25', day: 'Sun', isToday: false },
    { date: '26', day: 'Mon', isToday: false },
    { date: '27', day: 'Tue', isToday: false },
  ];

  const vehicles = [
    {
      id: 'rav4-802',
      name: 'Toyota RAV4 AWD',
      plate: 'LAG-802-AB',
      hub: 'Ikeja Hub',
      category: 'suv',
      status: 'ready',
      events: [
        {
          id: 'DF-2026-9812',
          type: 'booking',
          title: '#DF-2026-9812: Chukwudi Adeyemi',
          startCol: 6, // Oct 23
          span: 4, // Oct 23-26
          color: 'bg-blue-600 text-white',
          status: 'Confirmed',
        },
      ],
    },
    {
      id: 'camry-482',
      name: 'Toyota Camry 2024',
      plate: 'LAG-482-XY',
      hub: 'Ikeja Hub',
      category: 'sedan',
      status: 'overdue',
      events: [
        {
          id: 'DF-2026-3829',
          type: 'overdue',
          title: '⚠ #DF-2026-3829 LATE RETURN: Chidi Okonkwo (+3h 45m)',
          startCol: 1, // Oct 18
          span: 2,
          color: 'bg-red-600 text-white animate-pulse',
          status: 'Overdue Active',
        },
      ],
    },
    {
      id: 'c200-303',
      name: 'Mercedes-Benz C200',
      plate: 'LAG-303-MB',
      hub: 'VI Station',
      category: 'luxury',
      status: 'maintenance',
      events: [
        {
          id: 'MAINT-35k',
          type: 'maintenance',
          title: '🔧 Maint: 35k Brake & Pad Locked',
          startCol: 1,
          span: 3,
          color: 'bg-amber-600 text-white',
          status: 'In Maintenance',
        },
        {
          id: 'DF-2026-9044',
          type: 'booking',
          title: '#DF-2026-9044: Tariq Al-Mansoor (VIP Airport)',
          startCol: 5,
          span: 4,
          color: 'bg-purple-600 text-white',
          status: 'Confirmed',
        },
      ],
    },
    {
      id: 'tucson-119',
      name: 'Hyundai Tucson AWD',
      plate: 'ABJ-119-KL',
      hub: 'Abuja Hub',
      category: 'suv',
      status: 'ready',
      events: [
        {
          id: 'DF-2026-9921',
          type: 'booking',
          title: '#DF-2026-9921: Dr. Ngozi Eze (Abuja Conference)',
          startCol: 7,
          span: 4,
          color: 'bg-blue-600 text-white',
          status: 'Confirmed',
        },
      ],
    },
    {
      id: 'prado-443',
      name: 'Land Cruiser Prado',
      plate: 'ABJ-443-PR',
      hub: 'Abuja Hub',
      category: 'luxury',
      status: 'active',
      events: [
        {
          id: 'DF-2026-7840',
          type: 'active',
          title: '● #DF-2026-7840: In-Use Active (Delegation Mission)',
          startCol: 1,
          span: 5,
          color: 'bg-slate-900 text-white',
          status: 'Active On-Road',
        },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Calendar Sentinel Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              Dispatch & Fleet Availability Calendar
            </h1>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
              <Lock className="w-3 h-3 text-emerald-600" />
              <span>PRD 9.2 Half-Open Guard Enforced</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time interval timeline across Lagos and Abuja dispatch nodes. Zero overlapping booking guarantee.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/maintenance/new"
            className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold px-3 py-2 rounded-xl transition-colors"
          >
            + Maintenance Block
          </Link>
          <Link
            to="/admin/bookings/new"
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors shadow-sm"
          >
            + Schedule Reservation
          </Link>
        </div>
      </div>

      {/* View & Hub Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('2week')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
              viewMode === '2week' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            2-Week Timeline
          </button>
          <button
            onClick={() => setViewMode('month')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
              viewMode === 'month' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Month View
          </button>
          <div className="h-4 w-px bg-slate-200 mx-1" />
          <span className="font-bold text-slate-800">Oct 18 – Oct 31, 2026</span>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedHub}
            onChange={(e) => setSelectedHub(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-800"
          >
            <option value="all">All Dispatch Hubs</option>
            <option value="ikeja">Lagos Ikeja Main Hub</option>
            <option value="abuja">Abuja Central Terminal</option>
          </select>
        </div>
      </div>

      {/* Grid Timeline (Exact Mockup Match) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
        <div className="min-w-[900px]">
          {/* Header Row: Days */}
          <div className="grid grid-cols-12 border-b border-slate-200 bg-slate-50 text-center text-xs font-bold text-slate-600">
            <div className="col-span-2 p-3 text-left border-r border-slate-200 uppercase text-[10px] text-slate-400">
              Fleet Asset Roster
            </div>
            {days.map((d, i) => (
              <div key={i} className="col-span-1 p-3 border-r border-slate-200 last:border-r-0">
                <div className="text-[10px] uppercase text-slate-400">{d.day}</div>
                <div className="text-sm font-black text-slate-900 mt-0.5">{d.date}</div>
              </div>
            ))}
          </div>

          {/* Vehicle Rows */}
          <div className="divide-y divide-slate-100 text-xs">
            {vehicles.map((v) => (
              <div key={v.id} className="grid grid-cols-12 items-center min-h-[72px]">
                {/* Vehicle Column */}
                <div className="col-span-2 p-3 border-r border-slate-200">
                  <div className="font-bold text-slate-900">{v.name}</div>
                  <div className="text-[10px] font-mono text-slate-400">{v.plate}</div>
                  <div className="text-[10px] text-slate-500">{v.hub}</div>
                </div>

                {/* Timeline Grid (10 Days) */}
                <div className="col-span-10 grid grid-cols-10 h-full relative items-center px-1">
                  {/* Grid Lines */}
                  {Array.from({ length: 10 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="absolute top-0 bottom-0 border-r border-slate-100 pointer-events-none"
                      style={{ left: `${(idx + 1) * 10}%` }}
                    />
                  ))}

                  {/* Render Events */}
                  {v.events.map((ev, evIdx) => {
                    const leftPercent = (ev.startCol - 1) * 10;
                    const widthPercent = ev.span * 10;
                    return (
                      <div
                        key={evIdx}
                        className={`absolute rounded-xl px-2.5 py-1.5 shadow-sm text-[11px] font-semibold truncate cursor-pointer hover:opacity-90 transition-opacity z-10 ${ev.color}`}
                        style={{
                          left: `${leftPercent}%`,
                          width: `calc(${widthPercent}% - 8px)`,
                          marginLeft: '4px',
                        }}
                        title={`${ev.title} (${ev.status})`}
                      >
                        {ev.title}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend Bar (From Mockup) */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="font-bold text-slate-800">Timeline Dispatch States:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-slate-900" />
            <span>Active On Road</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-blue-600" />
            <span>Confirmed Reservation</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-amber-600" />
            <span>Maintenance Downtime</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-red-600" />
            <span>Overdue / Late Alert</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 flex items-center gap-1">
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
          <span>Atomic advisory lock prevents overlapping bookings in real time.</span>
        </div>
      </div>
    </div>
  );
}
