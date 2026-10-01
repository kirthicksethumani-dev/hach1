/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Sparkles,
  ShieldAlert,
  Award,
  RotateCcw,
  CheckCircle2,
  Gift,
  FileCheck,
  UserCheck,
  Route,
  Layers,
  FileText,
  Mic,
  Edit3,
} from 'lucide-react';
import { Header } from './components/Header';
import { UploadSection } from './components/UploadSection';
import { SchemeSummary } from './components/SchemeSummary';
import { BenefitsSection } from './components/BenefitsSection';
import { EligibilityChecker } from './components/EligibilityChecker';
import { DocumentsSection } from './components/DocumentsSection';
import { ApplicationProcess } from './components/ApplicationProcess';
import { OfficialVerificationBadge } from './components/OfficialVerificationBadge';
import { GitHubDeploymentModal } from './components/GitHubDeploymentModal';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { EditSchemeModal } from './components/EditSchemeModal';
import { SchemeAnalysis, SupportedLanguage, PresetScheme } from './types/scheme';
import { analyzeScheme, translateScheme } from './services/api';
import { PRESET_SCHEMES } from './utils/presets';

type ActiveTab = 'all' | 'summary' | 'benefits' | 'eligibility' | 'documents' | 'steps';

export default function App() {
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('en');
  const [activeScheme, setActiveScheme] = useState<SchemeAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('all');

  const handleAnalyze = async (
    fileBase64: string,
    mimeType: string,
    schemeText?: string
  ) => {
    setIsLoading(true);
    setError(null);
    setLoadingStage('Scanning document and extracting official guidelines...');

    try {
      const result = await analyzeScheme({
        fileBase64,
        mimeType,
        language: selectedLanguage,
        schemeText,
      });

      setActiveScheme(result);
      setTimeout(() => {
        document.getElementById('analysis-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      console.error('Analysis error:', err);
      setError(
        err?.message ||
          'Failed to analyze the document. Please ensure the image or PDF is clear, or select one of the presets.'
      );
    } finally {
      setIsLoading(false);
      setLoadingStage('');
    }
  };

  const handleSelectPreset = async (preset: PresetScheme) => {
    setError(null);
    if (selectedLanguage === 'en') {
      setActiveScheme(preset.precomputedData);
      setTimeout(() => {
        document.getElementById('analysis-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      setIsLoading(true);
      setLoadingStage(`Translating ${preset.title} to selected language...`);
      try {
        const translated = await translateScheme({
          schemeData: preset.precomputedData,
          targetLanguageCode: selectedLanguage,
        });
        setActiveScheme(translated);
        setTimeout(() => {
          document.getElementById('analysis-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } catch {
        setActiveScheme(preset.precomputedData);
      } finally {
        setIsLoading(false);
        setLoadingStage('');
      }
    }
  };

  const handleCustomSchemeCreated = (customScheme: SchemeAnalysis) => {
    setError(null);
    setActiveScheme(customScheme);
    setTimeout(() => {
      document.getElementById('analysis-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleLanguageChange = async (newLang: SupportedLanguage) => {
    setSelectedLanguage(newLang);

    if (activeScheme) {
      setIsLoading(true);
      setLoadingStage(`Translating scheme analysis into your chosen language...`);
      try {
        const translated = await translateScheme({
          schemeData: activeScheme,
          targetLanguageCode: newLang,
        });
        setActiveScheme(translated);
      } catch (err) {
        console.warn('Live translation notice:', err);
      } finally {
        setIsLoading(false);
        setLoadingStage('');
      }
    }
  };

  const handleReset = () => {
    setActiveScheme(null);
    setError(null);
    setActiveTab('all');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <Header
        selectedLanguage={selectedLanguage}
        onLanguageChange={handleLanguageChange}
        isLoading={isLoading}
        onReset={handleReset}
        hasActiveScheme={Boolean(activeScheme)}
        onOpenDeployModal={() => setIsDeployModalOpen(true)}
        onOpenVoiceAssistant={() => setIsVoiceModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Clean Hero */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold tracking-wide uppercase mb-2">
            <Award className="w-3.5 h-3.5 text-indigo-600" />
            <span>Digital India • Citizen Welfare AI</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Government Schemes,{' '}
            <span className="text-indigo-600">Simplified</span>
          </h1>

          <p className="mt-2 text-xs sm:text-sm text-slate-600">
            Upload any government scheme poster, circular photo, or PDF flyer. Get simplified citizen breakdowns, benefits, required documents, and check eligibility instantly.
          </p>

          <div className="mt-3 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setIsVoiceModalOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100/80 hover:bg-indigo-200/80 text-indigo-800 text-xs font-bold transition-all shadow-xs"
            >
              <Mic className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
              <span>Ask Mitra • Voice Assistant</span>
            </button>
          </div>
        </div>

        {/* Upload Card */}
        <UploadSection
          onAnalyze={handleAnalyze}
          onSelectPreset={handleSelectPreset}
          onCustomSchemeCreated={handleCustomSchemeCreated}
          isLoading={isLoading}
          selectedLanguage={selectedLanguage}
          onReset={handleReset}
          hasAnalyzedScheme={Boolean(activeScheme)}
        />

        {/* Loading Indicator */}
        {isLoading && (
          <div className="bg-white border border-indigo-100 rounded-2xl p-6 sm:p-8 mb-6 text-center shadow-xs">
            <div className="w-10 h-10 mx-auto mb-3 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            <h3 className="text-sm font-bold text-slate-900">
              Processing with AI
            </h3>
            <p className="text-xs text-indigo-600 font-medium mt-1">
              {loadingStage || 'Extracting official guidelines and simplifying terminology...'}
            </p>
          </div>
        )}

        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <strong className="font-bold block">Notice:</strong>
              <span>{error}</span>
            </div>
            <button
              type="button"
              onClick={() => setError(null)}
              className="text-xs font-bold text-rose-700 hover:text-rose-900"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Analysis Section */}
        {activeScheme && (
          <div id="analysis-section" className="space-y-4">
            {/* Official Source & Verification Badge */}
            <OfficialVerificationBadge scheme={activeScheme} />

            {/* Clean Section Navigation Tabs */}
            <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-2">
              <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-bold scrollbar-none">
                <button
                  type="button"
                  onClick={() => setActiveTab('all')}
                  className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    activeTab === 'all'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>All Details</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('summary')}
                  className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    activeTab === 'summary'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Summary &amp; Purpose</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('benefits')}
                  className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    activeTab === 'benefits'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Gift className="w-3.5 h-3.5" />
                  <span>Key Benefits</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('eligibility')}
                  className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    activeTab === 'eligibility'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Eligibility Checker</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('documents')}
                  className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    activeTab === 'documents'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>Documents</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('steps')}
                  className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    activeTab === 'steps'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Route className="w-3.5 h-3.5" />
                  <span>How to Apply</span>
                </button>
              </div>

              {/* User-Defined Text Customizer Button */}
              <button
                type="button"
                onClick={() => setIsEditModalOpen(true)}
                className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"
                title="Edit and customize any displayed scheme text"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Customize Text</span>
              </button>
            </div>

            {/* Tab Contents */}
            {(activeTab === 'all' || activeTab === 'summary') && (
              <SchemeSummary
                scheme={activeScheme}
                currentLanguage={selectedLanguage}
                onEditScheme={() => setIsEditModalOpen(true)}
              />
            )}

            {(activeTab === 'all' || activeTab === 'benefits') && (
              <BenefitsSection benefits={activeScheme.benefits} />
            )}

            {(activeTab === 'all' || activeTab === 'eligibility') && (
              <EligibilityChecker scheme={activeScheme} currentLanguage={selectedLanguage} />
            )}

            {(activeTab === 'all' || activeTab === 'documents') && (
              <DocumentsSection documents={activeScheme.requiredDocuments} />
            )}

            {(activeTab === 'all' || activeTab === 'steps') && (
              <ApplicationProcess steps={activeScheme.applicationProcess} scheme={activeScheme} />
            )}

            {/* Bottom Reset Banner */}
            <div className="p-4 bg-slate-100/80 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div>
                <h4 className="text-xs font-bold text-slate-800">
                  Analyze another government scheme or notification?
                </h4>
                <p className="text-[11px] text-slate-500">
                  Upload another poster photo, circular PDF, or try another preset.
                </p>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs text-white bg-slate-900 hover:bg-slate-800 transition-colors shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>New Scheme</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Floating Voice Assistant Trigger (Bottom Right) */}
      <div className="fixed bottom-5 right-5 z-40">
        <button
          type="button"
          onClick={() => setIsVoiceModalOpen(true)}
          className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-blue-700 text-white shadow-lg hover:shadow-indigo-300/50 hover:scale-105 active:scale-95 transition-all text-xs font-bold group"
          title="Open Voice Assistant (Mitra)"
        >
          <div className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center">
            <Mic className="w-4 h-4 text-amber-300 animate-pulse" />
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-[11px] font-black leading-tight">Mitra Voice</div>
            <div className="text-[9px] text-indigo-200 font-normal">Community Guide</div>
          </div>
        </button>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800">SchemeGuide AI</span>
              <span>•</span>
              <span>Repo: <code className="font-mono font-bold text-indigo-700">hackerarena-kirthick</code></span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsDeployModalOpen(true)}
                className="hover:text-indigo-600 font-semibold"
              >
                GitHub Pages Guide
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => setIsVoiceModalOpen(true)}
                className="hover:text-indigo-600 font-semibold flex items-center gap-1"
              >
                <Mic className="w-3 h-3 text-indigo-600" />
                <span>Voice Assistant</span>
              </button>
              <span>•</span>
              <span className="text-slate-400">Powered by Gemini AI</span>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-400 text-center">
            Advisory tool for public awareness. Final eligibility and financial disbursements are determined exclusively by official government departments.
          </div>
        </div>
      </footer>

      {/* Full Voice Assistant Dialog Modal */}
      <VoiceAssistantModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        activeScheme={activeScheme}
        currentLanguage={selectedLanguage}
      />

      {/* User-Defined Scheme Text Editor Modal */}
      {activeScheme && (
        <EditSchemeModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          scheme={activeScheme}
          onSave={(updated) => setActiveScheme(updated)}
        />
      )}

      {/* GitHub Deployment & Pages Setup Modal */}
      <GitHubDeploymentModal
        isOpen={isDeployModalOpen}
        onClose={() => setIsDeployModalOpen(false)}
      />
    </div>
  );
}
