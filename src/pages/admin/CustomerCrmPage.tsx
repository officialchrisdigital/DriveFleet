import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useOperations } from '@/contexts/OperationsContext';
import { downloadCsv } from '@/lib/csvExport';
import {
  Users, Search, Plus, Mail, Phone, ShieldCheck,
  Calendar, FileText, ChevronRight, Download, Filter, Building
} from 'lucide-react';

export function CustomerCrmPage() {
  const { customers } = useOperations();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filtered = customers.filter((c) => {
    if (selectedStatus !== 'all' && c.status !== selectedStatus) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const fullName = `${c.firstName} ${c.lastName}`.toLowerCase();
    return (
      fullName.includes(q) ||
      (c.email && c.email.toLowerCase().includes(q)) ||
      (c.phone && c.phone.includes(q)) ||
      (c.company && c.company.toLowerCase().includes(q)) ||
      (c.renterDetails?.licenseNumber && c.renterDetails.licenseNumber.toLowerCase().includes(q))
    );
  });

  const handleExportCsv = () => {
    const headers = [
      'Customer ID',
      'First Name',
      'Last Name',
      'Email',
      'Phone',
      'Company',
      'FRSC License No',
      'License Expiry',
      'Account Status',
      'Total Rentals',
      'Registration Date',
    ];

    const rows = filtered.map((c) => [
      c.id,
      c.firstName,
      c.lastName,
      c.email || '',
      c.phone || '',
      c.company || 'Private Account',
      c.renterDetails?.licenseNumber || 'N/A',
      c.renterDetails?.licenseExpiry || 'N/A',
      c.status?.toUpperCase() || 'ACTIVE',
      c.rentalsCount || 0,
      new Date(c.createdAt).toLocaleDateString(),
    ]);

    downloadCsv('drivefleet-crm-customers.csv', headers, rows);
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'vip':
        return (
          <span className="text-[10px] font-bold text-violet-700 bg-violet-50 border border-violet-200 px-2.5 py-0.5 rounded-full uppercase">
            VIP Enterprise
          </span>
        );
      case 'flagged':
        return (
          <span className="text-[10px] font-bold text-red-700 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full uppercase">
            Audit Flagged
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full uppercase">
            Active Clear
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Customer CRM Directory</h1>
            <span className="text-[10px] font-bold text-slate-500 uppercase px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
              Live Auto-Sync Active
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Registered customer dossiers, FRSC verified licensing, live storefront registrations, and internal notes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
            title="Download Customer Directory as CSV"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CRM CSV</span>
          </button>

          <Link
            to="/admin/customers/new"
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Customer Record</span>
          </Link>
        </div>
      </div>

      {/* Stats Counter Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-[10px] uppercase font-bold text-slate-400">Total Accounts</div>
          <div className="text-xl font-black text-slate-900 mt-0.5">{customers.length} Clients</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-[10px] uppercase font-bold text-emerald-600">Active Clear</div>
          <div className="text-xl font-black text-emerald-600 mt-0.5">
            {customers.filter((c) => c.status !== 'flagged').length} Verified
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-[10px] uppercase font-bold text-violet-600">VIP Corporate</div>
          <div className="text-xl font-black text-violet-600 mt-0.5">
            {customers.filter((c) => c.status === 'vip').length} Accounts
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-[10px] uppercase font-bold text-red-600">Audit Review</div>
          <div className="text-xl font-black text-red-600 mt-0.5">
            {customers.filter((c) => c.status === 'flagged').length} Dossiers
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, phone, company, or license..."
            className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="all">All Customer Statuses</option>
            <option value="active">Active Clear Only</option>
            <option value="vip">VIP Corporate Only</option>
            <option value="flagged">Flagged / Review Only</option>
          </select>
        </div>
      </div>

      {/* Customers List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <div className="font-bold text-slate-700 text-sm">No customer records found</div>
            <p className="text-xs text-slate-400 mt-1">Try adjusting your search query or status filter.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 text-xs">
            {filtered.map((c) => (
              <div
                key={c.id}
                onClick={() => navigate(`/admin/customers/${c.id}`)}
                className="p-4 hover:bg-slate-50 transition-colors cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group"
              >
                {/* Left: Contact Info */}
                <div className="flex items-start gap-3 min-w-[240px]">
                  <div className="w-11 h-11 rounded-full overflow-hidden bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-sm border border-blue-200 shadow-xs">
                    {c.avatarUrl ? (
                      <img
                        src={c.avatarUrl}
                        alt={`${c.firstName} ${c.lastName}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <span>
                        {c.firstName[0]}
                        {c.lastName[0]}
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors text-sm flex items-center gap-2">
                      <span>
                        {c.firstName} {c.lastName}
                      </span>
                      {getStatusBadge(c.status)}
                    </div>
                    <div className="text-slate-500 font-medium flex items-center gap-1.5 mt-0.5">
                      <Building className="w-3 h-3 text-slate-400" />
                      <span>{c.company || 'Private Account'}</span>
                    </div>
                    <div className="text-slate-400 text-[11px] flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3 text-slate-400" />
                        {c.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400" />
                        {c.phone}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Middle: FRSC License Dossier */}
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 min-w-[200px]">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-slate-700 mb-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>FRSC Driver License</span>
                  </div>
                  <div className="font-mono text-xs font-bold text-slate-900">
                    {c.renterDetails?.licenseNumber || 'Online Pending'}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    Expiry: {c.renterDetails?.licenseExpiry || 'N/A'}
                  </div>
                </div>

                {/* Right: Stats & Actions */}
                <div className="flex items-center justify-between md:justify-end gap-6 shrink-0">
                  <div className="text-right">
                    <div className="font-black text-slate-900 text-sm">{c.rentalsCount || 0} Bookings</div>
                    <div className="text-[10px] text-slate-400 font-medium">
                      Registered: {new Date(c.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-blue-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                      View Dossier <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
