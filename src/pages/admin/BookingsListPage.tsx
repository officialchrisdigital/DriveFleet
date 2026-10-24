import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useOperations } from '@/contexts/OperationsContext';
import { formatCurrency } from '@/lib/formatters';
import { downloadCsv } from '@/lib/csvExport';
import {
  Bookmark, Plus, Search, Filter, Download,
  Car, User, Calendar, CheckCircle2, AlertTriangle,
  ChevronRight, KeyRound, Clock, ShieldCheck
} from 'lucide-react';

export function BookingsListPage() {
  const { bookings, vehicles, customers, cancelBooking } = useOperations();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = bookings.filter((b) => {
    if (statusFilter !== 'all' && b.status !== statusFilter) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const cust = customers.find((c) => c.id === b.customerId);
    const veh = vehicles.find((v) => v.id === b.vehicleId);
    const custName = cust ? `${cust.firstName} ${cust.lastName}`.toLowerCase() : '';
    const vehName = veh ? `${veh.make} ${veh.model} ${veh.plate}`.toLowerCase() : '';

    return (
      b.reference.toLowerCase().includes(q) ||
      custName.includes(q) ||
      vehName.includes(q)
    );
  });

  const handleExportCsv = () => {
    const headers = [
      'Booking Reference',
      'Customer Name',
      'Customer Email',
      'Customer Phone',
      'Vehicle Make & Model',
      'Vehicle Plate',
      'Pickup Date',
      'Return Date',
      'Status',
      'Source Channel',
      'Total Amount (NGN)',
    ];

    const rows = filtered.map((b) => {
      const cust = customers.find((c) => c.id === b.customerId);
      const veh = vehicles.find((v) => v.id === b.vehicleId);
      return [
        b.reference,
        cust ? `${cust.firstName} ${cust.lastName}` : 'Walk-in Client',
        cust?.email || 'N/A',
        cust?.phone || 'N/A',
        veh ? `${veh.make} ${veh.model}` : 'Assigned Fleet Unit',
        veh?.plate || 'N/A',
        new Date(b.pickupAt).toLocaleString(),
        new Date(b.returnAt).toLocaleString(),
        b.status.toUpperCase(),
        b.sourceChannel.toUpperCase(),
        (b.quote?.totalMinor || 0) / 100,
      ];
    });

    downloadCsv('drivefleet-bookings-ledger.csv', headers, rows);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Active on Road
          </span>
        );
      case 'confirmed':
        return (
          <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full uppercase">
            Confirmed Upcoming
          </span>
        );
      case 'completed':
        return (
          <span className="text-[10px] font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full uppercase">
            Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="text-[10px] font-bold text-red-700 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full uppercase">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded uppercase">
            {status}
          </span>
        );
    }
  };

  const activeCount = bookings.filter((b) => b.status === 'active').length;
  const confirmedCount = bookings.filter((b) => b.status === 'confirmed').length;
  const completedCount = bookings.filter((b) => b.status === 'completed').length;

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Fleet Reservations & Booking Ledger
            </h1>
            <span className="text-[10px] font-bold text-slate-500 uppercase px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
              Live Ledger ({bookings.length})
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Active and upcoming customer reservations across Lagos and Abuja dispatch nodes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
            title="Download Bookings CSV"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Bookings CSV</span>
          </button>

          <Link
            to="/admin/bookings/new"
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>+ Staff-Assisted Booking</span>
          </Link>
        </div>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-[10px] uppercase font-bold text-slate-400">Total Bookings</div>
          <div className="text-xl font-black text-slate-900 mt-0.5">{bookings.length} Bookings</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-[10px] uppercase font-bold text-emerald-600">Active (On Road)</div>
          <div className="text-xl font-black text-emerald-600 mt-0.5">{activeCount} Vehicles</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-[10px] uppercase font-bold text-blue-600">Confirmed (Upcoming)</div>
          <div className="text-xl font-black text-blue-600 mt-0.5">{confirmedCount} Pending</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-[10px] uppercase font-bold text-slate-500">Completed Rentals</div>
          <div className="text-xl font-black text-slate-700 mt-0.5">{completedCount} Released</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reference, customer, or plate..."
            className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="all">All Reservation States</option>
            <option value="active">Active On Road Only</option>
            <option value="confirmed">Confirmed Upcoming Only</option>
            <option value="completed">Completed Only</option>
            <option value="cancelled">Cancelled Only</option>
          </select>
        </div>
      </div>

      {/* Bookings Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Bookmark className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <div className="font-bold text-slate-700 text-sm">No reservations found</div>
            <p className="text-xs text-slate-400 mt-1">Try resetting your search query or filter selection.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 text-xs">
            {filtered.map((b) => {
              const cust = customers.find((c) => c.id === b.customerId);
              const veh = vehicles.find((v) => v.id === b.vehicleId);

              return (
                <div
                  key={b.id}
                  className="p-4 hover:bg-slate-50 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  {/* Left: Reference, Customer, Vehicle */}
                  <div className="flex items-start gap-3.5 min-w-[280px]">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0 text-blue-600 font-bold">
                      <Bookmark className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/admin/bookings/${b.id}`}
                          className="font-mono font-bold text-slate-900 text-sm hover:text-blue-600 transition-colors"
                        >
                          {b.reference}
                        </Link>
                        {getStatusBadge(b.status)}
                      </div>

                      <div className="font-bold text-slate-800 text-xs mt-0.5">
                        {cust ? `${cust.firstName} ${cust.lastName}` : 'Walk-in Customer'}
                        <span className="text-slate-400 font-normal ml-1">
                          ({cust?.company || 'Private'})
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <Car className="w-3.5 h-3.5 text-slate-400" />
                        <span>{veh ? `${veh.make} ${veh.model}` : 'Fleet Asset'}</span>
                        <span className="font-mono font-bold text-slate-700">({veh?.plate})</span>
                      </div>
                    </div>
                  </div>

                  {/* Middle: Dates & Location */}
                  <div className="text-xs space-y-1 min-w-[220px]">
                    <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        {new Date(b.pickupAt).toLocaleDateString()} – {new Date(b.returnAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono flex items-center gap-2">
                      <span className="capitalize">{b.sourceChannel} Channel</span>
                      <span>•</span>
                      <span>{b.quote?.billedPeriods || 1} Days</span>
                    </div>
                  </div>

                  {/* Right: Total Amount & Actions */}
                  <div className="flex items-center justify-between lg:justify-end gap-3 shrink-0">
                    <div className="text-right">
                      <div className="font-black text-slate-900 text-sm">
                        {formatCurrency(b.quote?.totalMinor || 0)}
                      </div>
                      <div className="text-[10px] text-emerald-600 font-bold">Deposit Secured</div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {b.status === 'confirmed' && (
                        <Link
                          to={`/admin/bookings/${b.id}/pickup`}
                          className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] shadow-xs transition-colors flex items-center gap-1"
                          title="Launch physical vehicle handover inspection"
                        >
                          <KeyRound className="w-3 h-3" />
                          <span>Pickup SOP</span>
                        </Link>
                      )}

                      {b.status === 'active' && (
                        <Link
                          to={`/admin/bookings/${b.id}/return`}
                          className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-[11px] shadow-xs transition-colors flex items-center gap-1"
                          title="Launch physical return inspection"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Return SOP</span>
                        </Link>
                      )}

                      <Link
                        to={`/admin/bookings/${b.id}`}
                        className="p-1.5 rounded-lg border border-slate-200 hover:border-blue-500 hover:text-blue-600 text-slate-600 transition-colors"
                        title="View complete operational breakdown"
                      >
                        <ChevronRight className="w-4 h-4" />
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
