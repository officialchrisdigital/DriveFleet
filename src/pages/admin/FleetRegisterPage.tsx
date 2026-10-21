import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DEMO_VEHICLES } from '@/lib/demo-data';
import { formatCurrency, formatKilometers } from '@/lib/formatters';
import {
  Car, Plus, Search, Filter, Download, AlertTriangle,
  Wrench, CheckCircle2, ChevronRight, Eye
} from 'lucide-react';

export function FleetRegisterPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedState, setSelectedState] = useState('all');

  const vehicles = [
    ...DEMO_VEHICLES,
    {
      id: 'corolla-482',
      branchId: 'b0000000-0000-0000-0000-000000000001',
      branch: DEMO_VEHICLES[0].branch,
      make: 'Toyota',
      model: 'Corolla LE',
      year: 2023,
      plate: 'LAG-482-XY',
      plateNormalized: 'LAG482XY',
      category: 'sedan',
      seats: 5,
      transmission: 'automatic',
      fuelType: 'petrol',
      baseRateMinor: 3500000,
      mileageAllowanceKm: 200,
      currentOdometerKm: 24150,
      operationalState: 'ready',
      archived: false,
      serviceThresholds: { nextServiceKm: 25000 },
      images: ['https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&q=80&w=600'],
      createdAt: new Date().toISOString(),
    },
    {
      id: 'civic-504',
      branchId: 'b0000000-0000-0000-0000-000000000001',
      branch: DEMO_VEHICLES[0].branch,
      make: 'Honda',
      model: 'Civic (2021)',
      year: 2021,
      plate: 'LAG-504-HC',
      plateNormalized: 'LAG504HC',
      category: 'sedan',
      seats: 5,
      transmission: 'automatic',
      fuelType: 'petrol',
      baseRateMinor: 3000000,
      mileageAllowanceKm: 200,
      currentOdometerKm: 88320,
      operationalState: 'ready',
      archived: true,
      serviceThresholds: {},
      images: ['https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&q=80&w=600'],
      createdAt: new Date().toISOString(),
    },
  ];

  const filtered = vehicles.filter((v) => {
    if (selectedState !== 'all' && v.operationalState !== selectedState) return false;
    if (selectedBranch !== 'all' && v.branch?.city.toLowerCase() !== selectedBranch) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        v.make.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        v.plate.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Fleet Register & Inventory Management</h1>
            <span className="text-[10px] font-bold text-slate-500 uppercase px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
              FR-04 Compliance
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage master vehicle registry, branch allocation, operational states, and compliance milestones.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Exporting fleet registry CSV...')}
            className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Fleet CSV</span>
          </button>
          <Link
            to="/admin/vehicles/new"
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Vehicle</span>
          </Link>
        </div>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center sm:text-left">
          <div className="text-[10px] uppercase font-bold text-slate-400">Total Fleet</div>
          <div className="text-xl font-black text-slate-900 mt-0.5">32 Units</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center sm:text-left">
          <div className="text-[10px] uppercase font-bold text-emerald-600">Ready</div>
          <div className="text-xl font-black text-emerald-600 mt-0.5">24 Units</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center sm:text-left">
          <div className="text-[10px] uppercase font-bold text-blue-600">Active Rentals</div>
          <div className="text-xl font-black text-blue-600 mt-0.5">5 Units</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center sm:text-left">
          <div className="text-[10px] uppercase font-bold text-amber-600">In Maintenance</div>
          <div className="text-xl font-black text-amber-600 mt-0.5">3 Units</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center sm:text-left">
          <div className="text-[10px] uppercase font-bold text-slate-400">Out of Service</div>
          <div className="text-xl font-black text-slate-500 mt-0.5">0 Units</div>
        </div>
      </div>

      {/* Approaching Milestone Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-amber-900">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>1 Scheduled Milestone Approaching:</strong> Toyota Camry 2024 (LAG-104-AB) has 150 km remaining before 40,000 km mandatory scheduled service.
          </span>
        </div>
        <Link to="/admin/maintenance/new" className="text-blue-700 font-bold hover:underline shrink-0">
          Inspect Log →
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search make, model, or normalized plate..."
            className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-slate-800"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800"
          >
            <option value="all">All Branches</option>
            <option value="lagos">Lagos Ikeja Main Hub</option>
            <option value="abuja">Abuja Central Terminal</option>
          </select>

          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800"
          >
            <option value="all">All Operational States</option>
            <option value="ready">Ready for Pickup</option>
            <option value="in_maintenance">In Maintenance</option>
            <option value="out_of_service">Out of Service</option>
          </select>
        </div>
      </div>

      {/* Master Fleet Table (Exact Mockup Match) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase text-[10px] font-semibold">
              <tr>
                <th className="py-3 px-4">Vehicle & Spec</th>
                <th className="py-3 px-4">Plate Number</th>
                <th className="py-3 px-4">Category / Trans</th>
                <th className="py-3 px-4">Assigned Branch</th>
                <th className="py-3 px-4 text-right">Daily Rate</th>
                <th className="py-3 px-4">Odometer / Allowance</th>
                <th className="py-3 px-4">Operational State</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={v.images?.[0] || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=200'}
                        alt={v.model}
                        className="w-12 h-9 rounded-lg object-cover border border-slate-200 shrink-0"
                      />
                      <div>
                        <div className="font-bold text-slate-900">{v.make} {v.model} ({v.year})</div>
                        <div className="text-[10px] font-mono text-slate-400">VIN: {v.plateNormalized}X92</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] border border-slate-200">
                      {v.plate}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold capitalize text-slate-900">{v.category}</div>
                    <div className="text-[10px] text-slate-400 capitalize">{v.transmission} • {v.seats} Seats</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {v.branch?.city === 'Abuja' ? 'Abuja Central Terminal' : 'Lagos Ikeja Hub'}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                    {formatCurrency(v.baseRateMinor)}
                    <span className="text-[10px] font-normal text-slate-400 block">/ day</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-mono font-semibold text-slate-900">{formatKilometers(v.currentOdometerKm)}</div>
                    <div className="text-[10px] text-slate-400">{v.mileageAllowanceKm} km/day incl.</div>
                  </td>
                  <td className="py-3.5 px-4">
                    {v.archived ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                        Archived
                      </span>
                    ) : v.operationalState === 'ready' ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 w-fit">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Ready
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1 w-fit">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        In Maintenance
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      to={`/admin/vehicles/${v.id}`}
                      className="text-blue-600 hover:text-blue-800 font-semibold p-1 hover:bg-blue-50 rounded"
                    >
                      Dossier
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
