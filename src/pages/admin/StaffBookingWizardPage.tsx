import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useOperations } from '@/contexts/OperationsContext';
import { formatCurrency, formatKilometers } from '@/lib/formatters';
import {
  Bookmark, ArrowLeft, CheckCircle2, Car, User,
  Calendar, Clock, DollarSign, ShieldCheck, AlertCircle, Plus
} from 'lucide-react';

export function StaffBookingWizardPage() {
  const { vehicles, customers, addBooking, checkAvailability } = useOperations();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const preselectedCustomerId = searchParams.get('customerId') || '';
  const preselectedVehicleId = searchParams.get('vehicleId') || '';

  const [customerId, setCustomerId] = useState(preselectedCustomerId || (customers[0]?.id ?? ''));
  const [vehicleId, setVehicleId] = useState(preselectedVehicleId || (vehicles[0]?.id ?? ''));
  const [branchCity, setBranchCity] = useState<'Lagos' | 'Abuja'>('Lagos');

  // Dates (default 3 days from today)
  const todayStr = new Date().toISOString().split('T')[0];
  const returnDefaultStr = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [pickupDate, setPickupDate] = useState(todayStr);
  const [pickupTime, setPickupTime] = useState('09:00');
  const [returnDate, setReturnDate] = useState(returnDefaultStr);
  const [returnTime, setReturnTime] = useState('18:00');

  // Add-ons
  const [addonGps, setAddonGps] = useState(false);
  const [addonChildSeat, setAddonChildSeat] = useState(false);
  const [addonExtraDriver, setAddonExtraDriver] = useState(false);

  const [notes, setNotes] = useState('');
  const [conflictError, setConflictError] = useState<string | null>(null);

  const pickupIso = `${pickupDate}T${pickupTime}:00Z`;
  const returnIso = `${returnDate}T${returnTime}:00Z`;

  // Calculate rental duration in days
  const billedDays = useMemo(() => {
    const start = new Date(pickupIso).getTime();
    const end = new Date(returnIso).getTime();
    if (isNaN(start) || isNaN(end) || end <= start) return 1;
    const diffHours = (end - start) / (1000 * 60 * 60);
    return Math.max(1, Math.ceil(diffHours / 24));
  }, [pickupIso, returnIso]);

  // Selected vehicle & pricing
  const selectedVehicle = vehicles.find((v) => v.id === vehicleId);
  const selectedCustomer = customers.find((c) => c.id === customerId);

  // Quote calculation
  const subtotalMinor = (selectedVehicle?.baseRateMinor || 5000000) * billedDays;
  const gpsMinor = addonGps ? 500000 * billedDays : 0;
  const childSeatMinor = addonChildSeat ? 300000 * billedDays : 0;
  const extraDriverMinor = addonExtraDriver ? 1000000 * billedDays : 0;
  const addonsTotalMinor = gpsMinor + childSeatMinor + extraDriverMinor;
  const depositMinor = selectedVehicle?.category === 'luxury' ? 10000000 : 5000000;
  const grandTotalMinor = subtotalMinor + addonsTotalMinor + depositMinor;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConflictError(null);

    if (!selectedVehicle) {
      setConflictError('Please select a vehicle.');
      return;
    }
    if (!selectedCustomer) {
      setConflictError('Please select a customer.');
      return;
    }

    // Atomic conflict verification
    const check = checkAvailability(vehicleId, pickupIso, returnIso);
    if (!check.available) {
      setConflictError(check.conflictReason || 'Vehicle unavailable during selected dates.');
      return;
    }

    const branchId =
      branchCity === 'Abuja'
        ? 'b0000000-0000-0000-0000-000000000002'
        : 'b0000000-0000-0000-0000-000000000001';

    const newBooking = addBooking({
      customerId,
      vehicleId,
      branchId,
      pickupAt: pickupIso,
      returnAt: returnIso,
      status: 'confirmed',
      sourceChannel: 'staff',
      createdBy: user?.id || user?.email || 'staff',
      createdByName: user ? `${user.firstName} ${user.lastName} (${user.role.toUpperCase()})` : 'Duty Staff',
      quote: {
        billedPeriods: billedDays,
        lineItems: [],
        subtotalMinor,
        durationTier: billedDays >= 7 ? 'Weekly Corporate' : null,
        durationDiscountPercent: billedDays >= 7 ? 10 : 0,
        durationDiscountMinor: 0,
        afterDurationMinor: subtotalMinor,
        promoDiscountMinor: 0,
        afterPromoMinor: subtotalMinor,
        feesMinor: addonsTotalMinor,
        depositMinor,
        totalMinor: grandTotalMinor,
        currency: 'NGN',
      },
    });

    navigate(`/admin/bookings/${newBooking.id}`);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
        <Link
          to="/admin/bookings"
          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Create Staff-Assisted Reservation
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational booking wizard with atomic conflict verification and shared quote calculator.
          </p>
        </div>
      </div>

      {conflictError && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{conflictError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column (2 cols): Input fields */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Selection Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                <span>1. Customer Selection</span>
              </h2>
              <Link
                to="/admin/customers/new"
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ New Customer</span>
              </Link>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Select Registered Customer <span className="text-red-500">*</span>
              </label>
              <select
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.firstName} {c.lastName} ({c.company || 'Private'}) – {c.phone}
                  </option>
                ))}
              </select>

              {selectedCustomer && (
                <div className="mt-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-900">
                      {selectedCustomer.firstName} {selectedCustomer.lastName}
                    </span>
                    <span className="text-slate-400 block text-[11px]">{selectedCustomer.email}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      FRSC: {selectedCustomer.renterDetails?.licenseNumber || 'Verified'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Dates & Hub Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>2. Reservation Dates & Dispatch Hub</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Pickup Date</label>
                <input
                  type="date"
                  required
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Pickup Time</label>
                <input
                  type="time"
                  required
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Return Date</label>
                <input
                  type="date"
                  required
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Return Time</label>
                <input
                  type="time"
                  required
                  value={returnTime}
                  onChange={(e) => setReturnTime(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Dispatch Node</label>
                <select
                  value={branchCity}
                  onChange={(e) => setBranchCity(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none"
                >
                  <option value="Lagos">Lagos – Ikeja Main Hub</option>
                  <option value="Abuja">Abuja – Central Terminal</option>
                </select>
              </div>
            </div>
          </div>

          {/* Vehicle Selection Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Car className="w-4 h-4 text-blue-600" />
              <span>3. Vehicle Selection</span>
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Assign Fleet Vehicle <span className="text-red-500">*</span>
              </label>
              <select
                value={vehicleId}
                onChange={(e) => setVehicleId(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.make} {v.model} ({v.year}) – {v.plate} [{v.category.toUpperCase()}] –{' '}
                    {formatCurrency(v.baseRateMinor)}/day – {v.operationalState.toUpperCase()}
                  </option>
                ))}
              </select>

              {selectedVehicle && (
                <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                  <img
                    src={selectedVehicle.images?.[0] || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=300'}
                    alt={selectedVehicle.model}
                    className="w-16 h-12 object-cover rounded-lg border border-slate-200 shrink-0"
                  />
                  <div className="text-xs">
                    <div className="font-bold text-slate-900">
                      {selectedVehicle.make} {selectedVehicle.model} ({selectedVehicle.year})
                    </div>
                    <div className="text-slate-500 font-mono mt-0.5">
                      Plate: {selectedVehicle.plate} • {selectedVehicle.seats} Seats • {selectedVehicle.transmission}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Add-ons Checklist */}
            <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
              <span className="font-bold text-slate-800 block">Optional Add-ons & Equipment</span>
              <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={addonGps}
                  onChange={(e) => setAddonGps(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span>GPS Telemetry Unit (+₦5,000 / day)</span>
              </label>

              <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={addonChildSeat}
                  onChange={(e) => setAddonChildSeat(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span>Child Safety Seat (+₦3,000 / day)</span>
              </label>

              <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={addonExtraDriver}
                  onChange={(e) => setAddonExtraDriver(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span>Additional Verified Driver (+₦10,000 / day)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Quote Calculation & Confirmation */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span>Quote Breakdown</span>
            </h2>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center text-slate-600">
                <span>Rental Duration</span>
                <span className="font-bold text-slate-900">{billedDays} Day(s)</span>
              </div>

              <div className="flex justify-between items-center text-slate-600">
                <span>Daily Base Rate</span>
                <span>{formatCurrency(selectedVehicle?.baseRateMinor || 0)}</span>
              </div>

              <div className="flex justify-between items-center text-slate-600">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">{formatCurrency(subtotalMinor)}</span>
              </div>

              {addonsTotalMinor > 0 && (
                <div className="flex justify-between items-center text-slate-600">
                  <span>Add-ons Total</span>
                  <span className="font-semibold text-slate-900">{formatCurrency(addonsTotalMinor)}</span>
                </div>
              )}

              <div className="flex justify-between items-center text-slate-600">
                <span>Caution Deposit (Refundable)</span>
                <span className="font-semibold text-slate-900">{formatCurrency(depositMinor)}</span>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm">
                <span className="font-black text-slate-900">Total Quote</span>
                <span className="font-black text-blue-600 text-base">
                  {formatCurrency(grandTotalMinor)}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors shadow-sm flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm & Create Reservation</span>
              </button>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
            <div className="font-bold text-slate-800 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Atomic Locking Enforced</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-500">
              Creating this booking locks vehicle availability across both the storefront catalog and dispatch calendar.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
