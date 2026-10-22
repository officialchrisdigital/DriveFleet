import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, DEFAULT_CREDENTIALS } from '@/contexts/AuthContext';
import { ShieldCheck, Eye, EyeOff, ArrowRight, AlertCircle, KeyRound, CheckCircle2 } from 'lucide-react';

export function AdminLoginPage() {
  const { login, isAuthenticated, role } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // If already authenticated as staff/admin, go to /admin
  React.useEffect(() => {
    if (isAuthenticated && (role === 'staff' || role === 'admin')) {
      navigate('/admin');
    }
  }, [isAuthenticated, role, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await login(email, password, 'admin');
      if (!result.success) {
        setError(result.error || 'Invalid credentials or insufficient operational clearance.');
      } else {
        navigate('/admin');
      }
    } catch {
      setError('An error occurred during authentication. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillAdmin = () => {
    setEmail(DEFAULT_CREDENTIALS.admin.email);
    setPassword(DEFAULT_CREDENTIALS.admin.password);
    setError(null);
  };

  const fillStaffLagos = () => {
    setEmail(DEFAULT_CREDENTIALS.staffLagos.email);
    setPassword(DEFAULT_CREDENTIALS.staffLagos.password);
    setError(null);
  };

  const fillStaffAbuja = () => {
    setEmail(DEFAULT_CREDENTIALS.staffAbuja.email);
    setPassword(DEFAULT_CREDENTIALS.staffAbuja.password);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-700 to-blue-500 flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-blue-600/30 ring-4 ring-blue-500/20">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            DriveFleet Operations Deck
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-400">
            Restricted administrative and dispatch personnel portal. Multi-branch operational control.
          </p>
        </div>

        {/* Quick Credentials Pills */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-blue-400" />
              <span>Default Operations Accounts</span>
            </span>
            <span className="text-emerald-400 font-mono text-[10px]">Ready</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={fillAdmin}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-blue-500/50 rounded-xl p-2 text-left transition-all group"
            >
              <div className="text-[10px] font-bold text-amber-400 uppercase">Admin</div>
              <div className="text-xs font-semibold text-white truncate group-hover:text-blue-300">Marcus</div>
              <div className="text-[9px] text-slate-500 font-mono">Full Access</div>
            </button>

            <button
              type="button"
              onClick={fillStaffLagos}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-blue-500/50 rounded-xl p-2 text-left transition-all group"
            >
              <div className="text-[10px] font-bold text-blue-400 uppercase">Staff</div>
              <div className="text-xs font-semibold text-white truncate group-hover:text-blue-300">Amara</div>
              <div className="text-[9px] text-slate-500 font-mono">Lagos Hub</div>
            </button>

            <button
              type="button"
              onClick={fillStaffAbuja}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-blue-500/50 rounded-xl p-2 text-left transition-all group"
            >
              <div className="text-[10px] font-bold text-emerald-400 uppercase">Staff</div>
              <div className="text-xs font-semibold text-white truncate group-hover:text-blue-300">Ibrahim</div>
              <div className="text-[9px] text-slate-500 font-mono">Abuja Hub</div>
            </button>
          </div>
        </div>

        {/* Error notification */}
        {error && (
          <div className="bg-red-950/80 border border-red-800/80 rounded-xl p-3.5 text-xs text-red-300 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl p-6 sm:p-8 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Authorized Staff Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. marcus@drivefleet.demo"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Security Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 pr-10 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-blue-600/30 text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <span>{loading ? 'Verifying clearance...' : 'Authenticate & Enter Deck'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer info */}
        <div className="text-center pt-2 space-y-2">
          <Link
            to="/login"
            className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            Looking for Customer Sign In? Return to public portal →
          </Link>
          <div className="text-[11px] text-slate-600 font-mono">
            DriveFleet Core v1.0 • Session encrypted • TLS 1.3
          </div>
        </div>
      </div>
    </div>
  );
}
