import React, { useState } from 'react';
import { useOperations } from '@/contexts/OperationsContext';
import { downloadCsv } from '@/lib/csvExport';
import { AvatarUploader } from '@/components/shared/AvatarUploader';
import {
  Users, Plus, ShieldCheck, AlertTriangle, CheckCircle2,
  Lock, Mail, Phone, UserX, UserCheck, X, Download
} from 'lucide-react';

export function TeamManagementPage() {
  const { teamMembers, addTeamMember, toggleTeamMember } = useOperations();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'staff' | 'admin'>('staff');
  const [branch, setBranch] = useState('Lagos Central Hub (Ikeja)');
  const [temporaryPassword, setTemporaryPassword] = useState('Staff@DriveFleet2026!');
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'
  );
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleDeactivate = (userId: string) => {
    setError(null);
    const userToDeactivate = teamMembers.find((u) => u.id === userId);
    if (userToDeactivate?.role === 'admin' && userToDeactivate.active) {
      const activeAdmins = teamMembers.filter((u) => u.role === 'admin' && u.active);
      if (activeAdmins.length <= 1) {
        setError(
          'LAST_ADMIN_PROTECTED: Cannot deactivate or demote the last remaining active administrator.'
        );
        return;
      }
    }
    toggleTeamMember(userId);
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      setError('First name, last name, and work email are required.');
      return;
    }

    addTeamMember({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim() || '+234 800 000 0000',
      role,
      branch,
      active: true,
      avatarUrl: avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      password: temporaryPassword.trim(),
    });

    setIsModalOpen(false);
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setAvatarUrl('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400');
    setFeedback(`New ${role.toUpperCase()} account provisioned for ${firstName} ${lastName}!`);
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleExportCsv = () => {
    const rows = teamMembers.map((m) => ({
      'Member ID': m.id,
      'Name': `${m.firstName} ${m.lastName}`,
      'Email': m.email,
      'Phone': m.phone || '-',
      'Role': m.role,
      'Branch Node': m.branch,
      'Status': m.active ? 'Active' : 'Disabled',
      'Created At': m.createdAt,
    }));
    downloadCsv('drivefleet-team-directory.csv', rows);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Team Members & Role Access Control
            </h1>
            <span className="text-[10px] font-bold text-blue-700 uppercase px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200">
              {teamMembers.length} Members Provisioned
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Provision staff and administrator operational accounts with last-admin removal safeguards.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Provision New Member</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Team Roster Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teamMembers.map((member) => (
          <div
            key={member.id}
            className={`bg-white rounded-2xl border p-5 shadow-sm space-y-4 transition-all ${
              member.active ? 'border-slate-200' : 'border-slate-200 bg-slate-50/70 opacity-70'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl overflow-hidden bg-slate-900 text-white font-black text-sm flex items-center justify-center shrink-0 border border-slate-200 shadow-sm ring-2 ring-slate-100">
                  {member.avatarUrl ? (
                    <img
                      src={member.avatarUrl}
                      alt={`${member.firstName} ${member.lastName}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <span>{member.firstName.charAt(0)}{member.lastName.charAt(0)}</span>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {member.firstName} {member.lastName}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        member.role === 'admin'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}
                    >
                      {member.role}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {member.branch.split(' ')[0]}
                    </span>
                  </div>
                </div>
              </div>

              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  member.active ? 'bg-emerald-500' : 'bg-slate-300'
                }`}
                title={member.active ? 'Active' : 'Deactivated'}
              />
            </div>

            <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2 truncate">
                <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span className="font-mono text-[11px] truncate">{member.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span className="font-mono text-[11px]">{member.phone || 'No phone recorded'}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <span className="text-[10px] text-slate-400 font-mono">
                {member.active ? 'Ready for Shift' : 'Access Suspended'}
              </span>

              <button
                onClick={() => handleDeactivate(member.id)}
                className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1 ${
                  member.active
                    ? 'text-rose-600 hover:bg-rose-50 border border-rose-200'
                    : 'text-emerald-700 hover:bg-emerald-50 border border-emerald-200 bg-emerald-50/50'
                }`}
              >
                {member.active ? (
                  <>
                    <UserX className="w-3.5 h-3.5" />
                    <span>Deactivate</span>
                  </>
                ) : (
                  <>
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Re-enable</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Provision Member Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">Provision Team Account</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-4 text-xs">
              {/* Profile Avatar Upload */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <AvatarUploader
                  value={avatarUrl}
                  onChange={setAvatarUrl}
                  label="Team Member Avatar"
                  subtitle="Upload an employee photo from device or provide an image URL"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Work Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="name@drivefleet.ng"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Contact Phone</label>
                <input
                  type="tel"
                  placeholder="+234 800 000 0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Role Permission</label>
                  <select
                    value={role}
                    onChange={(e) => {
                      const newRole = e.target.value as 'staff' | 'admin';
                      setRole(newRole);
                      if (temporaryPassword === 'Staff@DriveFleet2026!' || temporaryPassword === 'Admin@DriveFleet2026!') {
                        setTemporaryPassword(newRole === 'admin' ? 'Admin@DriveFleet2026!' : 'Staff@DriveFleet2026!');
                      }
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="staff">Station Staff / Dispatcher</option>
                    <option value="admin">Operations Executive (Admin)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Assigned Station</label>
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Lagos Central Hub (Ikeja)">Lagos Central Hub (Ikeja)</option>
                    <option value="Victoria Island Station (Lagos)">Victoria Island Station (Lagos)</option>
                    <option value="Abuja Central Hub (Maitama)">Abuja Central Hub (Maitama)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Initial Authentication Password *
                </label>
                <input
                  type="text"
                  required
                  value={temporaryPassword}
                  onChange={(e) => setTemporaryPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Member can immediately authenticate at /admin/login using their work email and this password.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-sm"
                >
                  Provision Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
