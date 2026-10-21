import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LayoutDashboard, Bookmark, User, PlusCircle } from 'lucide-react';

export function CustomerLayout() {
  const { user } = useAuth();
  const location = useLocation();

  const tabs = [
    { path: '/account', label: 'Account Overview', icon: LayoutDashboard },
    { path: '/account/bookings', label: 'My Bookings', icon: Bookmark },
    { path: '/account/profile', label: 'Profile & Credentials', icon: User },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Customer Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Welcome back, {user?.firstName || 'Renter'}
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Enterprise Member
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Manage your corporate vehicle rentals, reservations, and driver credential dossiers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/vehicles"
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Book Another Car</span>
          </Link>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 pt-4 pb-6 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          const Icon = tab.icon;
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Sub-view Content */}
      <div>
        <Outlet />
      </div>
    </div>
  );
}
