import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  User as UserIcon, ShieldCheck, Lock, Smartphone, FileText, CheckCircle2,
  AlertTriangle, KeyRound, Building, CreditCard, Camera, Upload, Trash2,
  Sparkles, ShieldAlert
} from 'lucide-react';

const PRESET_AVATARS = [
  {
    name: 'Executive Suit',
    url: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&q=80&w=400',
  },
  {
    name: 'Corporate Director',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
  },
  {
    name: 'Senior Coordinator',
    url: 'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?auto=format&fit=crop&q=80&w=400',
  },
  {
    name: 'Fleet Manager',
    url: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?auto=format&fit=crop&q=80&w=400',
  },
];

export function ProfilePage() {
  const { user, role, updateProfile } = useAuth();

  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [preferredBranch, setPreferredBranch] = useState(
    user?.preferredBranchId?.includes('2') ? 'abuja' : 'ikeja'
  );

  const [isSaved, setIsSaved] = useState(false);
  const [avatarNotice, setAvatarNotice] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setPreferredBranch(user.preferredBranchId?.includes('2') ? 'abuja' : 'ikeja');
    }
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setAvatarError('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }

    setAvatarError(null);
    const reader = new FileReader();
    reader.onload = (uploadEv) => {
      const img = new Image();
      img.onload = () => {
        const maxDim = 400;
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          updateProfile({ avatarUrl: dataUrl });
        } else {
          updateProfile({ avatarUrl: uploadEv.target?.result as string });
        }
        setAvatarNotice('Avatar updated successfully!');
        setTimeout(() => setAvatarNotice(null), 3000);
      };
      img.onerror = () => {
        setAvatarError('Failed to process image. Please try another photo.');
      };
      img.src = uploadEv.target?.result as string;
    };
    reader.onerror = () => {
      setAvatarError('Failed to read file. Please try another image.');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSelectPreset = (url: string) => {
    updateProfile({ avatarUrl: url });
    setAvatarNotice('Preset avatar applied successfully!');
    setTimeout(() => setAvatarNotice(null), 3000);
  };

  const handleRemoveAvatar = () => {
    updateProfile({ avatarUrl: undefined });
    setAvatarNotice('Custom avatar removed. Reverted to default.');
    setTimeout(() => setAvatarNotice(null), 3000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      firstName,
      lastName,
      phone,
      preferredBranchId: preferredBranch === 'abuja'
        ? 'b0000000-0000-0000-0000-000000000002'
        : 'b0000000-0000-0000-0000-000000000001',
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const roleBadge = () => {
    switch (role) {
      case 'admin':
        return (
          <span className="text-[10px] font-bold text-violet-700 bg-violet-50 border border-violet-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            System Administrator
          </span>
        );
      case 'staff':
        return (
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Operations Staff
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Verified Customer
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Title */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Profile & Credentials</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage your personal avatar, contact preferences, driver credentials, and security clearance.
            </p>
          </div>
          <div>{roleBadge()}</div>
        </div>
      </div>

      {/* Avatar Management Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-blue-600" />
            <span>Profile Avatar & Appearance</span>
          </span>
          <span className="text-[11px] text-slate-500 font-normal">
            Visible on bookings, dispatch logs, and account header
          </span>
        </h3>

        <div className="pt-4 flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Main Avatar Preview */}
          <div className="relative group shrink-0">
            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-lg ring-2 ring-slate-200 bg-slate-100 flex items-center justify-center">
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.firstName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-blue-600 text-white flex items-center justify-center font-bold text-3xl">
                  {user?.firstName?.[0] || 'U'}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-1 right-1 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-md transition-colors"
              title="Upload photo"
              aria-label="Upload photo"
            >
              <Upload className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Controls & Action Buttons */}
          <div className="flex-1 space-y-4 text-center md:text-left">
            <div>
              <div className="font-bold text-slate-900 text-sm">
                {user?.firstName} {user?.lastName}
              </div>
              <div className="text-xs text-slate-500 font-mono mt-0.5">{user?.email}</div>
              <p className="text-xs text-slate-600 mt-2">
                Upload a custom photo or choose an executive avatar. Supports JPEG, PNG, or WebP up to 5MB.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/webp"
                onChange={handleFileChange}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload New Avatar</span>
              </button>

              {user?.avatarUrl && (
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-600 border border-slate-200 text-xs font-medium rounded-xl transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Reset to Default</span>
                </button>
              )}
            </div>

            {/* Presets Row */}
            <div className="pt-2">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                Or select an authentic executive portrait:
              </span>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                {PRESET_AVATARS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handleSelectPreset(preset.url)}
                    className="flex items-center gap-2 p-1.5 pr-2.5 rounded-full border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition-colors bg-white shadow-xs"
                    title={`Use ${preset.name}`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.name}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <span className="text-[11px] font-medium text-slate-700">{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Notifications */}
            {avatarNotice && (
              <div className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{avatarNotice}</span>
              </div>
            )}
            {avatarError && (
              <div className="text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span>{avatarError}</span>
              </div>
            )}
          </div>
        </div>
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
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Dispatch Hub</label>
                <select
                  value={preferredBranch}
                  onChange={(e) => setPreferredBranch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ikeja">Lagos – Ikeja Main Hub (GRA)</option>
                  <option value="abuja">Abuja – Central Terminal</option>
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

          {/* Role-Specific Credential Vault */}
          {role === 'customer' ? (
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
                    onClick={() => alert('License document verification refreshed')}
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    Update License Document
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-violet-600" />
                  <span>Operations Staff Security & Clearance Dossier</span>
                </h3>
                <span className="text-[10px] font-bold text-violet-700 bg-violet-50 px-2 py-0.5 rounded-full border border-violet-200">
                  {role === 'admin' ? 'Root Ops Level 1' : 'Branch Staff Level 2'}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <div className="font-bold text-slate-900">DriveFleet Operating Authority</div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    Active & Authorized
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-slate-600">
                  <div>
                    <span className="text-slate-400 block">Staff Identifier:</span>
                    <span className="font-mono font-bold text-slate-900">
                      DF-OPS-{user?.id?.slice(0, 8).toUpperCase() || 'ROOT'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Duty Station:</span>
                    <span className="font-bold text-slate-900">
                      {user?.preferredBranchId?.includes('2') ? 'Abuja Central Terminal' : 'Lagos Ikeja Main Hub'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Security Clearance:</span>
                    <span className="font-bold text-slate-900">
                      {role === 'admin' ? 'Full Fleet Governance' : 'Handover & Inspections'}
                    </span>
                  </div>
                </div>

                <div className="pt-2 text-[10px] text-slate-400 flex items-center justify-between">
                  <span>Cryptographic Key ID: AES-256-SHA-RSA</span>
                  <span className="text-emerald-600 font-semibold">Authorized Personnel</span>
                </div>
              </div>
            </div>
          )}
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
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">New Password</label>
                <input
                  type="password"
                  placeholder="Minimum 8 characters"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="button"
                onClick={() => alert('Password update security notice delivered to your registered email.')}
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
