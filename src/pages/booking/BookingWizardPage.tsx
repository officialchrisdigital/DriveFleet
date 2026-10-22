import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { DEMO_VEHICLES } from '@/lib/demo-data';
import { calculateQuote } from '@/lib/pricing-engine';
import { formatCurrency } from '@/lib/formatters';
import { useAuth, DEFAULT_CREDENTIALS } from '@/contexts/AuthContext';
import { getSavedSearchCriteria } from '@/lib/userBookings';
import {
  Check,
  ShieldCheck,
  Calendar,
  MapPin,
  User,
  ArrowRight,
  ArrowLeft,
  LogIn,
  UserPlus,
  AlertCircle,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export function BookingWizardPage() {
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, login, register } = useAuth();

  const vehicle = DEMO_VEHICLES.find((v) => v.id === vehicleId) || DEMO_VEHICLES[0];
  const criteria = getSavedSearchCriteria();

  const hub = searchParams.get('hub') || criteria.hub || 'Lagos Ikeja Main Hub';
  const pickupDate = searchParams.get('pickupDate') || criteria.pickupDate;
  const pickupTime = searchParams.get('pickupTime') || criteria.pickupTime || '10:00';
  const returnDate = searchParams.get('returnDate') || criteria.returnDate;
  const returnTime = searchParams.get('returnTime') || criteria.returnTime || '10:00';

  const pickupAt = `${pickupDate}T${pickupTime}:00Z`;
  const returnAt = `${returnDate}T${returnTime}:00Z`;

  // Auth mode for guest users: 'register' | 'login'
  const [authMode, setAuthMode] = useState<'register' | 'login'>('register');

  // Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('FRSC-LAG-8492018B');
  const [nationalId, setNationalId] = useState('NIMC-9402');

  const [authError, setAuthError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Sync state if user is already authenticated
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
    } else {
      // Default placeholder values for smooth demo experience
      setFirstName('Chukwudi');
      setLastName('Adeyemi');
      setEmail('chukwudi@drivefleet.demo');
      setPhone('+234 803 555 0192');
      setPassword('Customer@DriveFleet2026!');
    }
  }, [user]);

  const quote = calculateQuote({
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

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    // If not authenticated, authenticate in-line
    if (!isAuthenticated) {
      setSubmitting(true);
      try {
        if (authMode === 'login') {
          const res = await login(email, password, 'customer');
          if (!res.success) {
            setAuthError(res.error || 'Failed to sign in. Please verify your credentials.');
            setSubmitting(false);
            return;
          }
        } else {
          // Register
          if (!password || password.length < 6) {
            setAuthError('Please enter a password with at least 6 characters.');
            setSubmitting(false);
            return;
          }
          const res = await register({
            firstName,
            lastName,
            email,
            phone,
            password,
            renterDetails: {
              licenseNumber,
              nationalId,
            },
          });
          if (!res.success) {
            setAuthError(res.error || 'Failed to register account.');
            setSubmitting(false);
            return;
          }
        }
      } catch {
        setAuthError('An error occurred during verification.');
        setSubmitting(false);
        return;
      }
      setSubmitting(false);
    }

    // Save draft renter details for checkout
    localStorage.setItem(
      'drivefleet_draft_booking',
      JSON.stringify({
        vehicleId: vehicle.id,
        firstName,
        lastName,
        email,
        phone,
        licenseNumber,
        nationalId,
        hub,
        pickupAt,
        returnAt,
        pickupDate,
        pickupTime,
        returnDate,
        returnTime,
        quote,
      })
    );

    navigate('/checkout');
  };

  const handleFillDemoCustomer = () => {
    setEmail(DEFAULT_CREDENTIALS.customer.email);
    setPassword(DEFAULT_CREDENTIALS.customer.password);
    setAuthMode('login');
    setAuthError(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Stepper Header */}
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
            <div className="text-xs font-bold text-slate-900">Driver Credentials & Auth</div>
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
          {/* Account status / In-line registration banner */}
          {isAuthenticated ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between text-xs text-emerald-900 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                  {user?.firstName?.[0] || 'C'}
                </div>
                <div>
                  <div className="font-bold text-emerald-950">
                    Signed in as {user?.firstName} {user?.lastName}
                  </div>
                  <div className="text-emerald-700 text-[11px] font-mono">{user?.email}</div>
                </div>
              </div>
              <span className="bg-emerald-600 text-white font-semibold text-[10px] uppercase px-2.5 py-1 rounded-full">
                Verified Customer
              </span>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-bold text-slate-900">Customer Identity & Account</span>
                </div>
                <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('register');
                      setAuthError(null);
                    }}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      authMode === 'register'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    New Customer (Register)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('login');
                      setAuthError(null);
                    }}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      authMode === 'login'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Existing Sign In
                  </button>
                </div>
              </div>

              {/* Sample credentials hint */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-800 flex items-center justify-between gap-3">
                <div className="text-[11px]">
                  <strong>Tip:</strong> You can create a new customer account instantly or use the sample credentials.
                </div>
                <button
                  type="button"
                  onClick={handleFillDemoCustomer}
                  className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[11px] px-2.5 py-1 rounded-lg transition-colors"
                >
                  Use Sample
                </button>
              </div>

              {authError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{authError}</span>
                </div>
              )}
            </div>
          )}

          {/* Driver Information Card */}
          <form onSubmit={handleContinue} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                <span>Primary Driver Credentials Dossier</span>
              </h3>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                FRSC Validated
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Legal First Name *</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Legal Last Name *</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number (WhatsApp Dispatch) *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                />
              </div>

              {!isAuthenticated && (
                <div className="sm:col-span-2 bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-blue-600" />
                    <span>{authMode === 'login' ? 'Account Password *' : 'Create Account Password *'}</span>
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={authMode === 'login' ? 'Enter your password' : 'Create a secure password (min 6 characters)'}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <p className="text-[10px] text-slate-500">
                    {authMode === 'login'
                      ? 'Signing in links this reservation directly to your customer account portal.'
                      : 'An authenticated account will be created so you can manage your reservation and view rental history.'}
                  </p>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">FRSC Driver's License No. *</label>
                <input
                  type="text"
                  required
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">NIMC National Identity No. (NIN)</label>
                <input
                  type="text"
                  value={nationalId}
                  onChange={(e) => setNationalId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Navigation Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <Link
                to={`/vehicles/${vehicle.id}`}
                className="text-slate-600 hover:text-slate-900 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Vehicle Details</span>
              </Link>

              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-sm text-xs flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                <span>{submitting ? 'Authenticating...' : 'Continue to Simulated Checkout'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
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
                <div className="text-sm font-bold text-slate-900 truncate">
                  {vehicle.make} {vehicle.model}
                </div>
                <div className="text-[10px] font-mono text-slate-500">Plate: {vehicle.plate}</div>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Dispatch Hub:</span>
                <span className="font-medium text-slate-900">{hub}</span>
              </div>
              <div className="flex justify-between">
                <span>Rental Dates:</span>
                <span className="font-medium text-slate-900">{pickupDate} → {returnDate}</span>
              </div>
              <div className="flex justify-between">
                <span>Duration Interval:</span>
                <span className="font-medium text-slate-900">{quote.billedPeriods} Day{quote.billedPeriods > 1 ? 's' : ''} Cycle</span>
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
