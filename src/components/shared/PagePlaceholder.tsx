import React from 'react';
import { Link } from 'react-router-dom';

interface PagePlaceholderProps {
  title: string;
  subtitle?: string;
  routeCode?: string;
  actions?: { label: string; to: string; primary?: boolean }[];
}

export function PagePlaceholder({ title, subtitle, routeCode, actions }: PagePlaceholderProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-slate-900">{title}</h1>
            {routeCode && (
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                {routeCode}
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500">
            {subtitle || 'This module is scheduled for implementation in this development milestone.'}
          </p>
        </div>

        {actions && (
          <div className="flex items-center gap-2 shrink-0">
            {actions.map((act, i) => (
              <Link
                key={i}
                to={act.to}
                className={`text-xs font-medium px-3 py-2 rounded-lg transition-colors ${
                  act.primary
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {act.label}
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="py-12 flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg mb-3">
          DF
        </div>
        <h3 className="text-sm font-semibold text-slate-800 mb-1">Ready for Implementation</h3>
        <p className="text-xs text-slate-500 max-w-md">
          All routes, layout architecture, role guards, and data contracts are active and ready.
        </p>
      </div>
    </div>
  );
}
