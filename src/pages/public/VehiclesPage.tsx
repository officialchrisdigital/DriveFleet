import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DEMO_VEHICLES } from '@/lib/demo-data';
import { VehicleCard } from '@/components/vehicles/VehicleCard';
import { Search, SlidersHorizontal, Grid, List, Check } from 'lucide-react';

export function VehiclesPage() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('class') || 'all';

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedTransmission, setSelectedTransmission] = useState('all');
  const [sortBy, setSortBy] = useState('recommended');

  const filteredVehicles = DEMO_VEHICLES.filter((v) => {
    if (selectedCategory !== 'all' && v.category !== selectedCategory) return false;
    if (selectedTransmission !== 'all' && v.transmission !== selectedTransmission) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Search & Filter Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Vehicle Discovery & Fleet Booking
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Displaying active rentable units across Lagos Ikeja and Abuja Terminal hubs.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All Vehicles' },
            { id: 'sedan', label: 'Sedans' },
            { id: 'suv', label: 'SUVs & 4WD' },
            { id: 'luxury', label: 'Executive / Luxury' },
            { id: 'economy', label: 'Economy' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-600">
        <div>
          <span className="font-bold text-slate-900 text-sm">{filteredVehicles.length} vehicles available</span>
          <span className="text-slate-500"> (Oct 23 – 26, 2026 • 3 Days Rental Interval)</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span>Transmission:</span>
            <select
              value={selectedTransmission}
              onChange={(e) => setSelectedTransmission(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-medium text-slate-800"
            >
              <option value="all">Any</option>
              <option value="automatic">Automatic Only</option>
              <option value="manual">Manual</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-medium text-slate-800"
            >
              <option value="recommended">Recommended</option>
              <option value="price-asc">Daily Rate: Low to High</option>
              <option value="price-desc">Daily Rate: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      {filteredVehicles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <h3 className="text-base font-bold text-slate-900 mb-1">No vehicles match your filter</h3>
          <p className="text-xs text-slate-500 mb-4">Try clearing category or transmission constraints.</p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedTransmission('all');
            }}
            className="text-xs bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
}
