import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useOperations } from '@/contexts/OperationsContext';
import { formatCurrency, formatKilometers } from '@/lib/formatters';
import { downloadCsv } from '@/lib/csvExport';
import {
  Car, Plus, Search, Filter, Download, AlertTriangle,
  Wrench, CheckCircle2, ChevronRight, Eye, Edit, ShieldAlert
} from 'lucide-react';

export function FleetRegisterPage() {
  const { vehicles, updateVehicle } = useOperations();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedState, setSelectedState] = useState('all');

  const filtered = vehicles.filter((v) => {
    if (selectedState !== 'all' && v.operationalState !== selectedState) return false;
    if (selectedBranch !== 'all' && v.branch?.city.toLowerCase() !== selectedBranch) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        v.make.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        v.plate.toLowerCase().includes(q) ||
        v.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleExportCsv = () => {
    const headers = [
      'Vehicle ID',
      'Make',
      'Model',
      'Year',
      'Plate Number',
      'Category',
      'Branch City',
      'Daily Rate (NGN)',
      'Current Odometer (km)',
      'Operational State',
      'Seats',
      'Transmission',
      'Fuel Type',
    ];

    const rows = filtered.map((v) => [
      v.id,
      v.make,
      v.model,
      v.year,
      v.plate,
      v.category.toUpperCase(),
      v.branch?.city || 'Lagos',
      v.baseRateMinor / 100,
      v.currentOdometerKm,
      v.operationalState.toUpperCase(),
      v.seats,
      v.transmission,
      v.fuelType,
    ]);

    downloadCsv('drivefleet-fleet-inventory.csv', headers, rows);
  };

  const getStatusBadge = (state: string) => {
    switch (state) {
      case 'ready':
        return (
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Ready for Pickup
          </span>
        );
      case 'in_maintenance':
        return (
          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1">
            <Wrench className="w-3 h-3 text-amber-600" />
            In Maintenance
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-bold text-red-700 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-red-600" />
            Out of Service
          </span>
        );
    }
  };

  const readyCount = vehicles.filter((v) => v.operationalState === 'ready').length;
  const maintCount = vehicles.filter((v) => v.operationalState === 'in_maintenance').length;
  const oosCount = vehicles.filter((v) => v.operationalState === 'out_of_service').length;

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Fleet Register & Inventory Management
            </h1>
            <span className="text-[10px] font-bold text-slate-500 uppercase px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
              Live Assets ({vehicles.length})
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Master vehicle registry, branch allocation, operational states, and telemetry compliance milestones.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
            title="Download Inventory CSV"
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
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center sm:text-left">
          <div className="text-[10px] uppercase font-bold text-slate-400">Total Active Fleet</div>
          <div className="text-xl font-black text-slate-900 mt-0.5">{vehicles.length} Units</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center sm:text-left">
          <div className="text-[10px] uppercase font-bold text-emerald-600">Ready for Dispatch</div>
          <div className="text-xl font-black text-emerald-600 mt-0.5">{readyCount} Units</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center sm:text-left">
          <div className="text-[10px] uppercase font-bold text-amber-600">In Maintenance Block</div>
          <div className="text-xl font-black text-amber-600 mt-0.5">{maintCount} Units</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center sm:text-left">
          <div className="text-[10px] uppercase font-bold text-red-600">Out of Service</div>
          <div className="text-xl font-black text-red-600 mt-0.5">{oosCount} Units</div>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search make, model, plate, or category..."
            className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="all">All Hub Locations</option>
              <option value="lagos">Lagos Ikeja Hub</option>
              <option value="abuja">Abuja Central Hub</option>
            </select>
          </div>

          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="all">All Operational States</option>
            <option value="ready">Ready State Only</option>
            <option value="in_maintenance">In Maintenance Only</option>
            <option value="out_of_service">Out of Service Only</option>
          </select>
        </div>
      </div>

      {/* Fleet Asset Cards/Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Car className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <div className="font-bold text-slate-700 text-sm">No vehicles match filters</div>
            <p className="text-xs text-slate-400 mt-1">Try resetting your hub or operational state selection.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 text-xs">
            {filtered.map((v) => (
              <div
                key={v.id}
                className="p-4 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Left: Thumbnail & Name */}
                <div className="flex items-center gap-3.5 min-w-[260px]">
                  <img
                    src={v.images?.[0] || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=300'}
                    alt={`${v.make} ${v.model}`}
                    className="w-16 h-12 rounded-xl object-cover bg-slate-100 border border-slate-200 shrink-0 shadow-xs"
                  />
                  <div>
                    <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <Link
                        to={`/admin/vehicles/${v.id}`}
                        className="hover:text-blue-600 transition-colors"
                      >
                        {v.make} {v.model} ({v.year})
                      </Link>
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded uppercase">
                        {v.category}
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-500 font-bold mt-0.5 flex items-center gap-2">
                      <span>{v.plate}</span>
                      <span>•</span>
                      <span className="font-sans font-medium text-slate-600">{v.branch?.city} Hub</span>
                    </div>
                  </div>
                </div>

                {/* Middle: Telemetry & State */}
                <div className="flex flex-wrap items-center gap-4 min-w-[220px]">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Telemetry Odometer</span>
                    <span className="font-mono font-bold text-slate-800 text-xs">
                      {formatKilometers(v.currentOdometerKm)}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Daily Rate</span>
                    <span className="font-bold text-slate-900 text-xs">
                      {formatCurrency(v.baseRateMinor)}/day
                    </span>
                  </div>

                  <div>{getStatusBadge(v.operationalState)}</div>
                </div>

                {/* Right: Quick State Change & Actions */}
                <div className="flex items-center justify-between md:justify-end gap-3 shrink-0">
                  {/* Operational State Dropdown */}
                  <select
                    value={v.operationalState}
                    onChange={(e) => updateVehicle(v.id, { operationalState: e.target.value as any })}
                    className="bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg px-2.5 py-1.5 text-[11px] font-bold text-slate-700 focus:outline-none transition-colors cursor-pointer"
                    title="Change operational status"
                  >
                    <option value="ready">State: Ready</option>
                    <option value="in_maintenance">State: Maintenance</option>
                    <option value="out_of_service">State: Out of Service</option>
                  </select>

                  <Link
                    to={`/admin/vehicles/${v.id}`}
                    className="p-1.5 rounded-lg border border-slate-200 hover:border-blue-500 hover:text-blue-600 text-slate-600 transition-colors"
                    title="View vehicle operational dossier"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>

                  <Link
                    to={`/admin/vehicles/${v.id}/edit`}
                    className="p-1.5 rounded-lg border border-slate-200 hover:border-blue-500 hover:text-blue-600 text-slate-600 transition-colors"
                    title="Edit vehicle specifications"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
