import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DEMO_VEHICLES } from '@/lib/demo-data';
import { VehicleCard } from '@/components/vehicles/VehicleCard';
import {
  getSavedSearchCriteria,
  saveSearchCriteria,
  RentalSearchCriteria,
} from '@/lib/userBookings';
import {
  Search, SlidersHorizontal, Calendar, Clock, MapPin,
  Check, ArrowRight, RotateCcw, Sparkles
} from 'lucide-react';

export function VehiclesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('class') || 'all';

  // Rental Search & Date Criteria State
  const initialCriteria = getSavedSearchCriteria();
  const [hub, setHub] = useState<string>(searchParams.get('hub') || initialCriteria.hub);
  const [pickupDate, setPickupDate] = useState<string>(searchParams.get('pickupDate') || initialCriteria.pickupDate);
  const [pickupTime, setPickupTime] = useState<string>(searchParams.get('pickupTime') || initialCriteria.pickupTime);
  const [returnDate, setReturnDate] = useState<string>(searchParams.get('returnDate') || initialCriteria.returnDate);
  const [returnTime, setReturnTime] = useState<string>(searchParams.get('returnTime') || initialCriteria.returnTime);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedTransmission, setSelectedTransmission] = useState('all');
  const [sortBy, setSortBy] = useState('recommended');

  // Compute today's date formatted as YYYY-MM-DD for min date
  const todayStr = new Date().toISOString().split('T')[0];

  // Calculate rental interval duration in hours and days
  const computeDuration = () => {
    try {
      const start = new Date(`${pickupDate}T${pickupTime}:00`);
      const end = new Date(`${returnDate}T${returnTime}:00`);
      const diffMs = end.getTime() - start.getTime();
      if (diffMs <= 0) return { days: 1, hours: 24, isValid: false };
      const hours = Math.round(diffMs / (1000 * 60 * 60));
      const days = Math.max(1, Math.ceil(hours / 24));
      return { days, hours, isValid: true };
    } catch {
      return { days: 3, hours: 72, isValid: true };
    }
  };

  const { days, hours, isValid } = computeDuration();

  // Save criteria whenever updated
  useEffect(() => {
    saveSearchCriteria({
      hub,
      pickupDate,
      pickupTime,
      returnDate,
      returnTime,
    });
  }, [hub, pickupDate, pickupTime, returnDate, returnTime]);

  // Quick preset helper
  const handleApplyPresetDays = (presetDays: number) => {
    try {
      const start = new Date(`${pickupDate}T${pickupTime}:00`);
      const end = new Date(start);
      end.setDate(end.getDate() + presetDays);
      setReturnDate(end.toISOString().split('T')[0]);
    } catch {
      // Ignore
    }
  };

  // Filter vehicles
  const filteredVehicles = DEMO_VEHICLES.filter((v) => {
    if (selectedCategory !== 'all' && v.category !== selectedCategory) return false;
    if (selectedTransmission !== 'all' && v.transmission !== selectedTransmission) return false;
    if (hub !== 'all') {
      if (hub.includes('Abuja') && !v.branch?.name?.includes('Abuja')) return false;
      if (hub.includes('Lagos') && v.branch?.name?.includes('Abuja')) return false;
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.baseRateMinor - b.baseRateMinor;
    if (sortBy === 'price-desc') return b.baseRateMinor - a.baseRateMinor;
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Interactive Rental Search & Date Picker Bar */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Calendar className="w-4 h-4" />
              <span>Rental Schedule & Reservation Dispatch</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Select Your Exact Pickup & Return Dates
            </h1>
          </div>

          <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-full text-xs text-blue-300">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span>Guaranteed Instant Vehicle Allocation</span>
          </div>
        </div>

        {/* Date / Time / Hub Selection Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* 1. Pickup Branch */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              <span>Pickup Hub</span>
            </label>
            <select
              value={hub}
              onChange={(e) => setHub(e.target.value)}
              className="w-full bg-slate-800/90 hover:bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              <option value="all">All Available Hubs</option>
              <option value="Lagos Ikeja Main Hub">Lagos Ikeja Main Hub (GRA)</option>
              <option value="Abuja Central Terminal">Abuja Central Terminal</option>
            </select>
          </div>

          {/* 2. Pickup Date */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              <span>Pickup Date</span>
            </label>
            <input
              type="date"
              min={todayStr}
              value={pickupDate}
              onChange={(e) => {
                setPickupDate(e.target.value);
                // Ensure return date is not before pickup date
                if (e.target.value > returnDate) {
                  const newReturn = new Date(e.target.value);
                  newReturn.setDate(newReturn.getDate() + 3);
                  setReturnDate(newReturn.toISOString().split('T')[0]);
                }
              }}
              className="w-full bg-slate-800/90 hover:bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            />
          </div>

          {/* 3. Pickup Time */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span>Pickup Time</span>
            </label>
            <select
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
              className="w-full bg-slate-800/90 hover:bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              {['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'].map((time) => (
                <option key={time} value={time}>
                  {time} (WAT)
                </option>
              ))}
            </select>
          </div>

          {/* 4. Drop-off Date */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              <span>Drop-off Date</span>
            </label>
            <input
              type="date"
              min={pickupDate || todayStr}
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className="w-full bg-slate-800/90 hover:bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            />
          </div>

          {/* 5. Drop-off Time */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span>Drop-off Time</span>
            </label>
            <select
              value={returnTime}
              onChange={(e) => setReturnTime(e.target.value)}
              className="w-full bg-slate-800/90 hover:bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              {['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'].map((time) => (
                <option key={time} value={time}>
                  {time} (WAT)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Presets & Duration Live Summary Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-slate-800/80 text-xs">
          {/* Presets */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] text-slate-400 font-medium">Quick Intervals:</span>
            {[
              { label: '1 Day', days: 1 },
              { label: '3 Days (Weekend)', days: 3 },
              { label: '7 Days (Weekly -10%)', days: 7 },
              { label: '14 Days', days: 14 },
              { label: '30 Days (Monthly -20%)', days: 30 },
            ].map((preset) => (
              <button
                key={preset.days}
                type="button"
                onClick={() => handleApplyPresetDays(preset.days)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                  days === preset.days
                    ? 'bg-blue-600 text-white font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Computed Duration Badge */}
          <div className="flex items-center gap-2 bg-slate-800 px-3.5 py-1.5 rounded-xl border border-slate-700 text-blue-300 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span>
              Duration: <strong className="text-white">{days} Day{days > 1 ? 's' : ''}</strong> ({hours} Hours)
            </span>
            {days >= 7 && (
              <span className="ml-1 text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-1.5 py-0.5 rounded">
                {days >= 30 ? '20% Monthly Saver' : '10% Weekly Saver'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Filter and Category Pills Row */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Select Your Preferred Vehicle Category
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time estimated rates calculated for your {days}-day rental window ({pickupDate} to {returnDate}).
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All Classes' },
            { id: 'sedan', label: 'Executive Sedans' },
            { id: 'suv', label: 'SUVs & 4WD' },
            { id: 'luxury', label: 'Luxury Prestige' },
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

      {/* Secondary Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-600">
        <div>
          <span className="font-bold text-slate-900 text-sm">{filteredVehicles.length} vehicles available</span>
          <span className="text-slate-500">
            {' '}
            for {pickupDate} @ {pickupTime} → {returnDate} @ {returnTime}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span>Transmission:</span>
            <select
              value={selectedTransmission}
              onChange={(e) => setSelectedTransmission(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-medium text-slate-800"
            >
              <option value="all">Any Transmission</option>
              <option value="automatic">Automatic Only</option>
              <option value="manual">Manual Only</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-medium text-slate-800"
            >
              <option value="recommended">Recommended Fleet</option>
              <option value="price-asc">Daily Rate: Low to High</option>
              <option value="price-desc">Daily Rate: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Vehicle Grid */}
      {filteredVehicles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              days={days}
              pickupDate={pickupDate}
              pickupTime={pickupTime}
              returnDate={returnDate}
              returnTime={returnTime}
              hub={hub}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <h3 className="text-base font-bold text-slate-900">No vehicles match your search</h3>
          <p className="text-xs text-slate-500">
            Try adjusting your category, transmission, or hub filters to see available units.
          </p>
          <div>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedTransmission('all');
                setHub('all');
              }}
              className="text-xs bg-blue-600 text-white font-semibold px-4 py-2 rounded-xl shadow-sm hover:bg-blue-700 transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
