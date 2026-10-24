import React, { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useOperations } from '@/contexts/OperationsContext';
import { Booking, Vehicle, CrmCustomer } from '@/lib/types';
import { formatCurrency } from '@/lib/formatters';
import { downloadCsv } from '@/lib/csvExport';
import {
  BarChart3, TrendingUp, Calendar, Download, PieChart,
  Car, ShieldCheck, DollarSign, Filter, AlertCircle, Users
} from 'lucide-react';

export function OperationalReportsPage() {
  const { role } = useAuth();
  const isAdmin = role === 'admin';
  const { vehicles, bookings, customers, maintenanceTasks } = useOperations();

  const [activeTab, setActiveTab] = useState<'utilization' | 'bookings' | 'revenue' | 'customers'>(
    isAdmin ? 'revenue' : 'utilization'
  );
  const [selectedHub, setSelectedHub] = useState('all');

  // Helper to get booking total
  const getBookingTotalMinor = (b: Booking) => b.quote?.totalMinor || b.latestVersion?.totalMinor || 0;

  // Filter bookings & vehicles by hub if selected
  const hubVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      const vBranch = (v.branch?.name || v.branchId || '').toLowerCase();
      if (selectedHub === 'all') return true;
      if (selectedHub === 'lagos') return vBranch.includes('lagos') || vBranch.includes('ikeja') || vBranch.includes('vi');
      if (selectedHub === 'abuja') return vBranch.includes('abuja') || vBranch.includes('terminal');
      return true;
    });
  }, [vehicles, selectedHub]);

  const hubVehicleIds = useMemo(() => new Set(hubVehicles.map((v) => v.id)), [hubVehicles]);

  const hubBookings = useMemo(() => {
    return bookings.filter((b) => hubVehicleIds.has(b.vehicleId));
  }, [bookings, hubVehicleIds]);

  // Metric Computations
  const totalBookedValueMinor = useMemo(() => {
    return hubBookings.reduce((sum, b) => (b.status !== 'cancelled' ? sum + getBookingTotalMinor(b) : sum), 0);
  }, [hubBookings]);

  const completedRevenueMinor = useMemo(() => {
    return hubBookings.reduce((sum, b) => (b.status === 'completed' ? sum + getBookingTotalMinor(b) : sum), 0);
  }, [hubBookings]);

  const avgBookingValueMinor = useMemo(() => {
    const validCount = hubBookings.filter((b) => b.status !== 'cancelled').length;
    return validCount > 0 ? Math.round(totalBookedValueMinor / validCount) : 0;
  }, [hubBookings, totalBookedValueMinor]);

  // Breakdown by Category
  const categoryStats = useMemo(() => {
    const map: Record<string, { count: number; revenueMinor: number; name: string }> = {
      luxury: { count: 0, revenueMinor: 0, name: 'Luxury Saloons & VIP 4WD' },
      suv: { count: 0, revenueMinor: 0, name: 'Compact & Midsize SUVs' },
      sedan: { count: 0, revenueMinor: 0, name: 'Executive Sedans' },
    };

    hubBookings.forEach((b) => {
      const v = vehicles.find((item) => item.id === b.vehicleId);
      const cat = v?.category || 'sedan';
      if (!map[cat]) {
        map[cat] = { count: 0, revenueMinor: 0, name: `${cat.toUpperCase()} Fleet` };
      }
      map[cat].count += 1;
      if (b.status !== 'cancelled') {
        map[cat].revenueMinor += getBookingTotalMinor(b);
      }
    });

    return Object.entries(map).map(([key, val]) => ({
      category: key,
      label: val.name,
      bookingsCount: val.count,
      revenueMinor: val.revenueMinor,
      percentage: totalBookedValueMinor > 0 ? ((val.revenueMinor / totalBookedValueMinor) * 100).toFixed(1) : '0.0',
    }));
  }, [hubBookings, vehicles, totalBookedValueMinor]);

  // Booking Status breakdown
  const bookingCounts = useMemo(() => {
    return {
      confirmed: hubBookings.filter((b) => b.status === 'confirmed').length,
      active: hubBookings.filter((b) => b.status === 'active').length,
      completed: hubBookings.filter((b) => b.status === 'completed').length,
      cancelled: hubBookings.filter((b) => b.status === 'cancelled').length,
    };
  }, [hubBookings]);

  // Utilization rates
  const fleetTotal = hubVehicles.length;
  const inUseCount = hubBookings.filter((b) => b.status === 'active').length;
  const inMaintCount = hubVehicles.filter((v) => v.operationalState === 'in_maintenance').length;
  const readyCount = hubVehicles.filter((v) => v.operationalState === 'ready').length;
  const utilizationPct = fleetTotal > 0 ? (((inUseCount + inMaintCount) / fleetTotal) * 100).toFixed(1) : '0.0';

  // Customer spend map
  const customerSpendMap = useMemo(() => {
    const map: Record<string, number> = {};
    bookings.forEach((b) => {
      if (b.status !== 'cancelled') {
        map[b.customerId] = (map[b.customerId] || 0) + getBookingTotalMinor(b);
      }
    });
    return map;
  }, [bookings]);

  const totalAllCustomerSpendMinor = useMemo(() => {
    return Object.values(customerSpendMap).reduce((sum, v) => sum + v, 0);
  }, [customerSpendMap]);

  // Real CSV Export Handler
  const handleExportCsv = () => {
    const dateStr = new Date().toISOString().split('T')[0];

    if (activeTab === 'revenue') {
      const rows = categoryStats.map((item) => ({
        'Fleet Category': item.label,
        'Total Bookings': item.bookingsCount,
        'Total Revenue (NGN)': (item.revenueMinor / 100).toFixed(2),
        'Share (%)': `${item.percentage}%`,
      }));
      downloadCsv(`drivefleet-revenue-report-${dateStr}.csv`, rows);
    } else if (activeTab === 'utilization') {
      const rows = hubVehicles.map((v) => ({
        'Vehicle ID': v.id,
        'Make & Model': `${v.make} ${v.model} (${v.year})`,
        'Plate': v.plate,
        'Hub': v.branch?.name || v.branchId,
        'Status': v.operationalState,
        'Odometer (km)': v.currentOdometerKm,
        'Daily Rate (NGN)': (v.baseRateMinor / 100).toFixed(2),
      }));
      downloadCsv(`drivefleet-utilization-report-${dateStr}.csv`, rows);
    } else if (activeTab === 'bookings') {
      const rows = hubBookings.map((b) => ({
        'Booking Reference': b.reference,
        'Customer Name': b.customer ? `${b.customer.firstName} ${b.customer.lastName}` : 'Guest',
        'Vehicle ID': b.vehicleId,
        'Pickup': b.pickupAt,
        'Return': b.returnAt,
        'Status': b.status,
        'Total (NGN)': (getBookingTotalMinor(b) / 100).toFixed(2),
      }));
      downloadCsv(`drivefleet-bookings-ledger-${dateStr}.csv`, rows);
    } else if (activeTab === 'customers') {
      const rows = customers.map((c) => ({
        'Customer ID': c.id,
        'Full Name': `${c.firstName} ${c.lastName}`,
        'Email': c.email || '-',
        'Phone': c.phone || '-',
        'Status': c.status || 'active',
        'Total Spend (NGN)': ((customerSpendMap[c.id] || 0) / 100).toFixed(2),
        'Total Rentals': c.rentalsCount || 0,
      }));
      downloadCsv(`drivefleet-crm-report-${dateStr}.csv`, rows);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Operational Reports & Fleet Analytics
            </h1>
            <span className="text-[10px] font-bold text-blue-700 uppercase px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200">
              Live BI Engine
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Authoritative operational telemetry derived strictly from underlying reservation and inspection records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedHub}
            onChange={(e) => setSelectedHub(e.target.value)}
            className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Dispatch Hubs ({vehicles.length} assets)</option>
            <option value="lagos">Lagos Operating Nodes</option>
            <option value="abuja">Abuja Operating Nodes</option>
          </select>

          <button
            onClick={handleExportCsv}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Role-Aware Report Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-bold overflow-x-auto">
        {isAdmin && (
          <button
            onClick={() => setActiveTab('revenue')}
            className={`pb-3 px-4 flex items-center gap-1.5 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'revenue'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Rental Revenue & Booked Value</span>
          </button>
        )}

        <button
          onClick={() => setActiveTab('utilization')}
          className={`pb-3 px-4 flex items-center gap-1.5 border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'utilization'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Fleet Utilization Ratio</span>
        </button>

        <button
          onClick={() => setActiveTab('bookings')}
          className={`pb-3 px-4 flex items-center gap-1.5 border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'bookings'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Bookings & Dispatch</span>
        </button>

        {isAdmin && (
          <button
            onClick={() => setActiveTab('customers')}
            className={`pb-3 px-4 flex items-center gap-1.5 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'customers'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Customer Intelligence</span>
          </button>
        )}
      </div>

      {/* Tab 1: Admin Revenue Analytics */}
      {activeTab === 'revenue' && isAdmin && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Booked Gross Value</span>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {formatCurrency(totalBookedValueMinor)}
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">Sum of all confirmed & active reservations</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-emerald-600">Settled Completed Revenue</span>
              <div className="text-2xl font-black text-emerald-600 mt-1">
                {formatCurrency(completedRevenueMinor)}
              </div>
              <span className="text-[10px] text-emerald-700 font-semibold mt-1 block">Successfully completed and audited trips</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-blue-600">Average Reservation Value</span>
              <div className="text-2xl font-black text-blue-600 mt-1">
                {formatCurrency(avgBookingValueMinor)}
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">Per reservation contract</span>
            </div>
          </div>

          {/* Revenue Breakdown Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Revenue Ledger by Fleet Category</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase text-[10px] font-semibold">
                  <tr>
                    <th className="py-2.5 px-4">Fleet Class</th>
                    <th className="py-2.5 px-4">Total Reservations</th>
                    <th className="py-2.5 px-4 text-right">Settled & Booked Revenue</th>
                    <th className="py-2.5 px-4 text-right">Share (%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {categoryStats.map((item) => (
                    <tr key={item.category}>
                      <td className="py-3 px-4 font-bold text-slate-900">{item.label}</td>
                      <td className="py-3 px-4 font-mono">{item.bookingsCount}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                        {formatCurrency(item.revenueMinor)}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-blue-600">{item.percentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Fleet Utilization */}
      {activeTab === 'utilization' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Fleet Assets</span>
              <div className="text-3xl font-black text-slate-900 mt-1">{fleetTotal}</div>
              <span className="text-[10px] text-slate-500 mt-1 block">In selected operating nodes</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-emerald-600">Active On-Road</span>
              <div className="text-3xl font-black text-emerald-600 mt-1">{inUseCount}</div>
              <span className="text-[10px] text-emerald-700 font-semibold mt-1 block">Vehicles currently dispatched</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-amber-600">Maintenance Downtime</span>
              <div className="text-3xl font-black text-amber-600 mt-1">{inMaintCount}</div>
              <span className="text-[10px] text-slate-500 mt-1 block">{maintenanceTasks.filter((t) => t.status !== 'completed').length} active work orders</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-blue-600">Gross Utilization</span>
              <div className="text-3xl font-black text-blue-600 mt-1">{utilizationPct}%</div>
              <span className="text-[10px] text-slate-500 mt-1 block">{readyCount} assets ready for dispatch</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3 text-xs text-slate-600">
            <h3 className="font-bold text-slate-900 text-sm">Fleet Operational Standard</h3>
            <p className="leading-relaxed">
              Utilization reflects real-time dispatch commitments, on-road rental intervals, and scheduled maintenance downtime. Scheduled service windows block availability atomically to protect customer pickup guarantees.
            </p>
          </div>
        </div>
      )}

      {/* Tab 3: Bookings & Handovers */}
      {activeTab === 'bookings' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <h3 className="text-sm font-bold text-slate-900">Live Reservation Status Breakdown</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200">
              <div className="text-3xl font-black text-blue-600">{bookingCounts.confirmed}</div>
              <div className="text-xs font-bold text-slate-800 mt-1">Confirmed Upcoming</div>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200">
              <div className="text-3xl font-black text-emerald-600">{bookingCounts.active}</div>
              <div className="text-xs font-bold text-slate-800 mt-1">Active On-Road</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-3xl font-black text-slate-700">{bookingCounts.completed}</div>
              <div className="text-xs font-bold text-slate-800 mt-1">Completed Trips</div>
            </div>
            <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200">
              <div className="text-3xl font-black text-rose-600">{bookingCounts.cancelled}</div>
              <div className="text-xs font-bold text-slate-800 mt-1">Cancelled Trips</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Customer Intelligence */}
      {activeTab === 'customers' && isAdmin && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">CRM Directory Growth & Spending</h3>
            <span className="text-xs font-bold text-blue-600 font-mono">{customers.length} Registered Accounts</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400">Corporate / VIP Accounts</span>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {customers.filter((c) => c.status === 'vip' || c.company).length}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Customer Spend</span>
              <div className="text-2xl font-black text-emerald-600 mt-1">
                {formatCurrency(totalAllCustomerSpendMinor)}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400">Average Spend / Customer</span>
              <div className="text-2xl font-black text-blue-600 mt-1">
                {formatCurrency(
                  customers.length > 0
                    ? Math.round(totalAllCustomerSpendMinor / customers.length)
                    : 0
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
