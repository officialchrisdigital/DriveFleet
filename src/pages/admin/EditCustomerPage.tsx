import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useOperations } from '@/contexts/OperationsContext';
import { AvatarUploader } from '@/components/shared/AvatarUploader';
import {
  Users, ArrowLeft, ShieldCheck, CheckCircle2,
  Building, Mail, Phone
} from 'lucide-react';

export function EditCustomerPage() {
  const { customerId } = useParams<{ customerId: string }>();
  const { customers, updateCustomer } = useOperations();
  const navigate = useNavigate();

  const customer = customers.find((c) => c.id === customerId);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const [licenseNumber, setLicenseNumber] = useState('');
  const [licenseExpiry, setLicenseExpiry] = useState('');
  const [status, setStatus] = useState<'active' | 'vip' | 'flagged'>('active');

  useEffect(() => {
    if (customer) {
      setFirstName(customer.firstName);
      setLastName(customer.lastName);
      setEmail(customer.email || '');
      setPhone(customer.phone || '');
      setCompany(customer.company || '');
      setAvatarUrl(customer.avatarUrl);
      setLicenseNumber(customer.renterDetails?.licenseNumber || '');
      setLicenseExpiry(customer.renterDetails?.licenseExpiry || '');
      setStatus(customer.status || 'active');
    }
  }, [customer]);

  if (!customer) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <h2 className="text-base font-bold text-slate-900">Customer Not Found</h2>
        <Link to="/admin/customers" className="text-xs text-blue-600 font-bold mt-2 inline-block">
          Return to CRM
        </Link>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateCustomer(customer.id, {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      company: company.trim(),
      avatarUrl,
      status,
      renterDetails: {
        ...customer.renterDetails,
        licenseNumber: licenseNumber.trim(),
        licenseExpiry: licenseExpiry.trim(),
      },
    });

    navigate(`/admin/customers/${customer.id}`);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
        <Link
          to={`/admin/customers/${customer.id}`}
          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Edit Customer CRM Profile
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 font-mono">Dossier: {customer.id}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
        <div>
          <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-600" />
            <span>Identity & Contact Details</span>
          </h2>

          <div className="p-4 bg-slate-50/70 border border-slate-200 rounded-xl mt-4">
            <AvatarUploader
              value={avatarUrl}
              onChange={setAvatarUrl}
              label="Customer Profile Avatar"
              subtitle="Upload or update an image on behalf of this customer (customer can also update their own avatar at any time)"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">First Name</label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Last Name</label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Company / Organization</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Standing</label>
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

        {/* FRSC License */}
        <div className="pt-4 border-t border-slate-100">
          <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Driver License Credentials</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">License Number</label>
              <input
                type="text"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Expiry Date</label>
              <input
                type="text"
                value={licenseExpiry}
                onChange={(e) => setLicenseExpiry(e.target.value)}
                placeholder="e.g. 24 Aug 2028"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
          <Link
            to={`/admin/customers/${customer.id}`}
            className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Update Dossier</span>
          </button>
        </div>
      </form>
    </div>
  );
}
