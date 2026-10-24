import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useOperations } from '@/contexts/OperationsContext';
import { addUserBooking, CustomerBooking } from '@/lib/userBookings';
import { DEMO_VEHICLES } from '@/lib/demo-data';
import { calculateQuote } from '@/lib/pricing-engine';
import { formatCurrency } from '@/lib/formatters';
import { Check, ShieldCheck, Lock, CreditCard, AlertCircle, RefreshCw, ArrowRight } from 'lucide-react';

export function CheckoutSimulatorPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addBooking, customers } = useOperations();

  const draftBookingStr = typeof window !== 'undefined' ? localStorage.getItem('drivefleet_draft_booking') : null;
  let draftData: any = null;
  if (draftBookingStr) {
    try {
      draftData = JSON.parse(draftBookingStr);
    } catch {}
  }

  const vehicle = DEMO_VEHICLES.find((v) => v.id === draftData?.vehicleId) || DEMO_VEHICLES[0];
  const pickupAt = draftData?.pickupAt || '2026-10-23T10:00:00Z';
  const returnAt = draftData?.returnAt || '2026-10-26T10:00:00Z';
  const hub = draftData?.hub || 'Lagos Ikeja Main Hub';

  // Mandatory Declarations Checkboxes
  const [agreeCancellation, setAgreeCancellation] = useState(true);
  const [agreeFuel, setAgreeFuel] = useState(true);
  const [agreeMileage, setAgreeMileage] = useState(true);
  const [agreeMasterSla, setAgreeMasterSla] = useState(true);

  // Simulation Outcome Radio
  const [simulationOutcome, setSimulationOutcome] = useState<'approved' | 'conflict' | 'failed'>('approved');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const quote = draftData?.quote || calculateQuote({
    vehicleId: vehicle.id,
    category: vehicle.category,
    baseRateMinor: vehicle.baseRateMinor,
    pickupAt,
    returnAt,
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

  const handleConfirmReservation = () => {
    setIsSubmitting(true);
    setErrorMessage(null);

    setTimeout(() => {
      setIsSubmitting(false);
      if (simulationOutcome === 'approved') {
        const bookingRef = 'DF-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
        const targetEmail = user?.email || draftData?.email || 'chukwudi@drivefleet.demo';

        const newBooking: CustomerBooking = {
          id: bookingRef,
          vehicle: `${vehicle.make} ${vehicle.model} (${vehicle.year})`,
          plate: vehicle.plate,
          category: vehicle.category,
          status: 'confirmed',
          dates: `${quote.billedPeriods} Days (${pickupAt.split('T')[0]} → ${returnAt.split('T')[0]})`,
          pickupAt,
          returnAt,
          hub,
          amountMinor: quote.totalMinor,
          image: vehicle.images?.[0] || 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=600',
        };
        addUserBooking(targetEmail, newBooking);

        // Record directly into Operations Context so Admin and Staff see it immediately
        const matchingCust = customers.find(
          (c) => c.email?.toLowerCase() === targetEmail.toLowerCase() || c.id === user?.id
        );
        const customerId =
          matchingCust?.id ||
          user?.id ||
          (targetEmail.includes('chukwudi') ? 'c-adeyemi' : `crm-${Date.now()}`);

        addBooking({
          id: `b-${bookingRef.toLowerCase()}`,
          reference: bookingRef,
          customerId,
          vehicleId: vehicle.id,
          branchId: vehicle.branchId,
          pickupAt,
          returnAt,
          status: 'confirmed',
          sourceChannel: 'customer',
          quote: {
            billedPeriods: quote.billedPeriods || 1,
            lineItems: quote.lineItems || [],
            subtotalMinor: quote.subtotalMinor || quote.totalMinor,
            durationTier: quote.durationTier || null,
            durationDiscountPercent: quote.durationDiscountPercent || 0,
            durationDiscountMinor: quote.durationDiscountMinor || 0,
            afterDurationMinor: quote.afterDurationMinor || quote.totalMinor,
            promoDiscountMinor: quote.promoDiscountMinor || 0,
            afterPromoMinor: quote.afterPromoMinor || quote.totalMinor,
            feesMinor: quote.feesMinor || 0,
            depositMinor: quote.depositMinor || 5000000,
            totalMinor: quote.totalMinor,
            currency: 'NGN',
          },
        });

        navigate(`/booking-confirmation/${bookingRef}`);
      } else if (simulationOutcome === 'conflict') {
        setErrorMessage(
          'AVAILABILITY_CONFLICT: Another reservation (or planned maintenance block) was committed for this vehicle interval concurrently. Your draft inputs have been safely preserved.'
        );
      } else {
        setErrorMessage(
          'SIMULATED_GATEWAY_DECLINE: The simulated corporate credit ledger declined authorization. No booking was created, and promo usage remains unconsumed.'
        );
      }
    }, 800);
  };

  const allAgreed = agreeCancellation && agreeFuel && agreeMileage && agreeMasterSla;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Demo Sandbox Banner (Exact Mockup Match) */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
            DS
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900">Demo Sandbox Environment</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                Zero Real Card Charges
              </span>
            </div>
            <p className="text-[11px] text-slate-600 mt-0.5">
              Secure reservation dispatch verifying deterministic pricing locks, strict idempotency enforcement, and race condition resiliency.
            </p>
          </div>
        </div>

        <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1.5 shrink-0 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
          <Lock className="w-3 h-3 text-emerald-600" />
          <span>SECURE-CHANNEL-v4.2</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form Column (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Vehicle & Dispatch Allocation */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Vehicle & Dispatch Allocation</h3>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Inventory Unit Assigned
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <img
                src={vehicle.images?.[0]}
                alt={vehicle.model}
                className="w-full sm:w-44 h-28 object-cover rounded-xl border border-slate-200 shrink-0"
              />
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-blue-600 uppercase bg-blue-50 px-2 py-0.5 rounded">
                    Compact SUV (Tier 1)
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                    Plate: {vehicle.plate}
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-900">{vehicle.make} {vehicle.model} ({vehicle.year})</h4>
                <div className="text-xs text-slate-500">
                  {vehicle.seats} Adult Seats • {vehicle.transmission} • {vehicle.category.toUpperCase()} Class
                </div>
                <div className="text-xs text-blue-700 font-medium pt-1">
                  📍 {hub} → Same Depot Return
                </div>
              </div>
            </div>
          </div>

          {/* Mandatory Rental Declarations */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Mandatory Rental Declarations</h3>
              <span className="text-[11px] text-slate-500">4 of 4 Required</span>
            </div>

            <div className="space-y-3 text-xs">
              <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeCancellation}
                  onChange={(e) => setAgreeCancellation(e.target.checked)}
                  className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    <span>Cancellation Policy (Up to 24h prior)</span>
                    <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                      Zero Penalty
                    </span>
                  </div>
                  <p className="text-slate-500 mt-0.5 text-[11px]">
                    I understand that fee-free cancellations or itinerary revisions are guaranteed until <strong>Thursday, Oct 22, 2026 @ 10:00 AM</strong>.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeFuel}
                  onChange={(e) => setAgreeFuel(e.target.checked)}
                  className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <div className="font-bold text-slate-900">Strict Full-to-Full Fuel Dispatch Commitment</div>
                  <p className="text-slate-500 mt-0.5 text-[11px]">
                    Vehicle releases from Ikeja hub with a 100% full tank (8/8). Deficits incur depot refueling at branch pump rate + NGN 4,500 service fee.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeMileage}
                  onChange={(e) => setAgreeMileage(e.target.checked)}
                  className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <div className="font-bold text-slate-900">
                    Daily 200 km Odometer Allowance Policy (600 km Total Included)
                  </div>
                  <p className="text-slate-500 mt-0.5 text-[11px]">
                    Aggregated telemetry allowance of 600 km over 3 days. Unused kilometers expire; excess is debited at NGN 150/km.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeMasterSla}
                  onChange={(e) => setAgreeMasterSla(e.target.checked)}
                  className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <div className="font-bold text-slate-900">DriveFleet Master Operations & Telematics Agreement</div>
                  <p className="text-slate-500 mt-0.5 text-[11px]">
                    I accept DriveFleet Enterprise Terms of Service, liability limitation frameworks, and authorization for security deposit pre-authorization hold.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Payment Simulator & Concurrency Tester (Exact Mockup Match) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-blue-600" />
                <span>Payment Simulator & Idempotency Engine</span>
              </h3>
              <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                IDEM-KEY: df_checkout_9812_4f8a9e2c
              </span>
            </div>

            {/* Simulated Card Display */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-5 rounded-2xl shadow-md space-y-4">
              <div className="flex justify-between items-center text-xs text-slate-400">
                <span>Simulated Enterprise Platinum Card</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                  Pre-Funded Test Asset
                </span>
              </div>
              <div className="font-mono text-lg tracking-widest text-slate-200">
                •••• •••• •••• 4242
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <div>
                  <div className="text-[9px] uppercase">Cardholder</div>
                  <div className="text-white font-medium">Chukwudi Adeyemi</div>
                </div>
                <div>
                  <div className="text-[9px] uppercase">Expires</div>
                  <div className="text-white font-medium">12/28</div>
                </div>
              </div>
            </div>

            {/* Interactive Test Scenario Selection */}
            <div className="space-y-2 pt-2">
              <div className="text-xs font-bold text-slate-900">
                Select Simulation Outcome for this Dispatch:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <label
                  className={`p-3 rounded-xl border cursor-pointer transition-colors ${
                    simulationOutcome === 'approved'
                      ? 'border-blue-600 bg-blue-50/50 text-blue-900'
                      : 'border-slate-200 bg-white text-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="scenario"
                    checked={simulationOutcome === 'approved'}
                    onChange={() => setSimulationOutcome('approved')}
                    className="mr-2 text-blue-600"
                  />
                  <strong className="block text-xs">1. Approved Booking</strong>
                  <span className="text-[10px] text-slate-500">Immediate atomic lock and digital voucher</span>
                </label>

                <label
                  className={`p-3 rounded-xl border cursor-pointer transition-colors ${
                    simulationOutcome === 'conflict'
                      ? 'border-amber-600 bg-amber-50/50 text-amber-900'
                      : 'border-slate-200 bg-white text-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="scenario"
                    checked={simulationOutcome === 'conflict'}
                    onChange={() => setSimulationOutcome('conflict')}
                    className="mr-2 text-amber-600"
                  />
                  <strong className="block text-xs">2. Race Overlap Conflict</strong>
                  <span className="text-[10px] text-slate-500">Simulate concurrent booking collision</span>
                </label>

                <label
                  className={`p-3 rounded-xl border cursor-pointer transition-colors ${
                    simulationOutcome === 'failed'
                      ? 'border-red-600 bg-red-50/50 text-red-900'
                      : 'border-slate-200 bg-white text-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="scenario"
                    checked={simulationOutcome === 'failed'}
                    onChange={() => setSimulationOutcome('failed')}
                    className="mr-2 text-red-600"
                  />
                  <strong className="block text-xs">3. Authorization Failure</strong>
                  <span className="text-[10px] text-slate-500">Trigger safe decline without booking creation</span>
                </label>
              </div>
            </div>

            {/* Error Banner if scenario failed */}
            {errorMessage && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">Reservation Not Confirmed</div>
                  <div>{errorMessage}</div>
                </div>
              </div>
            )}

            {/* Primary Submit Button */}
            <button
              onClick={handleConfirmReservation}
              disabled={!allAgreed || isSubmitting}
              className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2 ${
                allAgreed && !isSubmitting
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Securing Master Database Lock...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Confirm Demo Reservation (Atomic Lock)</span>
                </>
              )}
            </button>
            <div className="text-center text-[10px] text-slate-400">
              256-Bit Idempotent Enclave • Audit Logged to Operations Ledger • Zero Actual Card Charges
            </div>
          </div>
        </div>

        {/* Right Sticky Summary (5 cols) */}
        <div className="lg:col-span-5 sticky top-24 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Rate Lock Active (14:28 Remaining)
              </span>
              <span className="text-[11px] text-slate-400 font-mono">Transparent Quote</span>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>1 × Weekday Base (Fri):</span>
                <span className="font-mono text-slate-900 font-medium">NGN 45,000</span>
              </div>
              <div className="flex justify-between">
                <span>2 × Weekend Days (+10% Sat/Sun):</span>
                <span className="font-mono text-slate-900 font-medium">NGN 99,000</span>
              </div>
              <div className="pt-2 border-t border-slate-100 flex justify-between font-semibold text-slate-800">
                <span>Standard Subtotal:</span>
                <span className="font-mono">NGN 144,000</span>
              </div>
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Promo Code (FLEETDEMO10 -10%):</span>
                <span className="font-mono">-NGN 14,400</span>
              </div>
              <div className="flex justify-between text-slate-500 pt-1">
                <span>Refundable Deposit (Hold):</span>
                <span className="font-mono text-slate-700">NGN 50,000</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-sm font-bold text-slate-900 block">Net Rental Total</span>
                  <span className="text-[10px] text-slate-400">Excludes refundable security hold</span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-blue-600">
                    {formatCurrency(quote.totalMinor)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-[11px] text-slate-600 space-y-1">
              <div className="text-emerald-700 font-semibold">✓ Zero hidden airport surcharges or pickup fees</div>
              <div className="text-emerald-700 font-semibold">✓ Instant QR pickup voucher with PIN release</div>
              <div>⚡ ISO-27001 Certified Fleet Telematics Architecture</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
