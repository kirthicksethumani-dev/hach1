import React from 'react';
import {
  Sparkles,
  Github,
  Globe,
  RotateCcw,
  Shield,
  Mic,
} from 'lucide-react';
import { LanguageSelector } from './LanguageSelector';
import { SupportedLanguage } from '../types/scheme';

interface Props {
  selectedLanguage: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  isLoading: boolean;
  onReset: () => void;
  hasActiveScheme: boolean;
  onOpenDeployModal: () => void;
  onOpenVoiceAssistant: () => void;
}

export const Header: React.FC<Props> = ({
  selectedLanguage,
  onLanguageChange,
  isLoading,
  onReset,
  hasActiveScheme,
  onOpenDeployModal,
  onOpenVoiceAssistant,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-3">
          {/* Logo & Identity */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <Shield className="w-5 h-5" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  SchemeGuide <span className="text-indigo-600">AI</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                  Citizen Welfare
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium truncate max-w-[190px] sm:max-w-sm">
                Multilingual Scheme Analyzer &amp; Eligibility
              </p>
            </div>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Full Voice Assistant Trigger */}
            <button
              type="button"
              onClick={onOpenVoiceAssistant}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white text-xs font-bold transition-all shadow-xs"
              title="Open Voice Assistant (Speak & Listen)"
            >
              <Mic className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>Voice Assistant</span>
            </button>

            {/* Language Selector */}
            <LanguageSelector
              selectedLanguage={selectedLanguage}
              onLanguageChange={onLanguageChange}
              isLoading={isLoading}
            />

            {/* GitHub Repo */}
            <button
              type="button"
              onClick={onOpenDeployModal}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all"
              title="View GitHub instructions & GitHub Pages settings"
            >
              <Github className="w-3.5 h-3.5 text-slate-800" />
              <span>hackerarena-kirthick</span>
            </button>

            {/* Reset Button */}
            {hasActiveScheme && (
              <button
                type="button"
                onClick={onReset}
                disabled={isLoading}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                title="Reset scheme analyzer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">New</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
