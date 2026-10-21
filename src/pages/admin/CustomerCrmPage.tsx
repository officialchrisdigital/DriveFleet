import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, Search, Plus, Mail, Phone, ShieldCheck,
  Calendar, FileText, ChevronRight
} from 'lucide-react';

export function CustomerCrmPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const customers = [
    {
      id: 'c-adeyemi',
      name: 'Chukwudi Adeyemi',
      company: 'Enterprise Dynamics Lagos',
      email: 'c.adeyemi@enterprise-lagos.ng',
      phone: '+234 803 555 0192',
      license: 'FRSC-LAG-8492018B',
      licenseExpiry: '24 Aug 2028',
      rentalsCount: 6,
      status: 'active',
      notesCount: 2,
    },
    {
      id: 'n-eze',
      name: 'Dr. Ngozi Eze',
      company: 'Abuja Medical Consult',
      email: 'ngozi.eze@abuja-health.gov.ng',
      phone: '+234 802 333 4455',
      license: 'FRSC-ABJ-3192020A',
      licenseExpiry: '15 May 2027',
      rentalsCount: 3,
      status: 'active',
      notesCount: 1,
    },
    {
      id: 't-mansoor',
      name: 'Tariq Al-Mansoor',
      company: 'Diplomatic Mission Trade Office',
      email: 't.mansoor@trade-diplomatic.org',
      phone: '+234 809 111 8899',
      license: 'INTL-PERMIT-DXB-902',
      licenseExpiry: '10 Nov 2029',
      rentalsCount: 8,
      status: 'active',
      notesCount: 4,
    },
    {
      id: 'c-okonkwo',
      name: 'Chidi Okonkwo',
      company: 'Okonkwo & Sons Logistics',
      email: 'chidi@okonkwo-logistics.com',
      phone: '+234 805 777 9900',
      license: 'FRSC-LAG-1102948C',
      licenseExpiry: '04 Jan 2026',
      rentalsCount: 4,
      status: 'flagged',
      notesCount: 3,
    },
  ];

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Customer CRM Directory</h1>
            <span className="text-[10px] font-bold text-slate-500 uppercase px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
              PRD FR-10
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Registered customer dossiers, FRSC verified licensing, and private internal notes.
          </p>
        </div>

        <Link
          to="/admin/customers/new"
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Customer Record</span>
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, company, email, or phone..."
            className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-slate-800"
          />
        </div>
      </div>

      {/* CRM Cards Grid / Table (Exact Mockup Match) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow space-y-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 font-black text-sm flex items-center justify-center border border-blue-200">
                  {c.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{c.name}</h3>
                  <div className="text-[11px] text-slate-500">{c.company}</div>
                </div>
              </div>

              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                  c.status === 'active'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {c.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div className="flex items-center gap-1.5 truncate">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{c.email}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{c.phone}</span>
              </div>
              <div className="flex items-center gap-1.5 truncate">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="font-mono text-[11px] truncate">{c.license}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{c.rentalsCount} Completed Trips</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-400 font-medium">
                🔒 {c.notesCount} Internal Staff Notes (Private)
              </span>

              <Link
                to={`/admin/customers/${c.id}`}
                className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1"
              >
                <span>View Full Dossier</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
