import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DEMO_VEHICLES } from '@/lib/demo-data';
import { VehicleCard } from '@/components/vehicles/VehicleCard';
import { Search, Calendar, MapPin, ShieldCheck, Clock, CheckCircle2, Award, ArrowRight, Car } from 'lucide-react';

export function HomePage() {
  const navigate = useNavigate();
  const [selectedBranch, setSelectedBranch] = useState('ikeja');
  const [pickupDate, setPickupDate] = useState('2026-10-23');
  const [pickupTime, setPickupTime] = useState('10:00');
  const [returnDate, setReturnDate] = useState('2026-10-26');
  const [returnTime, setReturnTime] = useState('10:00');
  const [fleetClass, setFleetClass] = useState('all');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/vehicles?branch=${selectedBranch}&pickup=${pickupDate}&return=${returnDate}&class=${fleetClass}`);
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative bg-white border-b border-slate-200 pt-12 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-200/80 px-3 py-1 rounded-full text-xs font-semibold mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span>Instant Transparent Quotes • Zero Hidden Surcharges</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 max-w-4xl mx-auto leading-tight mb-4">
            The right car. The right dates. <br className="hidden sm:inline" />
            <span className="text-blue-600">One easy booking.</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Reliable car rentals across Lagos and Abuja with instant transparent quotes, deterministic weekend rate rules, and guaranteed fleet availability.
          </p>

          {/* Booking Search Widget (Exact Mockup Match) */}
          <div className="max-w-6xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-xl p-5 sm:p-6 text-left relative z-10">
            <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  <span>Pickup & Return Branch</span>
                </label>
                <select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 h-[42px] cursor-pointer"
                >
                  <option value="ikeja">Lagos – Ikeja Main Branch (GRA)</option>
                  <option value="abuja">Abuja – Central Terminal Hub</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  <span>Pickup Date & Time</span>
                </label>
                <div className="flex gap-1.5">
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-2/3 bg-slate-50 border border-slate-300 rounded-xl px-2.5 text-xs font-medium text-slate-800 date-picker-black cursor-pointer h-[42px]"
                  />
                  <input
                    type="time"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="w-1/3 bg-slate-50 border border-slate-300 rounded-xl px-2 text-xs font-medium text-slate-800 h-[42px]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    <span>Return Date & Time</span>
                  </label>
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                    3 Days Rental
                  </span>
                </div>
                <div className="flex gap-1.5">
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-2/3 bg-slate-50 border border-slate-300 rounded-xl px-2.5 text-xs font-medium text-slate-800 date-picker-black cursor-pointer h-[42px]"
                  />
                  <input
                    type="time"
                    value={returnTime}
                    onChange={(e) => setReturnTime(e.target.value)}
                    className="w-1/3 bg-slate-50 border border-slate-300 rounded-xl px-2 text-xs font-medium text-slate-800 h-[42px]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Car className="w-3.5 h-3.5 text-blue-600" />
                  <span>Fleet Class</span>
                </label>
                <select
                  value={fleetClass}
                  onChange={(e) => setFleetClass(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 h-[42px] cursor-pointer"
                >
                  <option value="all">All Classes</option>
                  <option value="suv">SUVs & AWD</option>
                  <option value="sedan">Executive Sedans</option>
                  <option value="luxury">Luxury Saloons</option>
                  <option value="economy">Economy</option>
                </select>
              </div>

              <div className="sm:col-span-2 lg:col-span-1">
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm hover:shadow transition-all text-xs h-[42px]"
                >
                  <Search className="w-4 h-4" />
                  <span>Find Cars</span>
                </button>
              </div>
            </form>

            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>
                  Rule Applied: <strong className="text-slate-800">Weekend +10% Rate Rule</strong> active for Saturday/Sunday starts.
                </span>
              </div>
              <div className="flex items-center gap-4 text-[11px]">
                <span className="text-emerald-700 flex items-center gap-1">✓ Turnaround buffer included</span>
                <span className="text-emerald-700 flex items-center gap-1">✓ Unlimited maintenance quarantine check</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Fleet Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Featured Active Fleet Units
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Displaying 9 featured models across Lagos Ikeja and Abuja Terminal nodes.
            </p>
          </div>

          <Link
            to="/vehicles"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
          >
            <span>View All 15 Fleet Vehicles</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DEMO_VEHICLES.slice(0, 9).map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>

        {/* View All Fleet Vehicles CTA Bar */}
        <div className="mt-8 text-center">
          <Link
            to="/vehicles"
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-md transition-all hover:scale-[1.01]"
          >
            <span>View All 15 Fleet Vehicles</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* How DriveFleet Works (From Mockup 3-Step Section) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm text-center">
          <div className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">
            Transparent Rental Architecture
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">
            How DriveFleet Works
          </h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto mb-10">
            Every reservation is backed by transactional availability logic, preventing overlapping bookings across public renters and internal branch staff.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-black text-lg flex items-center justify-center mb-4 shadow-sm">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Select Dates & Car
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pick your pickup branch and rental window. Real-time fleet locks verify vehicle readiness and maintenance buffers before you confirm.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-black text-lg flex items-center justify-center mb-4 shadow-sm">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Transparent Quote
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Receive an itemized rate with automated weekend calculation (+10% Sat/Sun) and duration discounts stored to an immutable price snapshot.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-black text-lg flex items-center justify-center mb-4 shadow-sm">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Fast Branch Handover
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Arrive at the Ikeja or Airport desk. Staff inspect odometer, fuel, and condition checklists with immediate timestamped handover records.
              </p>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="font-semibold text-slate-700">Strict Fleet Integrity Guaranteed:</span>
              <span>Zero double-booking guarantee via atomic database constraints and automated maintenance quarantine.</span>
            </div>
            <div className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              100% In-Service Validation
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
