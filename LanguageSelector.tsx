import React from 'react';
import { Globe } from 'lucide-react';
import { SupportedLanguage, SUPPORTED_LANGUAGES } from '../types/scheme';

interface Props {
  selectedLanguage: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  isLoading?: boolean;
}

export const LanguageSelector: React.FC<Props> = ({
  selectedLanguage,
  onLanguageChange,
  isLoading = false,
}) => {
  return (
    <div className="relative inline-flex items-center">
      <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 shadow-xs hover:border-indigo-300 transition-colors">
        <Globe className="w-4 h-4 text-indigo-600 shrink-0" />
        <select
          value={selectedLanguage}
          onChange={(e) => onLanguageChange(e.target.value as SupportedLanguage)}
          disabled={isLoading}
          aria-label="Select Language"
          className="bg-transparent text-sm font-medium text-slate-800 focus:outline-hidden cursor-pointer disabled:opacity-50 pr-2"
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name} ({lang.nativeName})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
