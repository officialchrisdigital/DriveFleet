import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export function AccessDeniedPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-8 sm:p-12 max-w-lg w-full text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-100">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 font-mono">
            Error 403 • Role Access Denied
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Restricted Operational Deck Area
          </h1>
          <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
            You do not possess the required administrator or staff credentials to access this operational ledger or confidential record.
          </p>
        </div>

        <div className="pt-2 flex justify-center gap-3">
          <Link
            to="/"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-8 sm:p-12 max-w-lg w-full text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center mx-auto border border-slate-200">
          <span className="text-2xl font-black">404</span>
        </div>
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
            Resource Not Found
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Route or Vehicle Dossier Missing
          </h1>
          <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
            The requested booking reference, vehicle plate, or system page could not be located in the master fleet database.
          </p>
        </div>

        <div className="pt-2 flex justify-center gap-3">
          <Link
            to="/vehicles"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm transition-colors"
          >
            Browse Available Vehicles
          </Link>
        </div>
      </div>
    </div>
  );
}
