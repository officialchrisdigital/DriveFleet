import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getUserBookings, CustomerBooking } from '@/lib/userBookings';
import { formatCurrency } from '@/lib/formatters';
import {
  Calendar, CheckCircle2, ShieldCheck, MapPin, QrCode,
  ArrowRight, Clock, Award, FileText, ChevronRight, CarFront
} from 'lucide-react';

export function AccountOverviewPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<CustomerBooking[]>([]);

  useEffect(() => {
    if (user?.email) {
      setBookings(getUserBookings(user.email));
    }
  }, [user?.email]);

  const upcomingBooking = bookings.find((b) => b.status === 'confirmed');
  const activeBookingsCount = bookings.filter((b) => b.status === 'confirmed').length;
  const completedBookingsCount = bookings.filter((b) => b.status === 'completed').length;

  return (
    <div className="space-y-8">
      {/* Immediate Next Reservation Hero Card */}
      {upcomingBooking ? (
        <div className="bg-white rounded-3xl border border-blue-600/60 shadow-md p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Immediate Next Reservation:
              </span>
              <span className="font-mono font-bold text-blue-600 text-sm">#{upcomingBooking.id}</span>
            </div>

            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 self-start sm:self-auto">
              ✓ Confirmed • Fast-Track Ready
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Car Image Preview */}
            <div className="lg:col-span-5 relative rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 h-52">
              <img
                src={upcomingBooking.image}
                alt={upcomingBooking.vehicle}
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-3 left-3 bg-slate-900/80 text-white font-mono px-2 py-0.5 rounded text-xs">
                Plate: {upcomingBooking.plate}
              </span>
              <span className="absolute top-3 right-3 bg-blue-600 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded">
                {upcomingBooking.category}
              </span>
            </div>

            {/* Details & Pickup Times */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                    {upcomingBooking.vehicle}
                  </h3>
                  <div className="text-xs text-slate-500">
                    Premium Verified Fleet • {upcomingBooking.hub}
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Total Billed</div>
                  <div className="text-2xl font-black text-blue-600">
                    {formatCurrency(upcomingBooking.amountMinor)}
                  </div>
                </div>
              </div>

              {/* Countdown and Logistics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200/60">
                  <div className="text-[10px] font-bold text-blue-600 uppercase">Reservation Status</div>
                  <div className="font-bold text-slate-900 mt-0.5">Ready for Collection</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Assigned Hub</div>
                  <div className="font-bold text-slate-900 mt-0.5">{upcomingBooking.hub}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Pickup Logistics</span>
                  <span className="font-bold text-slate-900">{upcomingBooking.dates}</span>
                  <div className="text-[11px] text-slate-500">{upcomingBooking.hub}</div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Included Services</span>
                  <span className="font-bold text-slate-900">Standard Insurance & Support</span>
                  <div className="text-[11px] text-slate-500">24/7 Roadside Assistance</div>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-2 text-xs">
                <Link
                  to={`/booking-confirmation/${upcomingBooking.id}`}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl shadow-sm transition-colors flex items-center gap-2"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>View Digital Pickup Pass</span>
                </Link>

                <Link
                  to="/account/bookings"
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-4 py-2 rounded-xl transition-colors"
                >
                  Manage Reservation
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Empty State when user has no active reservation */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 sm:p-10 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-sm">
            <CarFront className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-1.5">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">
              No Active Reservations
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              You don't currently have an upcoming car rental. Browse our available fleet across Lagos Ikeja and Abuja Central terminals to lock in transparent rates.
            </p>
          </div>
          <div className="pt-2">
            <Link
              to="/vehicles"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02]"
            >
              <span>Explore Fleet & Book a Car</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-[11px] font-bold uppercase text-slate-400">Active Bookings</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{activeBookingsCount}</div>
          <span className="text-[10px] text-slate-500 font-medium mt-1 block">
            {activeBookingsCount > 0 ? 'Upcoming rental active' : 'None scheduled'}
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-[11px] font-bold uppercase text-slate-400">Total Completed</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{completedBookingsCount}</div>
          <span className="text-[10px] text-slate-500 mt-1 block">
            {completedBookingsCount > 0 ? `${completedBookingsCount * 360} km logged` : '0 km logged'}
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-[11px] font-bold uppercase text-slate-400">Tier Status</div>
          <div className="text-2xl font-black text-blue-600 mt-1">
            {completedBookingsCount >= 3 ? 'Gold' : completedBookingsCount >= 1 ? 'Silver' : 'Explorer'}
          </div>
          <span className="text-[10px] text-blue-600 font-semibold mt-1 block">
            {completedBookingsCount >= 3 ? '10% Active Discount' : 'Verified Driver'}
          </span>
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
            <p className="text-xs text-slate-500">Log of vehicle assignments and billing vouchers</p>
          </div>
          {bookings.length > 0 && (
            <Link to="/account/bookings" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
              <span>View All Bookings</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {bookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px]">
                  <th className="pb-2 font-semibold">Booking Ref</th>
                  <th className="pb-2 font-semibold">Vehicle Details</th>
                  <th className="pb-2 font-semibold">Dates</th>
                  <th className="pb-2 font-semibold text-right">Amount</th>
                  <th className="pb-2 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {bookings.slice(0, 5).map((item) => (
                  <tr key={item.id}>
                    <td className="py-3 font-mono font-bold text-blue-600">#{item.id}</td>
                    <td className="py-3">
                      <div className="font-bold text-slate-900">{item.vehicle}</div>
                      <div className="text-[10px] text-slate-400 font-mono">Plate: {item.plate}</div>
                    </td>
                    <td className="py-3 text-slate-600">{item.dates}</td>
                    <td className="py-3 text-right font-mono font-bold">
                      {formatCurrency(item.amountMinor)}
                    </td>
                    <td className="py-3 text-right">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.status === 'confirmed'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : item.status === 'completed'
                            ? 'bg-slate-100 text-slate-700'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}
                      >
                        {item.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-slate-500">
            No past rental activity. Once you complete a booking, your trips and invoices will be cataloged here.
          </div>
        )}
      </div>
    </div>
  );
}
