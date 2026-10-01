import React from 'react';
import { Route, CheckCircle, ExternalLink, ArrowRight } from 'lucide-react';
import { ApplicationStep, SchemeAnalysis } from '../types/scheme';

interface Props {
  steps: ApplicationStep[];
  scheme: SchemeAnalysis;
}

export const ApplicationProcess: React.FC<Props> = ({ steps, scheme }) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">
            <Route className="w-3.5 h-3.5 text-blue-600" />
            <span>Step-By-Step Walkthrough</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            How to Apply
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Follow this clear step sequence to submit your application and track approval status
          </p>
        </div>

        {scheme.officialSource.websiteUrl && (
          <a
            href={
              scheme.officialSource.websiteUrl.startsWith('http')
                ? scheme.officialSource.websiteUrl
                : `https://${scheme.officialSource.websiteUrl}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors self-start sm:self-auto"
          >
            <span>Open Official Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

      <div className="relative pl-6 sm:pl-8 border-l-2 border-indigo-100 space-y-6">
        {steps.map((step, idx) => (
          <div key={idx} className="relative group">
            {/* Step circle bullet */}
            <div className="absolute -left-[31px] sm:-left-[39px] top-0 w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center ring-4 ring-white shadow-xs group-hover:scale-110 transition-transform">
              {step.stepNumber || idx + 1}
            </div>

            <div className="bg-slate-50 hover:bg-white p-5 rounded-2xl border border-slate-200 transition-all hover:border-indigo-300 hover:shadow-xs">
              <h4 className="text-sm sm:text-base font-bold text-slate-900 mb-1">
                {step.title}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
