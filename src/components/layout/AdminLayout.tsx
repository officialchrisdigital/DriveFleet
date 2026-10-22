import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  Car,
  Calendar,
  Bookmark,
  RefreshCw,
  Wrench,
  BarChart3,
  Users,
  Settings,
  Activity,
  DollarSign,
  LogOut,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';

export function AdminLayout() {
  const { role, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isStaffOrAdmin = role === 'staff' || role === 'admin';
  const isAdmin = role === 'admin';

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Operations Deck', header: true },
    { path: '/admin', label: 'Command Center', icon: LayoutDashboard },
    { path: '/admin/vehicles', label: 'Fleet Register', icon: Car },
    { path: '/admin/calendar', label: 'Dispatch Calendar', icon: Calendar },
    { path: '/admin/bookings', label: 'Active Bookings', icon: Bookmark },
    { path: '/admin/customers', label: 'Customer CRM', icon: Users },
    { path: '/admin/maintenance', label: 'Fleet Maintenance', icon: Wrench },

    { label: 'Intelligence & Settings', header: true },
    { path: '/admin/reports', label: 'Reports & Analytics', icon: BarChart3 },
    ...(isAdmin
      ? [
          { path: '/admin/pricing', label: 'Pricing Rules & Tiers', icon: DollarSign },
          { path: '/admin/promos', label: 'Promotions & Vouchers', icon: RefreshCw },
          { path: '/admin/users', label: 'Team & Role Access', icon: Users },
          { path: '/admin/activity', label: 'Audit Trail & Ledger', icon: Activity },
          { path: '/admin/settings', label: 'Business Settings', icon: Settings },
        ]
      : []),
  ];

  if (!isStaffOrAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
        <div className="bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-700 max-w-md w-full text-center">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Operations Access Required</h2>
          <p className="text-sm text-slate-300 mb-6 leading-relaxed">
            This area is restricted to authorized DriveFleet operations staff and managers. Please sign in with staff or administrative credentials.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              to="/admin/login"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm py-2.5 px-4 rounded-xl transition-colors shadow-sm"
            >
              Staff & Operations Login
            </Link>
            <Link
              to="/"
              className="text-xs text-slate-400 hover:text-white transition-colors py-1"
            >
              Return to Public Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900 font-sans">
      {/* Dark Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/drivefleet_logo_icon.png"
              alt="DriveFleet logo"
              className="w-8 h-8 object-contain"
            />
            <div>
              <span className="font-bold text-white text-base">DriveFleet</span>
              <span className="block text-[10px] text-blue-400 uppercase tracking-wider font-semibold">
                Operations Deck
              </span>
            </div>
          </Link>
        </div>

        {/* Hub selector / active node */}
        <div className="p-3 m-3 rounded-lg bg-slate-800/80 border border-slate-700/50">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold mb-1">
            Active Hub
          </span>
          <div className="text-xs font-medium text-white flex items-center justify-between">
            <span>{user?.preferredBranchId?.includes('2') ? 'Abuja Central Terminal' : 'Lagos Ikeja Main Hub'}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item, idx) => {
            if (item.header) {
              return (
                <div
                  key={`header-${idx}`}
                  className="pt-4 pb-1 px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider"
                >
                  {item.label}
                </div>
              );
            }

            const Icon = item.icon!;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path!}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Profile Bar & Sign Out */}
        <div className="p-3 border-t border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-xs shrink-0">
                {user?.firstName?.[0] || 'O'}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-medium text-white truncate">
                  {user?.firstName} {user?.lastName}
                </div>
                <div className="text-[10px] text-blue-400 uppercase tracking-wider font-mono">
                  {role}
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Sign out of Operations Deck"
              className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors"
              aria-label="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <Link
            to="/"
            className="w-full text-center text-[11px] text-slate-400 hover:text-white py-1.5 px-2 rounded hover:bg-slate-800 flex items-center justify-center gap-1.5 transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            <span>View Public Storefront</span>
          </Link>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Ops Header Bar */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              PRD 9.2 Real-Time Concurrency Enforced
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-medium text-slate-800">
                {user?.firstName} {user?.lastName}
              </div>
              <div className="text-[10px] text-slate-500">
                {user?.preferredBranchId?.includes('2') ? 'Abuja Central Terminal' : 'Lagos Ikeja Dispatch Node'}
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="hidden sm:flex text-xs font-semibold text-slate-600 hover:text-red-600 bg-slate-100 hover:bg-red-50 border border-slate-200 px-3 py-1.5 rounded-lg items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
