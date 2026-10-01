import React from 'react';
import { Gift, CheckCircle, TrendingUp, IndianRupee, ShieldCheck, HeartHandshake } from 'lucide-react';
import { SchemeBenefit } from '../types/scheme';

interface Props {
  benefits: SchemeBenefit[];
}

export const BenefitsSection: React.FC<Props> = ({ benefits }) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2">
            <Gift className="w-3.5 h-3.5 text-emerald-600" />
            <span>Key Advantages</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Scheme Benefits &amp; Financial Assistance
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Key entitlements and assistance provided to eligible citizens under this program
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {benefits.map((benefit, idx) => (
          <div
            key={idx}
            className="flex flex-col justify-between p-5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-indigo-300 hover:shadow-sm transition-all"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                  #{idx + 1}
                </span>

                {benefit.amountOrValue && (
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-extrabold">
                    {benefit.amountOrValue}
                  </span>
                )}
              </div>

              <h4 className="text-sm font-bold text-slate-900 mb-1.5">
                {benefit.title}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {benefit.description}
              </p>
            </div>

            {benefit.category && (
              <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>{benefit.category}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
