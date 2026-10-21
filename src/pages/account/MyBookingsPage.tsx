import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '@/lib/formatters';
import {
  Search, Calendar, MapPin, QrCode, FileText, CheckCircle2,
  Clock, AlertCircle, ArrowRight, Printer, XCircle
} from 'lucide-react';

export function MyBookingsPage() {
  const [filterTab, setFilterTab] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const bookings = [
    {
      id: 'DF-2026-9812',
      vehicle: '2024 Toyota RAV4 XLE AWD',
      plate: 'LAG-802-AB',
      category: 'suv',
      status: 'confirmed',
      dates: 'Fri, Oct 23 – Mon, Oct 26, 2026 (72h)',
      hub: 'Lagos Ikeja Main Hub',
      amountMinor: 12960000,
      image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=600',
    },
    {
      id: 'DF-2026-7814',
      vehicle: '2024 Toyota Camry XLE',
      plate: 'LAG-482-XY',
      category: 'sedan',
      status: 'completed',
      dates: 'Sep 12 – Sep 15, 2026 (3 Days)',
      hub: 'Lagos Ikeja Main Hub',
      amountMinor: 9450000,
      odometerDelta: '480 km used',
      image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&q=80&w=600',
    },
    {
      id: 'DF-2026-6102',
      vehicle: '2023 Mercedes-Benz C200',
      plate: 'LAG-301-MZ',
      category: 'luxury',
      status: 'completed',
      dates: 'Jul 04 – Jul 06, 2026 (2 Days)',
      hub: 'Lagos Ikeja Main Hub',
      amountMinor: 17100000,
      odometerDelta: '330 km used',
      image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=600',
    },
    {
      id: 'DF-2026-5520',
      vehicle: '2023 Hyundai Tucson AWD',
      plate: 'ABJ-119-KL',
      category: 'suv',
      status: 'cancelled',
      dates: 'May 18 – May 21, 2026',
      hub: 'Abuja Central Terminal',
      amountMinor: 14500000,
      cancelReason: 'Customer requested 72h prior (100% refund processed)',
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=600',
    },
  ];

  const filtered = bookings.filter((b) => {
    if (filterTab === 'upcoming' && b.status !== 'confirmed') return false;
    if (filterTab === 'completed' && b.status !== 'completed') return false;
    if (filterTab === 'cancelled' && b.status !== 'cancelled') return false;
    if (searchQuery && !b.id.toLowerCase().includes(searchQuery.toLowerCase()) && !b.vehicle.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Filter and Search Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex items-center gap-2">
          {[
            { id: 'all', label: 'All Bookings (4)' },
            { id: 'upcoming', label: 'Upcoming (1)' },
            { id: 'completed', label: 'Completed (2)' },
            { id: 'cancelled', label: 'Cancelled (1)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filterTab === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by reference, make, or plate..."
            className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
      </div>

      {/* Bookings List Cards (Exact Mockup Match) */}
      <div className="space-y-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Photo */}
              <img
                src={item.image}
                alt={item.vehicle}
                className="w-full md:w-56 h-36 rounded-xl object-cover border border-slate-200 shrink-0"
              />

              {/* Middle Details */}
              <div className="flex-1 space-y-3 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono font-bold text-sm text-slate-900">{item.id}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      item.status === 'confirmed'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : item.status === 'completed'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}
                  >
                    {item.status}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Plate: {item.plate}</span>
                </div>

                <h3 className="text-lg font-bold text-slate-900">{item.vehicle}</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.dates}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.hub}</span>
                  </div>
                </div>

                {item.odometerDelta && (
                  <div className="text-[11px] text-emerald-700 font-medium bg-emerald-50/60 px-2.5 py-1 rounded-lg border border-emerald-200/60 inline-block">
                    ✓ Returned & Inspected: {item.odometerDelta} • 0 defects recorded
                  </div>
                )}

                {item.cancelReason && (
                  <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-200">
                    ℹ {item.cancelReason}
                  </div>
                )}
              </div>

              {/* Right Financial & Actions */}
              <div className="w-full md:w-48 text-left md:text-right shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100 space-y-3">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Total Billed</div>
                  <div className="text-xl font-black text-slate-900">
                    {formatCurrency(item.amountMinor)}
                  </div>
                  <span className="text-[10px] text-slate-400 block">Simulated demo ledger</span>
                </div>

                <div className="space-y-1.5">
                  {item.status === 'confirmed' ? (
                    <>
                      <Link
                        to="/booking-confirmation/DF-2026-9812"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>Pickup Voucher</span>
                      </Link>
                      <button
                        onClick={() => alert('Modification requested. PRD §15 policy revalidates availability and quote difference.')}
                        className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-1.5 px-3 rounded-lg text-xs"
                      >
                        Modify Dates
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => alert('Download VAT invoice PDF (demo)')}
                      className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-1.5 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Download Receipt</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
