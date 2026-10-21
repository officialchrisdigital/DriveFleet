import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { DEMO_VEHICLES } from '@/lib/demo-data';
import { calculateQuote } from '@/lib/pricing-engine';
import { formatCurrency } from '@/lib/formatters';
import { Check, ShieldCheck, Calendar, MapPin, User, ArrowRight, ArrowLeft } from 'lucide-react';

export function BookingWizardPage() {
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const navigate = useNavigate();

  const vehicle = DEMO_VEHICLES.find((v) => v.id === vehicleId) || DEMO_VEHICLES[0];

  const [step, setStep] = useState<1 | 2 | 3>(2); // Default to Step 2: Renter Details

  // Form State
  const [firstName, setFirstName] = useState('Chukwudi');
  const [lastName, setLastName] = useState('Adeyemi');
  const [email, setEmail] = useState('c.adeyemi@enterprise-lagos.ng');
  const [phone, setPhone] = useState('+234 803 555 0192');
  const [licenseNumber, setLicenseNumber] = useState('FRSC-LAG-8492018B');
  const [nationalId, setNationalId] = useState('9402-4821-NIMC');

  const quote = calculateQuote({
    vehicleId: vehicle.id,
    category: vehicle.category,
    baseRateMinor: vehicle.baseRateMinor,
    pickupAt: '2026-10-23T10:00:00Z',
    returnAt: '2026-10-26T10:00:00Z',
    promo: {
      id: 'p1',
      code: 'FLEETDEMO10',
      discountType: 'percentage',
      discountValue: 10,
      validFrom: '2026-01-01',
      validTo: '2026-12-31',
      currentUses: 14,
      active: true,
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Stepper Header (Exact Mockup Match) */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shrink-0">
            ✓
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Step 1</div>
            <div className="text-xs font-bold text-slate-900">Vehicle Selection</div>
          </div>
        </div>

        <div className="h-0.5 bg-blue-600 flex-1 mx-4 hidden sm:block" />

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 ring-4 ring-blue-100">
            2
          </div>
          <div>
            <div className="text-[10px] text-blue-600 uppercase font-bold">Current Step</div>
            <div className="text-xs font-bold text-slate-900">Driver & Itinerary Review</div>
          </div>
        </div>

        <div className="h-0.5 bg-slate-200 flex-1 mx-4 hidden sm:block" />

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 border border-slate-300 flex items-center justify-center font-bold text-xs shrink-0">
            3
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Step 3</div>
            <div className="text-xs font-bold text-slate-500">Simulated Checkout & Rate Lock</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form Column (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Driver Information Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                <span>Primary Driver Credentials Dossier</span>
              </h3>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                FRSC Verified Online
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Legal First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Legal Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Corporate / Dispatch Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number (WhatsApp Dispatch)</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">FRSC Driver's License No.</label>
                <input
                  type="text"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">NIMC National Identity No. (NIN)</label>
                <input
                  type="text"
                  value={nationalId}
                  onChange={(e) => setNationalId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-medium text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Navigation Action Buttons */}
          <div className="flex items-center justify-between pt-4">
            <Link
              to={`/vehicles/${vehicle.id}`}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Car Specifications</span>
            </Link>

            <button
              onClick={() => navigate('/checkout')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-sm text-xs flex items-center gap-2 transition-colors"
            >
              <span>Continue to Simulated Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Sticky Summary (5 cols) */}
        <div className="lg:col-span-5 sticky top-24">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <img
                src={vehicle.images?.[0]}
                alt={vehicle.model}
                className="w-16 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
              />
              <div className="min-w-0">
                <div className="text-[10px] font-bold text-blue-600 uppercase">{vehicle.category}</div>
                <div className="text-sm font-bold text-slate-900 truncate">{vehicle.make} {vehicle.model}</div>
                <div className="text-[10px] font-mono text-slate-500">Plate: {vehicle.plate}</div>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Dispatch Hub:</span>
                <span className="font-medium text-slate-900">Lagos Ikeja Main Hub</span>
              </div>
              <div className="flex justify-between">
                <span>Rental Dates:</span>
                <span className="font-medium text-slate-900">Oct 23 - Oct 26, 2026 (72h)</span>
              </div>
              <div className="flex justify-between">
                <span>Rate Calculation:</span>
                <span className="font-medium text-slate-900">1 Weekday + 2 Weekend Days</span>
              </div>
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Promo Discount (FLEETDEMO10):</span>
                <span>-{formatCurrency(quote.promoDiscountMinor)}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-baseline justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 block">Total Due at Checkout</span>
                <span className="text-[10px] text-slate-400">Simulated demonstration charge</span>
              </div>
              <span className="text-xl font-black text-blue-600">
                {formatCurrency(quote.totalMinor)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
