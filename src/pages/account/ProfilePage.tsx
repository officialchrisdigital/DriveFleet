import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  User, ShieldCheck, Lock, Smartphone, FileText, CheckCircle2,
  AlertTriangle, KeyRound, Building, CreditCard
} from 'lucide-react';

export function ProfilePage() {
  const { user } = useAuth();

  const [firstName, setFirstName] = useState(user?.firstName || 'Chukwudi');
  const [lastName, setLastName] = useState(user?.lastName || 'Adeyemi');
  const [email] = useState(user?.email || 'c.adeyemi@enterprise-lagos.ng');
  const [phone, setPhone] = useState(user?.phone || '+234 803 555 0192');
  const [preferredBranch, setPreferredBranch] = useState('ikeja');
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-slate-900">Profile & Identification Vault</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage your verified driver licensing dossiers, contact preferences, and security credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Personal Info Form */}
          <form onSubmit={handleSaveProfile} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center justify-between">
              <span>Primary Contact & Account Data</span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Active Member
              </span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number (WhatsApp Dispatch)</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Dispatch Hub</label>
                <select
                  value={preferredBranch}
                  onChange={(e) => setPreferredBranch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800"
                >
                  <option value="ikeja">Lagos – Ikeja Main Hub (GRA)</option>
                  <option value="abuja">Abuja – Central Terminal Terminal</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              {isSaved ? (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  ✓ Profile updated successfully!
                </span>
              ) : <div />}
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-xl text-xs transition-colors shadow-sm"
              >
                Save Profile Changes
              </button>
            </div>
          </form>

          {/* Driver Licensing & Identity Vault (Exact Mockup Match) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Driver Licensing & Identity Vault</span>
              </h3>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Tier 3 Clear
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <div className="font-bold text-slate-900">Federal Road Safety Corps (FRSC) License</div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  Active • Valid
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-slate-600">
                <div>
                  <span className="text-slate-400 block">License Number:</span>
                  <span className="font-mono font-bold text-slate-900">FRSC-LAG-8492018B</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Expiry Date:</span>
                  <span className="font-bold text-slate-900">24 August 2028</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Issuing Command:</span>
                  <span className="font-bold text-slate-900">Lagos State, Nigeria</span>
                </div>
              </div>

              <div className="pt-2 text-[10px] text-slate-400 flex items-center justify-between">
                <span>Audit Stamp: Validated by Marcus Vance on Sep 12, 2026</span>
                <button
                  type="button"
                  onClick={() => alert('Update license document uploaded')}
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Update License Document
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Security & Preferences */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-blue-600" />
              <span>Security Credentials</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Current Password</label>
                <input
                  type="password"
                  value="••••••••••••"
                  disabled
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">New Password</label>
                <input
                  type="password"
                  placeholder="Minimum 8 characters"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <button
                type="button"
                onClick={() => alert('Password update request processed via Auth Provider')}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 rounded-xl text-xs transition-colors"
              >
                Update Passphrase
              </button>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-3 text-xs text-slate-600">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>NDPR Data Privacy Assurance</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Your biometric and driver license data are cryptographically secured using AES-256 and used strictly for FRSC regulatory compliance and physical key handover at DriveFleet branches.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
