import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useOperations } from '@/contexts/OperationsContext';
import { formatCurrency } from '@/lib/formatters';
import {
  Users, ArrowLeft, ShieldCheck, Mail, Phone,
  Building, Calendar, FileText, Plus, Edit, Bookmark,
  CheckCircle2, Clock, Car, ChevronRight
} from 'lucide-react';

export function CustomerDetailPage() {
  const { customerId } = useParams<{ customerId: string }>();
  const { customers, bookings, updateCustomer } = useOperations();
  const navigate = useNavigate();

  const customer = customers.find((c) => c.id === customerId);
  const [newNote, setNewNote] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);

  if (!customer) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h2 className="text-base font-bold text-slate-900">Customer Dossier Not Found</h2>
        <p className="text-xs text-slate-500 mt-1">The requested customer record does not exist or was deleted.</p>
        <Link
          to="/admin/customers"
          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Customer CRM
        </Link>
      </div>
    );
  }

  const customerBookings = bookings.filter((b) => b.customerId === customer.id);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    const updatedNotes = [
      ...(customer.notes || []),
      {
        id: `note-${Date.now()}`,
        customerId: customer.id,
        authorId: 'staff',
        authorName: 'Operations Officer',
        content: newNote.trim(),
        createdAt: new Date().toISOString(),
      },
    ];

    updateCustomer(customer.id, {
      notes: updatedNotes,
      notesCount: updatedNotes.length,
    });

    setNewNote('');
    setIsAddingNote(false);
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'vip':
        return (
          <span className="text-[10px] font-bold text-violet-700 bg-violet-50 border border-violet-200 px-2.5 py-0.5 rounded-full uppercase">
            VIP Corporate
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
    <div className="space-y-6 max-w-5xl">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/customers"
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                {customer.firstName} {customer.lastName}
              </h1>
              {getStatusBadge(customer.status)}
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-mono">Dossier Ref: {customer.id}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/admin/customers/${customer.id}/edit`}
            className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </Link>

          <Link
            to={`/admin/bookings/new?customerId=${customer.id}`}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>+ Staff-Assisted Booking</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Customer Card & FRSC License */}
        <div className="space-y-6">
          {/* Contact Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full overflow-hidden bg-blue-100 text-blue-700 font-bold text-lg flex items-center justify-center shrink-0 border border-blue-200 shadow-sm ring-2 ring-slate-100">
                {customer.avatarUrl ? (
                  <img
                    src={customer.avatarUrl}
                    alt={`${customer.firstName} ${customer.lastName}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <span>
                    {customer.firstName[0]}
                    {customer.lastName[0]}
                  </span>
                )}
              </div>
              <div>
                <div className="font-bold text-slate-900 text-sm">
                  {customer.firstName} {customer.lastName}
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  {customer.company || 'Private Account'}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-2.5 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="font-mono">{customer.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{customer.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Enrolled: {new Date(customer.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* FRSC License Details */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Driver License Vault</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Verified Clear
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] block uppercase font-bold">FRSC License No</span>
                <span className="font-mono font-bold text-slate-900 text-sm">
                  {customer.renterDetails?.licenseNumber || 'Online Pending'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block uppercase font-bold">Expiry Date</span>
                <span className="font-semibold text-slate-800">
                  {customer.renterDetails?.licenseExpiry || 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block uppercase font-bold">Issuing Authority</span>
                <span className="font-semibold text-slate-800">
                  Federal Road Safety Corps (FRSC), Nigeria
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (2 cols): Notes & Booking History */}
        <div className="lg:col-span-2 space-y-6">
          {/* Private Staff Notes */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Staff Operations Audit Notes</span>
              </div>
              <button
                type="button"
                onClick={() => setIsAddingNote(!isAddingNote)}
                className="text-xs font-bold text-blue-600 hover:text-blue-700"
              >
                {isAddingNote ? 'Cancel' : '+ Add Note'}
              </button>
            </div>

            {isAddingNote && (
              <form onSubmit={handleAddNote} className="space-y-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <textarea
                  rows={2}
                  required
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Record dispatch observation, VIP chauffeur preference, or incident note..."
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs"
                >
                  Save Note
                </button>
              </form>
            )}

            <div className="space-y-2">
              {!customer.notes || customer.notes.length === 0 ? (
                <p className="text-xs text-slate-400 py-2 italic">No operational notes recorded yet.</p>
              ) : (
                customer.notes.map((note) => (
                  <div key={note.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                    <p className="text-slate-800 font-medium leading-relaxed">{note.content}</p>
                    <div className="text-[10px] text-slate-400 mt-2 flex items-center justify-between">
                      <span>Logged by: {note.authorName || 'Duty Staff'}</span>
                      <span>{new Date(note.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Rental History Ledger */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <Bookmark className="w-4 h-4 text-blue-600" />
                <span>Rental & Reservation History ({customerBookings.length})</span>
              </div>
            </div>

            {customerBookings.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                No past or active rentals recorded for this customer yet.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 text-xs">
                {customerBookings.map((b) => (
                  <div
                    key={b.id}
                    onClick={() => navigate(`/admin/bookings/${b.id}`)}
                    className="py-3 flex items-center justify-between hover:bg-slate-50 px-2 rounded-lg cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="font-bold text-slate-900 font-mono text-xs flex items-center gap-2">
                        <span>{b.reference}</span>
                        <span
                          className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            b.status === 'confirmed'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : b.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {b.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {new Date(b.pickupAt).toLocaleDateString()} – {new Date(b.returnAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="text-right flex items-center gap-3">
                      <div>
                        <div className="font-bold text-slate-900">
                          {formatCurrency(b.quote?.totalMinor || 0)}
                        </div>
                        <div className="text-[10px] text-slate-400 capitalize">{b.sourceChannel} Channel</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
