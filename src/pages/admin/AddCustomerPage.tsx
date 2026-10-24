import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useOperations } from '@/contexts/OperationsContext';
import { AvatarUploader } from '@/components/shared/AvatarUploader';
import {
  Users, ArrowLeft, ShieldCheck, CheckCircle2,
  Building, Mail, Phone, FileText
} from 'lucide-react';

export function AddCustomerPage() {
  const { addCustomer } = useOperations();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const [licenseNumber, setLicenseNumber] = useState('');
  const [licenseExpiry, setLicenseExpiry] = useState('');
  const [status, setStatus] = useState<'active' | 'vip' | 'flagged'>('active');
  const [initialNote, setInitialNote] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      setError('Please provide first and last name.');
      return;
    }
    if (!email.trim()) {
      setError('Email address is required.');
      return;
    }

    const created = addCustomer({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim() || '+234 800 000 0000',
      company: company.trim() || 'Private Account',
      avatarUrl,
      status,
      renterDetails: {
        licenseNumber: licenseNumber.trim() || 'FRSC-PENDING',
        licenseExpiry: licenseExpiry || '2028-12-31',
        verifiedOnline: true,
      },
      notes: initialNote.trim()
        ? [
            {
              id: `note-${Date.now()}`,
              customerId: '',
              authorId: 'staff',
              authorName: 'Duty Officer',
              content: initialNote.trim(),
              createdAt: new Date().toISOString(),
            },
          ]
        : [],
    });

    navigate(`/admin/customers/${created.id}`);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/customers"
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Add CRM Customer Record</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Provision customer dossier with verified FRSC driver credentials and corporate linkage.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
        <div>
          <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-600" />
            <span>Primary Identity & Contact Details</span>
          </h2>

          <div className="p-4 bg-slate-50/70 border border-slate-200 rounded-xl mt-4">
            <AvatarUploader
              value={avatarUrl}
              onChange={setAvatarUrl}
              label="Customer Profile Avatar"
              subtitle="Upload an image on behalf of this customer (customer can also update their own avatar at any time)"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="e.g. Oladipo"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="e.g. Balogun"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. o.balogun@company.ng"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                WhatsApp / Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +234 803 123 4567"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Company / Organization
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Dangote Cement Plc or Private"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Account Standing</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">Active Clear (Standard Renter)</option>
                <option value="vip">VIP Corporate (Priority Escort)</option>
                <option value="flagged">Flagged / Audit Review</option>
              </select>
            </div>
          </div>
        </div>

        {/* FRSC License Details */}
        <div className="pt-4 border-t border-slate-100">
          <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>FRSC Driver Licensing Dossier</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                FRSC License Number
              </label>
              <input
                type="text"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                placeholder="e.g. FRSC-LAG-9284011A"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">License Expiry Date</label>
              <input
                type="date"
                value={licenseExpiry}
                onChange={(e) => setLicenseExpiry(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Initial Staff Notes */}
        <div className="pt-4 border-t border-slate-100">
          <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-600" />
            <span>Private Staff Audit Notes</span>
          </h2>

          <div className="mt-4">
            <textarea
              rows={3}
              value={initialNote}
              onChange={(e) => setInitialNote(e.target.value)}
              placeholder="Private notes visible strictly to operations staff (e.g. corporate invoicing agreement, preferred driver, verified physical NIN dossier)..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
          <Link
            to="/admin/customers"
            className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Save Customer Dossier</span>
          </button>
        </div>
      </form>
    </div>
  );
}
