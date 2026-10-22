import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { MapPin, Menu, X, User as UserIcon, ShieldCheck, LogOut, LogIn, UserPlus } from 'lucide-react';

export function PublicLayout() {
  const { user, role, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { to: '/vehicles', label: 'Fleet & Booking' },
    { to: '/how-it-works', label: 'How It Works' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
    { to: '/faq', label: 'FAQ' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Main Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo & Hub Badge */}
          <div className="flex items-center gap-4 shrink-0">
            <Link to="/" className="flex items-center gap-2">
              <img
                src="/drivefleet_logo_icon.png"
                alt="DriveFleet logo"
                className="w-8 h-8 object-contain"
              />
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Drive<span className="text-blue-600">Fleet</span>
              </span>
            </Link>

            <div className="hidden xl:flex items-center gap-1.5 bg-slate-100 rounded-lg px-2.5 py-1 text-xs text-slate-600 border border-slate-200">
              <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>Lagos Ikeja Main Branch</span>
            </div>
          </div>

          {/* Center Nav Links (Visible on large screens) */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600 shrink-0">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`transition-colors hover:text-blue-600 ${
                  location.pathname === link.to ? 'text-blue-600 font-semibold' : ''
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="text-xs sm:text-sm font-semibold text-slate-700 hover:text-blue-600 px-2.5 py-1.5 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5 text-slate-500" />
                  <span>Sign In</span>
                </Link>

                <Link
                  to="/register"
                  className="hidden sm:flex text-xs sm:text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors items-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5 text-blue-600" />
                  <span>Register</span>
                </Link>

                <Link
                  to="/vehicles"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 rounded-lg transition-colors shadow-sm whitespace-nowrap"
                >
                  Book a Car
                </Link>
              </>
            ) : role === 'customer' ? (
              <>
                <Link
                  to="/account/profile"
                  className={`text-xs sm:text-sm font-semibold px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-2 ${
                    location.pathname.startsWith('/account')
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
                  }`}
                  title="Profile & Credentials"
                >
                  <div className="w-6 h-6 rounded-full overflow-hidden bg-blue-100 border border-blue-200 flex items-center justify-center font-bold text-[10px] text-blue-700 shrink-0">
                    {user?.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.firstName} className="w-full h-full object-cover" />
                    ) : (
                      user?.firstName?.[0] || 'U'
                    )}
                  </div>
                  <span className="hidden sm:inline font-medium">{user?.firstName || 'My Account'}</span>
                  <span className="sm:hidden font-medium">Account</span>
                </Link>

                <Link
                  to="/vehicles"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 rounded-lg transition-colors shadow-sm whitespace-nowrap"
                >
                  Book a Car
                </Link>

                <button
                  onClick={handleLogout}
                  title="Sign out of account"
                  className="p-2 text-slate-500 hover:text-red-600 rounded-lg hover:bg-slate-100 transition-colors"
                  aria-label="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              // Staff or Admin
              <>
                <Link
                  to="/admin/profile"
                  className="flex items-center gap-2 text-xs font-medium text-slate-700 hover:text-blue-600 px-2 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                  title="Profile & Credentials"
                >
                  <div className="w-6 h-6 rounded-full overflow-hidden bg-slate-200 border border-slate-300 flex items-center justify-center font-bold text-[10px] text-slate-700 shrink-0">
                    {user?.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.firstName} className="w-full h-full object-cover" />
                    ) : (
                      user?.firstName?.[0] || 'O'
                    )}
                  </div>
                  <span className="hidden md:inline">{user?.firstName}</span>
                </Link>

                <Link
                  to="/admin"
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 rounded-lg transition-colors shadow-sm flex items-center gap-2 whitespace-nowrap"
                >
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                  <span>Ops Deck</span>
                  <span className="text-[10px] bg-blue-500/30 text-blue-300 px-1.5 py-0.5 rounded uppercase font-mono">
                    {role}
                  </span>
                </Link>

                <button
                  onClick={handleLogout}
                  title="Sign out of operations deck"
                  className="p-2 text-slate-500 hover:text-red-600 rounded-lg hover:bg-slate-100 transition-colors"
                  aria-label="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === link.to
                      ? 'bg-blue-50 text-blue-600 font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <LogIn className="w-4 h-4 text-blue-600" />
                    <span>Sign In</span>
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 rounded-lg text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 flex items-center gap-2"
                  >
                    <UserPlus className="w-4 h-4 text-blue-600" />
                    <span>Register New Account</span>
                  </Link>
                  <Link
                    to="/admin/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 rounded-lg text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1.5"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Staff & Admin Portal Login</span>
                  </Link>
                </>
              ) : role === 'customer' ? (
                <>
                  <Link
                    to="/account/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <div className="w-5 h-5 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center font-bold text-[9px] text-blue-700 shrink-0">
                      {user?.avatarUrl ? (
                        <img src={user.avatarUrl} alt={user.firstName} className="w-full h-full object-cover" />
                      ) : (
                        user?.firstName?.[0] || 'U'
                      )}
                    </div>
                    <span>Profile & Credentials ({user?.firstName})</span>
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="px-3 py-2 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2 text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-900 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span>Operations Command Center ({role})</span>
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="px-3 py-2 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2 text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
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
              <img
                src="/drivefleet_logo_icon.png"
                alt="DriveFleet logo"
                className="w-6 h-6 object-contain"
              />
              DriveFleet
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Enterprise car rental & fleet operations across Lagos and Abuja. Guaranteed atomic availability and transparent pricing.
            </p>
            <p className="text-[11px] text-slate-500">
              © 2026 DriveFleet Technologies Ltd. All rights reserved.
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
              Portals & Legal
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/login" className="hover:text-white">Customer Sign In</Link></li>
              <li><Link to="/register" className="hover:text-white">Create Account</Link></li>
              <li><Link to="/admin/login" className="text-blue-400 hover:text-blue-300 font-medium">Staff & Ops Portal</Link></li>
              <li><Link to="/terms" className="hover:text-white">Rental Terms & Conditions</Link></li>
              <li><Link to="/privacy" className="hover:text-white">Data Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
