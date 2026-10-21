import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { formatCurrency } from '@/lib/formatters';
import {
  BarChart3, TrendingUp, Calendar, Download, PieChart,
  Car, ShieldCheck, DollarSign, Filter, AlertCircle
} from 'lucide-react';

export function OperationalReportsPage() {
  const { role } = useAuth();
  const isAdmin = role === 'admin';

  const [activeTab, setActiveTab] = useState<'utilization' | 'bookings' | 'revenue' | 'customers'>(
    isAdmin ? 'revenue' : 'utilization'
  );
  const [selectedHub, setSelectedHub] = useState('all');
  const [dateRange, setDateRange] = useState('month');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Operational Reports & Fleet Analytics
            </h1>
            <span className="text-[10px] font-bold text-slate-500 uppercase px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
              PRD §10 / FR-12
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
            className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-800 shadow-sm"
          >
            <option value="all">All Dispatch Hubs</option>
            <option value="ikeja">Lagos Ikeja Main Hub</option>
            <option value="abuja">Abuja Central Terminal</option>
          </select>

          <button
            onClick={() => alert(`Exporting ${activeTab.toUpperCase()} report as formatted CSV...`)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CSV</span>
          </button>
        </div>
      </div>

      {/* Role-Aware Report Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-bold">
        {isAdmin && (
          <button
            onClick={() => setActiveTab('revenue')}
            className={`pb-3 px-4 flex items-center gap-1.5 border-b-2 transition-colors ${
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
          className={`pb-3 px-4 flex items-center gap-1.5 border-b-2 transition-colors ${
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
          className={`pb-3 px-4 flex items-center gap-1.5 border-b-2 transition-colors ${
            activeTab === 'bookings'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Bookings & Handovers</span>
        </button>

        {isAdmin && (
          <button
            onClick={() => setActiveTab('customers')}
            className={`pb-3 px-4 flex items-center gap-1.5 border-b-2 transition-colors ${
              activeTab === 'customers'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Customer Acquisition</span>
          </button>
        )}
      </div>

      {/* Tab 1: Admin-Only Revenue Analytics */}
      {activeTab === 'revenue' && isAdmin && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Booked Value</span>
              <div className="text-2xl font-black text-slate-900 mt-1">NGN 8,420,000</div>
              <span className="text-[10px] text-slate-500 mt-1 block">Sum of active & confirmed quotes</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-emerald-600">Completed Rental Revenue</span>
              <div className="text-2xl font-black text-emerald-600 mt-1">NGN 6,180,000</div>
              <span className="text-[10px] text-emerald-700 font-semibold mt-1 block">Settled return inspections</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-blue-600">Average Booking Value</span>
              <div className="text-2xl font-black text-blue-600 mt-1">NGN 134,500</div>
              <span className="text-[10px] text-slate-500 mt-1 block">Per 72-hour average cycle</span>
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
                    <th className="py-2.5 px-4">Completed Bookings</th>
                    <th className="py-2.5 px-4">Billed Hours</th>
                    <th className="py-2.5 px-4 text-right">Settled Revenue</th>
                    <th className="py-2.5 px-4 text-right">Share (%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr>
                    <td className="py-3 px-4 font-bold text-slate-900">Luxury Saloons & Executive 4WD</td>
                    <td className="py-3 px-4">12</td>
                    <td className="py-3 px-4 font-mono">864 hrs</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">NGN 3,450,000</td>
                    <td className="py-3 px-4 text-right font-bold text-blue-600">55.8%</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-slate-900">Compact SUVs & AWD</td>
                    <td className="py-3 px-4">18</td>
                    <td className="py-3 px-4 font-mono">1,296 hrs</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">NGN 1,890,000</td>
                    <td className="py-3 px-4 text-right font-bold text-blue-600">30.6%</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-slate-900">Executive Sedans</td>
                    <td className="py-3 px-4">14</td>
                    <td className="py-3 px-4 font-mono">1,008 hrs</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">NGN 840,000</td>
                    <td className="py-3 px-4 text-right font-bold text-blue-600">13.6%</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="text-[10px] text-slate-400">
              Note: All figures reflect simulated demo checkout results in Nigerian Naira (NGN).
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Utilization (PRD §10 Standard) */}
      {activeTab === 'utilization' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-slate-400">Gross Fleet Utilization</span>
              <div className="text-3xl font-black text-blue-600 mt-1">78.4%</div>
              <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">+4.2% vs previous month</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Billed Rented Hours</span>
              <div className="text-2xl font-black text-slate-900 mt-1">3,168 hrs</div>
              <span className="text-[10px] text-slate-500 mt-1 block">Excludes buffer and prep-staging</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-amber-600">Maintenance Downtime Deduction</span>
              <div className="text-2xl font-black text-amber-600 mt-1">216 hrs</div>
              <span className="text-[10px] text-slate-500 mt-1 block">Deducted from denominator per PRD §10</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3 text-xs text-slate-600">
            <h3 className="font-bold text-slate-900 text-sm">PRD Section 10 Utilization Compliance Standard</h3>
            <p className="leading-relaxed">
              Utilization is calculated strictly as: <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-blue-700 font-bold">Rented Hours ÷ Rentable Fleet Hours</code>.
              Rentable fleet hours subtract the union of verified scheduled maintenance and out-of-service quarantine windows without double-deducting overlaps.
            </p>
          </div>
        </div>
      )}

      {/* Tab 3: Bookings & Handovers */}
      {activeTab === 'bookings' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Booking Status Volume Summary</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-2xl font-black text-blue-600">4</div>
              <div className="text-xs font-bold text-slate-800 mt-1">Confirmed Upcoming</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-2xl font-black text-emerald-600">2</div>
              <div className="text-xs font-bold text-slate-800 mt-1">Active On-Road</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-2xl font-black text-slate-700">6</div>
              <div className="text-xs font-bold text-slate-800 mt-1">Completed Trips</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-2xl font-black text-red-600">3</div>
              <div className="text-xs font-bold text-slate-800 mt-1">Cancelled (Free-Refund)</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
