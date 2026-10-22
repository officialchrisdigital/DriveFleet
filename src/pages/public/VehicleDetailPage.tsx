import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { DEMO_VEHICLES } from '@/lib/demo-data';
import { calculateQuote } from '@/lib/pricing-engine';
import { formatCurrency, formatKilometers } from '@/lib/formatters';
import {
  Users, Fuel, Gauge, ShieldCheck, MapPin, CheckCircle2,
  Calendar, Lock, ArrowLeft, ArrowRight, Clock, AlertTriangle, FileText
} from 'lucide-react';

export function VehicleDetailPage() {
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const navigate = useNavigate();

  const vehicle = DEMO_VEHICLES.find((v) => v.id === vehicleId) || DEMO_VEHICLES[0];

  const [pickupDate] = useState('2026-10-23T10:00:00Z');
  const [returnDate] = useState('2026-10-26T10:00:00Z');
  const [promoCode, setPromoCode] = useState('FLEETDEMO10');
  const [promoApplied, setPromoApplied] = useState(true);

  // Authoritative quote calculation using pricing engine
  const quote = calculateQuote({
    vehicleId: vehicle.id,
    category: vehicle.category,
    baseRateMinor: vehicle.baseRateMinor,
    pickupAt: pickupDate,
    returnAt: returnDate,
    promo: promoApplied
      ? {
          id: 'p1',
          code: 'FLEETDEMO10',
          discountType: 'percentage',
          discountValue: 10,
          validFrom: '2026-01-01',
          validTo: '2026-12-31',
          currentUses: 14,
          active: true,
        }
      : null,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb Bar */}
      <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Link to="/vehicles" className="hover:text-blue-600 flex items-center gap-1 font-medium">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Fleet Directory</span>
          </Link>
          <span>/</span>
          <span className="capitalize">{vehicle.category}</span>
          <span>/</span>
          <span className="font-semibold text-slate-800">{vehicle.make} {vehicle.model}</span>
        </div>

        <div className="flex items-center gap-2 font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          <Lock className="w-3 h-3 text-emerald-600" />
          <span>Guaranteed Real-Time Hold Active</span>
        </div>
      </div>

      {/* Main Vehicle Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs uppercase font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
              {vehicle.category}
            </span>
            <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
              Plate: {vehicle.plate}
            </span>
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-400" />
              {vehicle.branch?.name}
            </span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            {vehicle.make} {vehicle.model} ({vehicle.year})
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Dynamic Force 2.5L Gas/Hybrid Synergy, Electronic On-Demand AWD, TSS 2.5+ Safety Suite.
          </p>
        </div>

        <div className="text-left md:text-right shrink-0">
          <div className="text-xs text-slate-500">Base Daily Rate</div>
          <div className="text-3xl font-black text-slate-900">
            {formatCurrency(vehicle.baseRateMinor)}
            <span className="text-xs font-medium text-slate-500"> / day</span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Gallery/Specs & Transparent Quote Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (7 cols): Images + Dossier + Provenance */}
        <div className="lg:col-span-7 space-y-6">
          {/* Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 h-72 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 relative group">
              <img
                src={vehicle.images?.[0] || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=1000'}
                alt="Exterior"
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-sm text-white px-2 py-1 rounded text-[11px] font-medium">
                Exterior Profile • Metallic Magnetite
              </span>
            </div>
            <div className="flex sm:flex-col gap-3 h-72">
              <div className="flex-1 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 relative">
                <img
                  src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=500"
                  alt="Interior"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-2 left-2 bg-slate-900/80 text-white px-1.5 py-0.5 rounded text-[10px]">
                  Cockpit & Telematics
                </span>
              </div>
              <div className="flex-1 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 relative">
                <img
                  src="https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=500"
                  alt="Trunk"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-2 left-2 bg-slate-900/80 text-white px-1.5 py-0.5 rounded text-[10px]">
                  Cargo Utility (580L)
                </span>
              </div>
            </div>
          </div>

          {/* Mechanical & Dimension Specs */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Gauge className="w-4 h-4 text-blue-600" />
              <span>Fleet Mechanical & Dimension Specifications</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <Users className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                <div className="text-[11px] text-slate-500">Capacity</div>
                <div className="text-xs font-bold text-slate-900">{vehicle.seats} Adult Seats</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <Gauge className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                <div className="text-[11px] text-slate-500">Transmission</div>
                <div className="text-xs font-bold text-slate-900 capitalize">{vehicle.transmission}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <Fuel className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                <div className="text-[11px] text-slate-500">Fuel Type</div>
                <div className="text-xs font-bold text-slate-900 capitalize">{vehicle.fuelType}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <ShieldCheck className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                <div className="text-[11px] text-slate-500">Included Mileage</div>
                <div className="text-xs font-bold text-slate-900">{vehicle.mileageAllowanceKm} km / day</div>
              </div>
            </div>
          </div>

          {/* Inspection & Provenance Log */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Inspection & Provenance Log</span>
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Fleet Ready Grade A
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-[11px] text-slate-500 font-medium">Verified Odometer Baseline</div>
                <div className="text-lg font-black text-slate-900 mt-0.5">
                  {formatKilometers(vehicle.currentOdometerKm)}
                </div>
                <div className="text-[10px] text-emerald-600 mt-1 flex items-center gap-1">
                  ✓ Synced via Handover Protocol FR-09
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-[11px] text-slate-500 font-medium">Last Multi-Point Audit</div>
                <div className="text-lg font-black text-slate-900 mt-0.5">
                  4 Days Ago
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  Zero recorded body defects • 100% Brake/Tire Tread
                </div>
              </div>
            </div>
          </div>

          {/* Rental Conditions & SLA Notice */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-3 text-xs text-slate-600">
            <h4 className="font-bold text-slate-900 text-sm">Rental Conditions & Fleet SLA</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <strong className="text-slate-800">24-Hour Cancellation Window:</strong> Free cancellations permitted up to 24 hours prior to pickup.
              </div>
              <div>
                <strong className="text-slate-800">Full-to-Full Fuel Standard:</strong> Vehicle dispatched at 8/8 full tank; return at 8/8 to avoid refuel fee.
              </div>
              <div>
                <strong className="text-slate-800">Renter Eligibility:</strong> Minimum 21 years old with valid Nigerian FRSC Driver License or International Permit.
              </div>
              <div>
                <strong className="text-slate-800">Simulated Security Deposit:</strong> NGN 50,000 pre-authorization hold simulated at counter (released at return).
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Sticky Real-Time Quote Summary (Exact Mockup Match) */}
        <div className="lg:col-span-5 sticky top-24">
          <div className="bg-white rounded-2xl border border-blue-600 shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-5">
              <div className="text-[10px] uppercase font-bold tracking-wider text-blue-200">
                Transparent Dynamic Pricing Guarantee
              </div>
              <h3 className="text-lg font-black tracking-tight mt-0.5">
                Real-Time Quote Summary
              </h3>
            </div>

            <div className="p-6 space-y-5">
              {/* Dispatch Hub & Window */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2 text-xs">
                <div className="flex justify-between items-center text-slate-500 font-semibold text-[11px] pb-1 border-b border-slate-200">
                  <span>Interval & Dispatch Hub</span>
                  <span className="text-blue-600">3 × 24h Cycles (72 hrs)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Pickup:</span>
                  <span className="font-medium text-slate-900 text-right">
                    Lagos Ikeja Main Hub<br />
                    <span className="text-slate-500">Fri, Oct 23, 2026 @ 10:00 AM</span>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Return:</span>
                  <span className="font-medium text-slate-900 text-right">
                    Lagos Ikeja Main Hub<br />
                    <span className="text-slate-500">Mon, Oct 26, 2026 @ 10:00 AM</span>
                  </span>
                </div>
              </div>

              {/* Itemized Calculation */}
              <div className="space-y-2.5 text-xs text-slate-600">
                <div className="font-bold text-slate-900 text-[11px] uppercase tracking-wider">
                  Itemized Rule Breakdown
                </div>

                {quote.lineItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <div>
                      <span className="font-medium text-slate-800">
                        {item.isWeekend ? 'Weekend Surcharge (+10%)' : 'Base Weekday Rate'}
                      </span>
                      <span className="text-slate-400 block text-[10px]">
                        Period {item.periodIndex} ({item.periodDate})
                      </span>
                    </div>
                    <span className="font-mono font-medium text-slate-900">
                      {formatCurrency(item.rateMinor)}
                    </span>
                  </div>
                ))}

                <div className="pt-2 border-t border-slate-200 flex justify-between font-semibold text-slate-800">
                  <span>Subtotal Rental Charges</span>
                  <span className="font-mono">{formatCurrency(quote.subtotalMinor)}</span>
                </div>

                {/* Promo Code Input & Tag */}
                <div className="pt-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      placeholder="Promo Code"
                      className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-mono font-bold uppercase"
                    />
                    <button
                      type="button"
                      onClick={() => setPromoApplied(!promoApplied)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                        promoApplied
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {promoApplied ? 'Applied ✓' : 'Apply'}
                    </button>
                  </div>
                  {promoApplied && (
                    <div className="flex justify-between text-xs text-emerald-600 font-semibold mt-2">
                      <span>Promo (FLEETDEMO10 - 10% Off):</span>
                      <span className="font-mono">-{formatCurrency(quote.promoDiscountMinor)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Net Rental Total */}
              <div className="pt-4 border-t border-slate-200">
                <div className="flex items-baseline justify-between mb-1">
                  <div>
                    <span className="text-sm font-bold text-slate-900 block">Net Rental Total</span>
                    <span className="text-[10px] text-slate-500">Includes all applicable VAT & maintenance</span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-blue-600">
                      {formatCurrency(quote.totalMinor)}
                    </span>
                  </div>
                </div>

                {/* Refundable Deposit Notice */}
                <div className="bg-amber-50/80 p-2.5 rounded-xl border border-amber-200/80 mt-3 text-[11px] text-amber-900 flex justify-between items-center">
                  <span>Refundable Security Deposit (Hold):</span>
                  <span className="font-bold font-mono">{formatCurrency(quote.depositMinor)}</span>
                </div>
              </div>

              {/* Proceed to Booking CTA */}
              <button
                onClick={() => navigate(`/book/${vehicle.id}`)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <span>Proceed to Guided Booking</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center text-[10px] text-slate-400 space-y-1">
                <div>🔒 256-bit TLS Protected • Simulated Demo Checkout</div>
                <div>No real credit card required</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
