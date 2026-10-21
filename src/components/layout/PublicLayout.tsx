import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/lib/types';
import { MapPin, Bell } from 'lucide-react';

export function PublicLayout() {
  const { user, role, switchRole } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Top Demo Banner */}
      <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-xs text-amber-900 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold px-2 py-0.5 rounded bg-amber-200 text-amber-800 uppercase tracking-wider text-[10px]">
            Demo Environment
          </span>
          <span>DriveFleet Capstone Demo Release • Simulated transactions with zero real card capture.</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-600">Active Role:</span>
          <select
            value={role}
            onChange={(e) => switchRole(e.target.value as UserRole)}
            className="bg-white border border-slate-300 rounded px-2 py-0.5 text-xs font-medium text-slate-800 shadow-sm"
          >
            <option value="customer">Customer (Chukwudi)</option>
            <option value="staff">Staff (Amara)</option>
            <option value="admin">Admin (Marcus)</option>
          </select>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                D
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Drive<span className="text-blue-600">Fleet</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-1.5 text-xs text-slate-600 border border-slate-200">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span>Lagos Ikeja Main Branch</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link to="/vehicles" className="hover:text-blue-600 transition-colors">
              Fleet & Booking
            </Link>
            <Link to="/how-it-works" className="hover:text-blue-600 transition-colors">
              How It Works
            </Link>
            <Link to="/about" className="hover:text-blue-600 transition-colors">
              About
            </Link>
            <Link to="/contact" className="hover:text-blue-600 transition-colors">
              Contact & Branches
            </Link>
            <Link to="/faq" className="hover:text-blue-600 transition-colors">
              FAQ
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {role === 'customer' ? (
              <>
                <Link
                  to="/account"
                  className="text-sm font-medium text-slate-700 hover:text-blue-600 hidden sm:block"
                >
                  My Account
                </Link>
                <Link
                  to="/vehicles"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm"
                >
                  Book a Car
                </Link>
              </>
            ) : (
              <Link
                to="/admin"
                className="bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm flex items-center gap-2"
              >
                <span>Ops Deck</span>
                <span className="text-xs bg-blue-500/30 text-blue-300 px-1.5 py-0.5 rounded uppercase">
                  {role}
                </span>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Content Area */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-sm border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-lg mb-3">
              <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center text-xs">
                D
              </div>
              DriveFleet
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Enterprise car rental & fleet operations across Lagos and Abuja. Guaranteed atomic availability and transparent pricing.
            </p>
            <p className="text-[11px] text-slate-500">
              © 2026 DriveFleet Technologies Ltd. Demo platform.
            </p>
          </div>

          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-3">
              Fleet & Booking
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/vehicles" className="hover:text-white">All Vehicles</Link></li>
              <li><Link to="/how-it-works" className="hover:text-white">How DriveFleet Works</Link></li>
              <li><Link to="/account/bookings" className="hover:text-white">Manage My Rentals</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-3">
              Company & Branches
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/about" className="hover:text-white">About DriveFleet</Link></li>
              <li><Link to="/contact" className="hover:text-white">Branch Directory</Link></li>
              <li><Link to="/faq" className="hover:text-white">Frequently Asked Questions</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-3">
              Legal & Policies
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/terms" className="hover:text-white">Rental Terms & Conditions</Link></li>
              <li><Link to="/privacy" className="hover:text-white">Data Privacy Policy</Link></li>
              <li><span className="text-slate-500">Simulated Card & Zero Liability SLA</span></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
