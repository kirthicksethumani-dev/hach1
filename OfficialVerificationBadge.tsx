import React from 'react';
import { ShieldCheck, ShieldAlert, ExternalLink, Phone, Building2, HelpCircle } from 'lucide-react';
import { SchemeAnalysis } from '../types/scheme';

interface Props {
  scheme: SchemeAnalysis;
}

export const OfficialVerificationBadge: React.FC<Props> = ({ scheme }) => {
  const { officialSource, department, governmentLevel } = scheme;

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3 mb-3">
        <div className="flex items-center gap-2">
          {officialSource.isOfficialSourceDetected ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Official Government Scheme Detected</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
              <span>Unverified / Third-Party Notice</span>
            </div>
          )}

          <span className="text-xs font-medium text-slate-500 bg-slate-200/80 px-2 py-0.5 rounded-md">
            {governmentLevel}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
          <span>Green tags = Verified Official Data | Blue cards = AI Simplified Guidance</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs sm:text-sm">
        <div className="flex items-start gap-2.5">
          <Building2 className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Nodal Ministry / Department</div>
            <div className="font-semibold text-slate-800">{department || 'Central / State Ministry'}</div>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <ExternalLink className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Official Portal</div>
            {officialSource.websiteUrl ? (
              <a
                href={officialSource.websiteUrl.startsWith('http') ? officialSource.websiteUrl : `https://${officialSource.websiteUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-indigo-600 hover:text-indigo-800 underline inline-flex items-center gap-1 break-all"
              >
                <span>{officialSource.portalName || officialSource.websiteUrl}</span>
              </a>
            ) : (
              <span className="text-slate-600 font-medium">{officialSource.portalName || 'Local State Portal'}</span>
            )}
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <Phone className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Toll-Free Citizen Helpline</div>
            <div className="font-bold text-slate-800 font-mono">
              {officialSource.helpline || '1800-11-0001 / Dial 1947'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
