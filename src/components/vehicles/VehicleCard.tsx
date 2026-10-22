import React from 'react';
import { Link } from 'react-router-dom';
import { Vehicle } from '@/lib/types';
import { formatCurrency } from '@/lib/formatters';
import { Users, Fuel, Gauge, CheckCircle2, ShieldCheck, MapPin } from 'lucide-react';

interface VehicleCardProps {
  vehicle: Vehicle;
  days?: number;
  pickupDate?: string;
  pickupTime?: string;
  returnDate?: string;
  returnTime?: string;
  hub?: string;
}

export function VehicleCard({
  vehicle,
  days = 3,
  pickupDate,
  pickupTime = '10:00',
  returnDate,
  returnTime = '10:00',
  hub,
}: VehicleCardProps) {
  // Estimate quote based on rental days:
  // PRD duration tiers: 7-29 days = 10% off; 30+ days = 20% off
  const durationDiscount = days >= 30 ? 0.8 : days >= 7 ? 0.9 : 1.0;
  // Estimate average weekend proportion (approx 2 weekend days per 7 days)
  const weekendFactor = days <= 3 ? 1.07 : 1.04;
  const quoteMinor = Math.round(vehicle.baseRateMinor * days * weekendFactor * durationDiscount);

  const queryParams = new URLSearchParams();
  if (pickupDate) queryParams.set('pickupDate', pickupDate);
  if (pickupTime) queryParams.set('pickupTime', pickupTime);
  if (returnDate) queryParams.set('returnDate', returnDate);
  if (returnTime) queryParams.set('returnTime', returnTime);
  if (hub) queryParams.set('hub', hub);

  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';

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
            <span>
              Estimated {days} Day{days > 1 ? 's' : ''} Total:
            </span>
            <span className="font-bold text-blue-700">
              {formatCurrency(quoteMinor)}
              {days >= 7 && (
                <span className="ml-1 text-[9px] uppercase font-semibold text-emerald-600">
                  ({days >= 30 ? '-20% Tier' : '-10% Tier'})
                </span>
              )}
            </span>
          </div>

          <Link
            to={`/book/${vehicle.id}${queryString}`}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors"
          >
            <span>Reserve This Vehicle</span>
            <span className="text-blue-200">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
