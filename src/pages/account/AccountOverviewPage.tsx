import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '@/lib/formatters';
import {
  Calendar, CheckCircle2, ShieldCheck, MapPin, QrCode,
  ArrowRight, Clock, Award, FileText, ChevronRight
} from 'lucide-react';

export function AccountOverviewPage() {
  return (
    <div className="space-y-8">
      {/* Immediate Next Reservation Hero Card (Exact Mockup Match) */}
      <div className="bg-white rounded-3xl border border-blue-600/60 shadow-md p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Immediate Next Reservation:
            </span>
            <span className="font-mono font-bold text-blue-600 text-sm">#DF-2026-9812</span>
          </div>

          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 self-start sm:self-auto">
            ✓ Confirmed • Fast-Track Ready
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Car Image Preview */}
          <div className="lg:col-span-5 relative rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 h-52">
            <img
              src="https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=800"
              alt="Toyota RAV4"
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-3 left-3 bg-slate-900/80 text-white font-mono px-2 py-0.5 rounded text-xs">
              Plate: LAG-802-AB
            </span>
            <span className="absolute top-3 right-3 bg-blue-600 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded">
              All-Wheel Drive
            </span>
          </div>

          {/* Details & Pickup Times */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  2024 Toyota RAV4 XLE AWD
                </h3>
                <div className="text-xs text-slate-500">
                  5 Seater • Auto Transmission • Compact Executive SUV
                </div>
              </div>

              <div className="text-left sm:text-right">
                <div className="text-[10px] uppercase font-bold text-slate-400">Prepaid Corporate Total</div>
                <div className="text-2xl font-black text-blue-600">NGN 129,600</div>
              </div>
            </div>

            {/* Countdown and Assigned Concierge */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200/60">
                <div className="text-[10px] font-bold text-blue-600 uppercase">Pickup Countdown</div>
                <div className="font-bold text-slate-900 mt-0.5">In 2 Days (48 Hours)</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[10px] font-bold text-slate-500 uppercase">Assigned Concierge</div>
                <div className="font-bold text-slate-900 mt-0.5">Marcus Vance (Desk 4)</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Pickup Logistics</span>
                <span className="font-bold text-slate-900">Fri, Oct 23, 2026 @ 10:00 AM</span>
                <div className="text-[11px] text-slate-500">Lagos Ikeja Main Hub (GRA Branch)</div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Return Schedule</span>
                <span className="font-bold text-slate-900">Mon, Oct 26, 2026 @ 10:00 AM</span>
                <div className="text-[11px] text-slate-500">3-Day Enterprise Duration</div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-2 text-xs">
              <Link
                to="/booking-confirmation/DF-2026-9812"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl shadow-sm transition-colors flex items-center gap-2"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>View Digital Pickup Pass</span>
              </Link>

              <Link
                to="/account/bookings/DF-2026-9812"
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-4 py-2 rounded-xl transition-colors"
              >
                Modify Itinerary
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Row (From Mockup) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-[11px] font-bold uppercase text-slate-400">Active Bookings</div>
          <div className="text-2xl font-black text-slate-900 mt-1">1</div>
          <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">Ready in 2 days</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-[11px] font-bold uppercase text-slate-400">Total Completed</div>
          <div className="text-2xl font-black text-slate-900 mt-1">4</div>
          <span className="text-[10px] text-slate-500 mt-1 block">1,420 km logged</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-[11px] font-bold uppercase text-slate-400">Tier Loyalty</div>
          <div className="text-2xl font-black text-blue-600 mt-1">Gold</div>
          <span className="text-[10px] text-blue-600 font-semibold mt-1 block">10% Active Discount</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-[11px] font-bold uppercase text-slate-400">Incident Record</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">Pristine</div>
          <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">0 Defects Recorded</span>
        </div>
      </div>

      {/* Recent Rental Activity Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Recent Rental Activity</h3>
            <p className="text-xs text-slate-500">Log of enterprise vehicle assignments & receipts</p>
          </div>
          <Link to="/account/bookings" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
            <span>View All Bookings</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px]">
                <th className="pb-2 font-semibold">Booking Ref</th>
                <th className="pb-2 font-semibold">Vehicle Details</th>
                <th className="pb-2 font-semibold">Dates</th>
                <th className="pb-2 font-semibold text-right">Amount (NGN)</th>
                <th className="pb-2 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="py-3 font-mono font-bold text-blue-600">#DF-2026-9812</td>
                <td className="py-3">
                  <div className="font-bold text-slate-900">Toyota RAV4 XLE AWD</div>
                  <div className="text-[10px] text-slate-400 font-mono">LAG-802-AB</div>
                </td>
                <td className="py-3">Oct 23 – 26, 2026</td>
                <td className="py-3 text-right font-mono font-bold">NGN 129,600</td>
                <td className="py-3 text-right">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    Confirmed
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-3 font-mono font-bold text-slate-600">#DF-2026-7814</td>
                <td className="py-3">
                  <div className="font-bold text-slate-900">Toyota Camry XLE</div>
                  <div className="text-[10px] text-slate-400 font-mono">ABJ-411-XY</div>
                </td>
                <td className="py-3">Sep 12 – 15, 2026</td>
                <td className="py-3 text-right font-mono font-bold">NGN 94,500</td>
                <td className="py-3 text-right">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                    Completed
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-3 font-mono font-bold text-slate-600">#DF-2026-6102</td>
                <td className="py-3">
                  <div className="font-bold text-slate-900">Mercedes-Benz C200</div>
                  <div className="text-[10px] text-slate-400 font-mono">APP-109-KS</div>
                </td>
                <td className="py-3">Jul 04 – 06, 2026</td>
                <td className="py-3 text-right font-mono font-bold">NGN 171,000</td>
                <td className="py-3 text-right">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                    Completed
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
