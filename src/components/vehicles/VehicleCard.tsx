import React from 'react';
import { Link } from 'react-router-dom';
import { Vehicle } from '@/lib/types';
import { formatCurrency } from '@/lib/formatters';
import { Users, Fuel, Gauge, CheckCircle2, ShieldCheck, MapPin } from 'lucide-react';

interface VehicleCardProps {
  vehicle: Vehicle;
  pickupDate?: string;
  returnDate?: string;
}

export function VehicleCard({ vehicle, pickupDate, returnDate }: VehicleCardProps) {
  const estimatedDays = 3;
  // Sample 3-day calculation: Friday + Sat + Sun (Weekend +10% rule)
  // Base + Base*1.1 + Base*1.1 = 3.2 * Base
  const weekendMultiplier = 3.2;
  const quoteMinor = Math.round(vehicle.baseRateMinor * weekendMultiplier);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col group">
      {/* Photo Header */}
      <div className="relative h-48 bg-slate-100 overflow-hidden">
        <img
          src={vehicle.images?.[0] || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=1000'}
          alt={`${vehicle.make} ${vehicle.model}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Status Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-emerald-500/95 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span>Ready for Pickup</span>
        </div>

        {/* Branch Pin Pill */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-slate-900/80 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[11px] font-medium">
          <MapPin className="w-3 h-3 text-blue-400" />
          <span>{vehicle.branch?.name?.includes('Abuja') ? 'Abuja Terminal' : 'Ikeja Main Branch'}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium mb-1">
            <span className="uppercase tracking-wider text-blue-600 font-bold">
              {vehicle.category}
            </span>
            <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
              Plate: {vehicle.plate}
            </span>
          </div>

          <h3 className="text-base font-bold text-slate-900 mb-3">
            {vehicle.make} {vehicle.model} ({vehicle.year})
          </h3>

          {/* Quick Specs Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mb-4 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span>{vehicle.seats} Seats</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-slate-400" />
              <span className="capitalize">{vehicle.transmission}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Fuel className="w-3.5 h-3.5 text-slate-400" />
              <span className="capitalize">{vehicle.fuelType}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
              <span>{vehicle.mileageAllowanceKm} km/day</span>
            </div>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-3 border-t border-slate-100">
          <div className="flex items-baseline justify-between mb-1">
            <span className="text-[11px] text-slate-500">Base Daily Rate</span>
            <div className="text-right">
              <span className="text-lg font-bold text-slate-900">
                {formatCurrency(vehicle.baseRateMinor)}
              </span>
              <span className="text-xs text-slate-500"> / day</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-600 bg-blue-50/60 p-2 rounded-lg border border-blue-100/50 mb-3">
            <span>3 Days Demo Quote (Oct 18-21):</span>
            <span className="font-bold text-blue-700">
              {formatCurrency(quoteMinor)}{' '}
              <span className="text-[9px] uppercase font-semibold text-blue-600">(Weekend Rule)</span>
            </span>
          </div>

          <Link
            to={`/vehicles/${vehicle.id}`}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors"
          >
            <span>Reserve & Book</span>
            <span>→</span>
          </Link>
          <span className="block text-[10px] text-center text-slate-400 mt-1.5">
            Simulated demo checkout • No deposit charged now
          </span>
        </div>
      </div>
    </div>
  );
}
