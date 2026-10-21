import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LayoutDashboard, Car, Calendar, Bookmark, RefreshCw, Wrench, BarChart3, Users, Settings, Activity, DollarSign, Bell } from 'lucide-react';

export function AdminLayout() {
  const { role, user } = useAuth();
  const location = useLocation();

  const isStaffOrAdmin = role === 'staff' || role === 'admin';
  const isAdmin = role === 'admin';

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
    ...(isAdmin ? [
      { path: '/admin/pricing', label: 'Pricing Rules & Tiers', icon: DollarSign },
      { path: '/admin/promos', label: 'Promotions & Vouchers', icon: RefreshCw },
      { path: '/admin/users', label: 'Team & Role Access', icon: Users },
      { path: '/admin/activity', label: 'Audit Trail & Ledger', icon: Activity },
      { path: '/admin/settings', label: 'Business Settings', icon: Settings },
    ] : [])
  ];

  if (!isStaffOrAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 max-w-md w-full text-center">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Operations Access Required</h2>
          <p className="text-sm text-slate-600 mb-6">
            You are currently signed in as a customer. Please switch to Staff or Admin role using the top demo banner.
          </p>
          <Link
            to="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg"
          >
            Return to Public Home
          </Link>
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
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
              D
            </div>
            <div>
              <span className="font-bold text-white text-base">DriveFleet</span>
              <span className="block text-[10px] text-blue-400 uppercase tracking-wider font-semibold">
                Operations Deck
              </span>
            </div>
          </Link>
        </div>

        {/* Hub selector */}
        <div className="p-3 m-3 rounded-lg bg-slate-800/80 border border-slate-700/50">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold mb-1">
            Active Hub
          </span>
          <div className="text-xs font-medium text-white flex items-center justify-between">
            <span>Lagos Ikeja Main Hub</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item, idx) => {
            if (item.header) {
              return (
                <div
                  key={idx}
                  className="pt-4 pb-1 px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider"
                >
                  {item.label}
                </div>
              );
            }

            const Icon = item.icon!;
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path!));

            return (
              <Link
                key={item.path}
                to={item.path!}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User bar */}
        <div className="p-3 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-xs shrink-0">
              {user?.firstName?.[0] || 'O'}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-medium text-white truncate">
                {user?.firstName} {user?.lastName}
              </div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider truncate">
                {role}
              </div>
            </div>
          </div>
          <Link
            to="/"
            title="Switch to Public Storefront"
            className="text-xs text-slate-400 hover:text-white p-1.5 rounded hover:bg-slate-800"
          >
            Storefront
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
                Lagos Ikeja Dispatch Node
              </div>
            </div>
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
