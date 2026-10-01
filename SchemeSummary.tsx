import React from 'react';
import {
  FileText,
  Users,
  AlertTriangle,
  Info,
  Calendar,
  Wallet,
  Briefcase,
  MapPin,
  CheckCircle2,
  Sparkles,
  Edit3,
} from 'lucide-react';
import { SchemeAnalysis, SupportedLanguage } from '../types/scheme';
import { AudioPlayerButton } from './AudioPlayerButton';

interface Props {
  scheme: SchemeAnalysis;
  currentLanguage: SupportedLanguage;
  onEditScheme?: () => void;
}

export const SchemeSummary: React.FC<Props> = ({
  scheme,
  currentLanguage,
  onEditScheme,
}) => {
  const {
    schemeName,
    nativeSchemeName,
    department,
    governmentLevel,
    stateOrRegion,
    mainPurpose,
    simpleExplanation,
    targetBeneficiaries,
    eligibilityCriteria,
    importantConditions,
    warningsAndCaveats,
  } = scheme;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 mb-8">
      {/* Title & Badge Header */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 border-b border-slate-100 pb-6 mb-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-100">
              {governmentLevel}
            </span>
            {stateOrRegion && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700">
                <MapPin className="w-3 h-3 text-slate-500" />
                <span>{stateOrRegion}</span>
              </span>
            )}
            <span className="text-xs text-slate-500 font-medium">
              Dept: {department}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {schemeName}
          </h1>

          {nativeSchemeName && nativeSchemeName !== schemeName && (
            <div className="text-base sm:text-lg font-bold text-indigo-700 mt-1">
              {nativeSchemeName}
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="shrink-0 flex items-center gap-2">
          {onEditScheme && (
            <button
              type="button"
              onClick={onEditScheme}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              title="Customize or edit scheme text directly"
            >
              <Edit3 className="w-3.5 h-3.5 text-slate-500" />
              <span>Edit Text</span>
            </button>
          )}

          <AudioPlayerButton
            textToRead={`${schemeName}. ${simpleExplanation}`}
            language={currentLanguage}
            label="Listen in your language"
          />
        </div>
      </div>

      {/* Simplified Citizen Explanation Hero Card */}
      <div className="bg-gradient-to-br from-indigo-50/70 via-blue-50/50 to-slate-50 border border-indigo-100/80 rounded-2xl p-5 sm:p-6 mb-6">
        <div className="flex items-center gap-2 text-indigo-900 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>Simplified 1-Minute Citizen Summary</span>
        </div>
        <p className="text-base sm:text-lg text-slate-800 leading-relaxed font-medium">
          {simpleExplanation}
        </p>

        {mainPurpose && mainPurpose !== simpleExplanation && (
          <div className="mt-3 pt-3 border-t border-indigo-100/60 text-xs sm:text-sm text-slate-600 flex items-start gap-2">
            <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
            <span>
              <strong className="text-slate-800">Primary Objective:</strong> {mainPurpose}
            </span>
          </div>
        )}
      </div>

      {/* Target Beneficiaries & Key Eligibility at a glance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Who Can Apply */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-indigo-600" />
            <span>Who Can Apply (Target Beneficiaries)</span>
          </h3>
          <ul className="space-y-2">
            {targetBeneficiaries.map((beneficiary, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <span>{beneficiary}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Eligibility Snapshot */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4 text-indigo-600" />
            <span>Eligibility Criteria At A Glance</span>
          </h3>
          <div className="space-y-2.5 text-xs sm:text-sm">
            <div className="flex items-start gap-2">
              <Calendar className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-900">Age: </span>
                <span className="text-slate-700">{eligibilityCriteria.ageRequirement || 'No strict age limitation'}</span>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Wallet className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-900">Income Limit: </span>
                <span className="text-slate-700">{eligibilityCriteria.incomeRequirement || 'Not restricted by income'}</span>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Briefcase className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-900">Occupation / Role: </span>
                <span className="text-slate-700">{eligibilityCriteria.occupationRequirement || 'All occupations eligible'}</span>
              </div>
            </div>

            {eligibilityCriteria.genderRequirement && (
              <div className="flex items-start gap-2">
                <Users className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-900">Gender / Group: </span>
                  <span className="text-slate-700">{eligibilityCriteria.genderRequirement}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Important Conditions & Warnings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {importantConditions && importantConditions.length > 0 && (
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs sm:text-sm text-amber-900">
            <div className="font-bold flex items-center gap-2 mb-2 text-amber-800">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Important Rules &amp; Conditions</span>
            </div>
            <ul className="space-y-1.5 list-disc list-inside text-amber-950/80">
              {importantConditions.map((cond, i) => (
                <li key={i}>{cond}</li>
              ))}
            </ul>
          </div>
        )}

        {warningsAndCaveats && warningsAndCaveats.length > 0 && (
          <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200/80 text-xs sm:text-sm text-rose-900">
            <div className="font-bold flex items-center gap-2 mb-2 text-rose-800">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Anti-Fraud &amp; Middlemen Caution</span>
            </div>
            <ul className="space-y-1.5 list-disc list-inside text-rose-950/80">
              {warningsAndCaveats.map((warn, i) => (
                <li key={i}>{warn}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
