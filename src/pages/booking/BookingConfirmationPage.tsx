import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { DEMO_VEHICLES } from '@/lib/demo-data';
import { formatCurrency } from '@/lib/formatters';
import {
  CheckCircle2, Download, Printer, Share2, MapPin, QrCode,
  Calendar, ShieldCheck, UserCheck, ArrowRight, Lock
} from 'lucide-react';

export function BookingConfirmationPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const vehicle = DEMO_VEHICLES[0]; // Toyota RAV4

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Success Notification Banner (Exact Mockup Match) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Confirmed • Fast-Track Ready
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Reservation Successfully Confirmed & Locked!
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
              A deterministic booking lock has been secured in the master fleet database. Your vehicle is quarantined from conflicting reservations across all dispatch nodes.
            </p>
          </div>
        </div>

        {/* Master Voucher Reference Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-center sm:text-right shrink-0">
          <div className="text-[10px] uppercase font-bold text-blue-600 tracking-wider">Master Voucher ID</div>
          <div className="text-2xl font-black font-mono text-slate-900 mt-0.5 tracking-tight">
            #DF-2026-9812
          </div>
          <div className="text-[10px] text-slate-500 mt-1 flex items-center justify-center sm:justify-end gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            <span>Zero-Collision Guarantee (PRD FR-06)</span>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="bg-white hover:bg-slate-50 border border-slate-300 font-semibold px-4 py-2 rounded-xl flex items-center gap-2 text-slate-700 shadow-sm transition-colors"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Print Summary</span>
          </button>
          <button
            onClick={() => alert('Demo PDF voucher downloaded (DF-2026-9812.pdf)')}
            className="bg-white hover:bg-slate-50 border border-slate-300 font-semibold px-4 py-2 rounded-xl flex items-center gap-2 text-slate-700 shadow-sm transition-colors"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Download Voucher PDF</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/account/bookings"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2 rounded-xl shadow-sm transition-colors flex items-center gap-2"
          >
            <span>View in My Bookings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (7 cols): Digital Station Pickup Pass */}
        <div className="lg:col-span-7 space-y-6">
          {/* Digital Station Pickup Pass Card (Exact Mockup Match) */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-xs">
                <QrCode className="w-4 h-4 text-blue-400" />
                <span>Digital Station Pickup Pass</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
                Fast-Track Lane Bay 2
              </span>
            </div>

            <div className="p-6 space-y-6">
              {/* Pickup Countdown Notice */}
              <div className="bg-blue-50/80 p-4 rounded-2xl border border-blue-200/80 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold uppercase text-blue-600">Time to Station Arrival</div>
                  <div className="text-base font-black text-slate-900 mt-0.5">
                    Pickup in 2 Days • Friday, Oct 23, 2026 @ 10:00 AM
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-blue-700 bg-white px-2.5 py-1 rounded-lg border border-blue-200">
                  Vehicle in Prep-Staging
                </span>
              </div>

              {/* QR and Location Details */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                <div className="sm:col-span-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center space-y-2">
                  <div className="w-28 h-28 mx-auto bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex items-center justify-center font-mono text-[9px] text-slate-400">
                    [QR CODE: DF-AUTH-9812]
                  </div>
                  <div className="text-[10px] font-mono text-slate-500">
                    Present at Station Desk Bay 2<br />
                    <span className="font-bold text-slate-800">DF-AUTH-9812-SYNC</span>
                  </div>
                </div>

                <div className="sm:col-span-8 space-y-3 text-xs">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Designated Pickup Hub</div>
                    <div className="font-bold text-slate-900 text-sm">Lagos Ikeja Main Hub (GRA)</div>
                    <div className="text-slate-500 text-[11px]">45 Isaac John Street, GRA Ikeja, Lagos</div>
                  </div>

                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Return Station Schedule</div>
                    <div className="font-bold text-slate-900">Monday, Oct 26, 2026 @ 10:00 AM</div>
                    <div className="text-slate-500 text-[11px]">Grace period: 30 mins included</div>
                  </div>

                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Station Direct Phone</div>
                    <div className="font-bold text-blue-600">+234 1 290 8400 (Operating 24/7)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Counter Handover Checklist */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-blue-600" />
              <span>Customer Counter Handover Checklist</span>
            </h3>
            <p className="text-xs text-slate-500">
              Please present the following mandatory credentials to the station agent at Bay 2 to collect your keys in under 3 minutes:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="font-bold text-slate-900 mb-1">1. Original Driver's License</div>
                <p className="text-slate-500 text-[11px]">
                  Must match renter: <strong>Chukwudi Adeyemi</strong>.
                </p>
                <span className="text-[10px] font-bold text-emerald-600 mt-2 block">✓ Verified Online</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="font-bold text-slate-900 mb-1">2. National ID / Passport</div>
                <p className="text-slate-500 text-[11px]">
                  NIMC Slip or Valid International Passport.
                </p>
                <span className="text-[10px] text-slate-500 mt-2 block">Present at Desk</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="font-bold text-slate-900 mb-1">3. QR Code & Voucher</div>
                <p className="text-slate-500 text-[11px]">
                  Voucher #DF-2026-9812 on phone or printout.
                </p>
                <span className="text-[10px] font-bold text-blue-600 mt-2 block">✓ Active in Wallet</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sticky Column (5 cols): Immutable Price Ledger Snapshot */}
        <div className="lg:col-span-5 sticky top-24 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  Financial Snapshot
                </span>
                <span className="text-sm font-black text-slate-900">Immutable Price Ledger</span>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                PRD §9.3
              </span>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>1 × Weekday Base (Fri Oct 23):</span>
                <span className="font-mono text-slate-900 font-medium">NGN 45,000</span>
              </div>
              <div className="flex justify-between">
                <span>2 × Weekend Period (Sat & Sun @ +10%):</span>
                <span className="font-mono text-slate-900 font-medium">NGN 99,000</span>
              </div>
              <div className="pt-2 border-t border-slate-100 flex justify-between font-semibold text-slate-800">
                <span>Subtotal (3 Days):</span>
                <span className="font-mono">NGN 144,000</span>
              </div>
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Promo Code (FLEETDEMO10):</span>
                <span className="font-mono">-NGN 14,400</span>
              </div>
              <div className="flex justify-between text-slate-500 pt-1">
                <span>Refundable Deposit (Hold):</span>
                <span className="font-mono text-slate-700">NGN 50,000</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200">
              <div className="flex items-baseline justify-between mb-1">
                <div>
                  <span className="text-sm font-bold text-slate-900 block">Net Rental Total</span>
                  <span className="text-[10px] text-slate-400">All taxes & VAT included</span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-blue-600">
                    NGN 129,600
                  </span>
                </div>
              </div>
            </div>

            {/* Audit & Settlement Hash */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-[10px] font-mono text-slate-500 space-y-1">
              <div className="flex justify-between">
                <span>Payment Gateway:</span>
                <span className="font-bold text-slate-700">Simulated Demo Sandbox</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Instrument:</span>
                <span>Visa •••• 4242</span>
              </div>
              <div className="flex justify-between">
                <span>Authorization Hash:</span>
                <span className="text-blue-600">AUTH_SIM_981249A</span>
              </div>
            </div>

            <Link
              to="/vehicles"
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors block text-center"
            >
              Browse More Fleet Vehicles
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
