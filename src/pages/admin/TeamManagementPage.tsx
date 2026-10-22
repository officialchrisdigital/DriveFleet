import React, { useState } from 'react';
import {
  Users, Plus, ShieldCheck, AlertTriangle, CheckCircle2,
  Lock, Mail, Phone, UserX, UserCheck
} from 'lucide-react';

export function TeamManagementPage() {
  const [team, setTeam] = useState([
    {
      id: 'u-marcus',
      name: 'Marcus Vance',
      email: 'marcus.vance@drivefleet.demo',
      phone: '+234 809 999 8877',
      role: 'admin',
      active: true,
      lastLogin: 'Today @ 10:14 AM',
    },
    {
      id: 'u-amara',
      name: 'Amara Kalu',
      email: 'amara.kalu@drivefleet.demo',
      phone: '+234 802 111 2233',
      role: 'staff',
      active: true,
      lastLogin: 'Yesterday @ 04:30 PM',
    },
    {
      id: 'u-ibrahim',
      name: 'Ibrahim Musa',
      email: 'ibrahim.musa@drivefleet.demo',
      phone: '+234 803 444 5566',
      role: 'staff',
      active: true,
      lastLogin: '3 Days Ago',
    },
  ]);

  const handleDeactivate = (userId: string) => {
    const userToDeactivate = team.find((u) => u.id === userId);
    if (userToDeactivate?.role === 'admin') {
      const activeAdmins = team.filter((u) => u.role === 'admin' && u.active);
      if (activeAdmins.length <= 1) {
        alert(
          'LAST_ADMIN_PROTECTED: Cannot deactivate or demote the last remaining active administrator.'
        );
        return;
      }
    }

    setTeam((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, active: !u.active } : u))
    );
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
            <span className="text-[10px] font-bold text-slate-500 uppercase px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
              Access Control
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Provision staff and administrator operational accounts with last-admin removal safeguards.
          </p>
        </div>

        <button
          onClick={() => alert('Invite team member dialog (Admin action)')}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Provision New Member</span>
        </button>
      </div>

      {/* Last Admin Guard Callout */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-center justify-between text-xs text-blue-900">
        <div className="flex items-center gap-3">
          <Lock className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            <strong>Last-Admin Safeguard Enforced:</strong> The master database trigger <code className="bg-blue-100 px-1 py-0.5 rounded font-mono font-bold">trg_last_admin_protect</code> strictly rejects any operational action that would leave zero active administrators.
          </span>
        </div>
      </div>

      {/* Team Roster Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase text-[10px] font-semibold">
              <tr>
                <th className="py-3 px-4">Staff Member</th>
                <th className="py-3 px-4">Contact Info</th>
                <th className="py-3 px-4">Role Access</th>
                <th className="py-3 px-4">Account Status</th>
                <th className="py-3 px-4">Last Activity</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {team.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{m.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">ID: {m.id}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    <div>{m.email}</div>
                    <div className="text-[11px] text-slate-400">{m.phone}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        m.role === 'admin'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {m.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    {m.active ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 w-fit">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Active
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500">
                        Deactivated
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                    {m.lastLogin}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleDeactivate(m.id)}
                      className="text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors bg-slate-100 hover:bg-slate-200 text-slate-700"
                    >
                      {m.active ? 'Deactivate' : 'Reactivate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
