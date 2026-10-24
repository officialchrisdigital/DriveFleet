import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useOperations } from '@/contexts/OperationsContext';
import { downloadCsv } from '@/lib/csvExport';
import {
  Calendar as CalendarIcon, ChevronLeft, ChevronRight,
  Filter, Plus, Lock, AlertTriangle, Clock, Wrench, Download, Car
} from 'lucide-react';

export function DispatchCalendarPage() {
  const { vehicles, bookings, maintenanceTasks } = useOperations();
  const navigate = useNavigate();

  const [selectedHub, setSelectedHub] = useState('all');
  const [dayOffset, setDayOffset] = useState(0);

  // 14-day schedule timeline
  const days = useMemo(() => {
    const list = [];
    const base = new Date();
    base.setHours(0, 0, 0, 0);
    base.setDate(base.getDate() + dayOffset);

    for (let i = 0; i < 14; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      const isToday = new Date().toDateString() === d.toDateString();
      list.push({
        dateObj: d,
        dateNum: d.getDate(),
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
        isoDate: d.toISOString().split('T')[0],
        isToday,
      });
    }
    return list;
  }, [dayOffset]);

  const windowStartIso = days[0].isoDate;
  const windowEndIso = days[days.length - 1].isoDate;

  // Filter vehicles by hub
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      const vBranch = (v.branch?.name || v.branchId || '').toLowerCase();
      if (selectedHub === 'all') return true;
      if (selectedHub === 'lagos') return vBranch.includes('lagos') || vBranch.includes('ikeja') || vBranch.includes('vi');
      if (selectedHub === 'abuja') return vBranch.includes('abuja') || vBranch.includes('terminal');
      return true;
    });
  }, [vehicles, selectedHub]);

  // For each vehicle, calculate events within the 14-day window
  const vehicleSchedules = useMemo(() => {
    return filteredVehicles.map((vehicle) => {
      const events: Array<{
        id: string;
        type: 'booking' | 'maintenance';
        title: string;
        status: string;
        color: string;
        startCol: number; // 1-indexed (1 to 14)
        span: number;
        url: string;
      }> = [];

      // 1. Bookings
      const vBookings = bookings.filter(
        (b) => b.vehicleId === vehicle.id && b.status !== 'cancelled'
      );

      for (const b of vBookings) {
        const bStart = b.pickupAt.split('T')[0];
        const bEnd = b.returnAt.split('T')[0];

        // Check if overlaps window
        if (bStart <= windowEndIso && bEnd >= windowStartIso) {
          // Find first overlapping day index (0 to 13)
          let startIndex = days.findIndex((d) => d.isoDate >= bStart);
          if (startIndex === -1 && bStart < windowStartIso) {
            startIndex = 0;
          }
          if (startIndex < 0) startIndex = 0;

          // Find end day index
          let endIndex = days.findIndex((d) => d.isoDate === bEnd);
          if (endIndex === -1) {
            if (bEnd > windowEndIso) {
              endIndex = 13;
            } else {
              endIndex = startIndex;
            }
          }

          const span = Math.max(1, endIndex - startIndex + 1);
          const startCol = startIndex + 1;

          let color = 'bg-blue-600 text-white';
          if (b.status === 'active') color = 'bg-slate-900 text-white';
          else if (b.status === 'completed') color = 'bg-slate-400 text-white';

          const customerDisplayName = b.customer ? `${b.customer.firstName} ${b.customer.lastName}` : 'Guest';
          events.push({
            id: b.id,
            type: 'booking',
            title: `${b.reference}: ${customerDisplayName}`,
            status: b.status,
            color,
            startCol,
            span,
            url: `/admin/bookings/${b.id}`,
          });
        }
      }

      // 2. Maintenance Tasks
      const vMaint = maintenanceTasks.filter(
        (m) => m.vehicleId === vehicle.id && m.status !== 'cancelled'
      );

      for (const m of vMaint) {
        const mStart = (m.scheduledStart || '').split('T')[0] || windowStartIso;
        const mEnd = (m.scheduledEnd || m.scheduledStart || '').split('T')[0] || windowStartIso;

        if (mStart <= windowEndIso && mEnd >= windowStartIso) {
          let startIndex = days.findIndex((d) => d.isoDate >= mStart);
          if (startIndex === -1 && mStart < windowStartIso) {
            startIndex = 0;
          }
          if (startIndex < 0) startIndex = 0;

          let endIndex = days.findIndex((d) => d.isoDate === mEnd);
          if (endIndex === -1) {
            if (mEnd > windowEndIso) {
              endIndex = 13;
            } else {
              endIndex = startIndex;
            }
          }

          const span = Math.max(1, endIndex - startIndex + 1);
          const startCol = startIndex + 1;

          events.push({
            id: m.id,
            type: 'maintenance',
            title: `🔧 Maint: ${m.taskType}`,
            status: m.status,
            color: 'bg-amber-600 text-white',
            startCol,
            span,
            url: `/admin/maintenance/${m.id}`,
          });
        }
      }

      return {
        vehicle,
        events,
      };
    });
  }, [filteredVehicles, bookings, maintenanceTasks, days, windowStartIso, windowEndIso]);

  // Export Dispatch Schedule CSV
  const handleExportCsv = () => {
    const rows: Record<string, any>[] = [];
    vehicleSchedules.forEach(({ vehicle, events }) => {
      const vBranch = vehicle.branch?.name || vehicle.branchId;
      if (events.length === 0) {
        rows.push({
          'Vehicle ID': vehicle.id,
          'Make & Model': `${vehicle.make} ${vehicle.model} (${vehicle.year})`,
          'Plate': vehicle.plate,
          'Branch': vBranch,
          'Status': vehicle.operationalState,
          'Schedule Item': 'No commitments in window',
          'Item Type': '-',
          'Item Status': '-',
        });
      } else {
        events.forEach((ev) => {
          rows.push({
            'Vehicle ID': vehicle.id,
            'Make & Model': `${vehicle.make} ${vehicle.model} (${vehicle.year})`,
            'Plate': vehicle.plate,
            'Branch': vBranch,
            'Status': vehicle.operationalState,
            'Schedule Item': ev.title,
            'Item Type': ev.type,
            'Item Status': ev.status,
          });
        });
      }
    });

    downloadCsv(`drivefleet-dispatch-schedule-${windowStartIso}.csv`, rows);
  };

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
              <span>Conflict Guard Engine Enforced</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time multi-asset timeline across Lagos and Abuja dispatch nodes with zero-conflict availability guarantee.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExportCsv}
            className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>
          <Link
            to="/admin/maintenance/new"
            className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Wrench className="w-3.5 h-3.5 text-amber-700" />
            <span>+ Maintenance Block</span>
          </Link>
          <Link
            to="/admin/bookings/new"
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Schedule Reservation</span>
          </Link>
        </div>
      </div>

      {/* View & Hub Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setDayOffset((prev) => prev - 7)}
              className="p-1 rounded-lg hover:bg-white text-slate-700 transition-colors"
              title="Previous 7 Days"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDayOffset(0)}
              className="px-2.5 py-1 text-xs font-bold rounded-lg hover:bg-white text-slate-700 transition-colors"
            >
              Today
            </button>
            <button
              onClick={() => setDayOffset((prev) => prev + 7)}
              className="p-1 rounded-lg hover:bg-white text-slate-700 transition-colors"
              title="Next 7 Days"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />
          <span className="font-bold text-slate-800">
            {days[0].dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            {' – '}
            {days[days.length - 1].dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedHub}
            onChange={(e) => setSelectedHub(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Dispatch Hubs ({vehicles.length} Vehicles)</option>
            <option value="lagos">Lagos Dispatch Nodes</option>
            <option value="abuja">Abuja Dispatch Nodes</option>
          </select>
        </div>
      </div>

      {/* Grid Timeline */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
        <div className="min-w-[1100px]">
          {/* Header Row: Days */}
          <div className="grid border-b border-slate-200 bg-slate-50 text-center text-xs font-bold text-slate-600" style={{ gridTemplateColumns: 'repeat(16, minmax(0, 1fr))' }}>
            <div className="col-span-2 p-3 text-left border-r border-slate-200 uppercase text-[10px] text-slate-400">
              Fleet Asset Roster
            </div>
            {days.map((d, i) => (
              <div
                key={i}
                className={`col-span-1 p-2.5 border-r border-slate-200 last:border-r-0 ${
                  d.isToday ? 'bg-blue-50/80 text-blue-900 font-black' : ''
                }`}
              >
                <div className={`text-[10px] uppercase ${d.isToday ? 'text-blue-600 font-extrabold' : 'text-slate-400'}`}>
                  {d.dayName}
                </div>
                <div className="text-xs font-black mt-0.5">
                  {d.dateNum}
                </div>
              </div>
            ))}
          </div>

          {/* Vehicle Rows */}
          <div className="divide-y divide-slate-100 text-xs">
            {vehicleSchedules.map(({ vehicle, events }) => (
              <div
                key={vehicle.id}
                className="grid items-center min-h-[72px] hover:bg-slate-50/50 transition-colors"
                style={{ gridTemplateColumns: 'repeat(16, minmax(0, 1fr))' }}
              >
                {/* Vehicle Column */}
                <div className="col-span-2 p-3 border-r border-slate-200">
                  <Link
                    to={`/admin/vehicles/${vehicle.id}`}
                    className="font-bold text-slate-900 hover:text-blue-600 transition-colors block truncate"
                  >
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </Link>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[10px] font-mono text-slate-500 font-semibold">{vehicle.plate}</span>
                    <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-bold">
                      {vehicle.category}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">{vehicle.branch?.name || vehicle.branchId}</div>
                </div>

                {/* Timeline Grid (14 Days) */}
                <div className="col-span-14 h-full relative items-center px-1 flex">
                  {/* Grid Column Separators */}
                  {Array.from({ length: 14 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="absolute top-0 bottom-0 border-r border-slate-100 pointer-events-none"
                      style={{ left: `${((idx + 1) / 14) * 100}%` }}
                    />
                  ))}

                  {/* Render Events */}
                  {events.map((ev, evIdx) => {
                    const leftPercent = ((ev.startCol - 1) / 14) * 100;
                    const widthPercent = (ev.span / 14) * 100;
                    return (
                      <div
                        key={evIdx}
                        onClick={() => navigate(ev.url)}
                        className={`absolute rounded-xl px-2.5 py-1.5 shadow-sm text-[11px] font-semibold truncate cursor-pointer hover:brightness-110 transition-all z-10 ${ev.color}`}
                        style={{
                          left: `${leftPercent}%`,
                          width: `calc(${widthPercent}% - 6px)`,
                          marginLeft: '3px',
                        }}
                        title={`${ev.title} - Click to inspect`}
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

      {/* Legend Bar */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="font-bold text-slate-800">Timeline Dispatch States:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-slate-900" />
            <span>Active On Road</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-blue-600" />
            <span>Confirmed Booking</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-amber-600" />
            <span>Maintenance Downtime</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-slate-400" />
            <span>Completed History</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 flex items-center gap-1">
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
          <span>Interactive timeline synced with live vehicle inventory & work orders.</span>
        </div>
      </div>
    </div>
  );
}
