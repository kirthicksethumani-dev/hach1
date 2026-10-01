import React, { useRef, useState } from 'react';
import {
  UploadCloud,
  FileText,
  ImageIcon,
  CheckCircle2,
  X,
  Sparkles,
  Zap,
  ArrowRight,
  Eye,
  FileCheck,
  Edit3,
} from 'lucide-react';
import { PRESET_SCHEMES } from '../utils/presets';
import { PresetScheme, SupportedLanguage, SchemeAnalysis } from '../types/scheme';

interface Props {
  onAnalyze: (fileBase64: string, mimeType: string, schemeText?: string) => Promise<void>;
  onSelectPreset: (preset: PresetScheme) => void;
  onCustomSchemeCreated?: (scheme: SchemeAnalysis) => void;
  isLoading: boolean;
  selectedLanguage: SupportedLanguage;
  onReset: () => void;
  hasAnalyzedScheme: boolean;
}

export const UploadSection: React.FC<Props> = ({
  onAnalyze,
  onSelectPreset,
  onCustomSchemeCreated,
  isLoading,
  selectedLanguage,
  onReset,
  hasAnalyzedScheme,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    size: string;
    mimeType: string;
    base64: string;
    isPdf: boolean;
  } | null>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'text' | 'custom'>('upload');
  const [textInput, setTextInput] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // User-Defined Scheme Form State
  const [customScheme, setCustomScheme] = useState({
    name: '',
    department: '',
    benefit: '',
    eligibility: '',
    age: '18+',
    income: '< ₹2.5 Lakhs',
  });

  const handleFiles = (file: File) => {
    setErrorMessage(null);
    const validMimes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/svg+xml',
      'application/pdf',
    ];

    if (!validMimes.includes(file.type) && !file.name.endsWith('.pdf')) {
      setErrorMessage('Unsupported file. Please upload a PNG, JPG, WebP image or a PDF document.');
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setErrorMessage('File exceeds 25MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      const isPdf = file.type === 'application/pdf' || file.name.endsWith('.pdf');
      setSelectedFile({
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB',
        mimeType: isPdf ? 'application/pdf' : file.type,
        base64,
        isPdf,
      });
    };
    reader.onerror = () => {
      setErrorMessage('Failed to read file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files[0]);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setTextInput('');
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onReset();
  };

  const triggerAnalyze = () => {
    if (!selectedFile && !textInput.trim()) {
      setErrorMessage('Please upload a scheme poster, PDF or paste scheme text to analyze.');
      return;
    }

    if (selectedFile) {
      onAnalyze(selectedFile.base64, selectedFile.mimeType, textInput.trim());
    } else {
      onAnalyze('', 'text/plain', textInput.trim());
    }
  };

  const handleCreateCustomScheme = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customScheme.name.trim()) {
      setErrorMessage('Please enter a Scheme Name.');
      return;
    }

    const newScheme: SchemeAnalysis = {
      id: 'custom_' + Date.now(),
      schemeName: customScheme.name.trim(),
      nativeSchemeName: customScheme.name.trim(),
      department: customScheme.department.trim() || 'Department of Citizen Welfare',
      governmentLevel: 'Central Government',
      stateOrRegion: 'All India',
      mainPurpose: customScheme.benefit || 'Direct assistance to eligible citizens.',
      simpleExplanation: `${customScheme.name} is a welfare initiative designed to provide ${customScheme.benefit || 'vital economic assistance'}. Eligible applicants receive direct benefits upon verification.`,
      targetBeneficiaries: [customScheme.eligibility || 'Eligible citizen applicants', 'Low and middle income households'],
      eligibilityCriteria: {
        ageRequirement: customScheme.age || '18 years and above',
        incomeRequirement: customScheme.income || 'Standard criteria',
        occupationRequirement: customScheme.eligibility || 'Open to all qualifying citizens',
        stateApplicability: 'Applicable in eligible regions',
        otherConditions: ['Aadhaar linkage required', 'Active bank account with NPCI mapping']
      },
      benefits: [
        {
          title: 'Direct Scheme Assistance',
          description: customScheme.benefit || 'Financial or institutional support.',
          amountOrValue: 'As per scheme scale',
          category: 'Direct Benefit'
        }
      ],
      requiredDocuments: [
        { documentName: 'Aadhaar Card', purpose: 'Identity & e-KYC proof', isMandatory: true },
        { documentName: 'Bank Passbook', purpose: 'Direct Benefit Transfer (DBT)', isMandatory: true },
        { documentName: 'Income / Category Certificate', purpose: 'Eligibility verification', isMandatory: false }
      ],
      applicationProcess: [
        { stepNumber: 1, title: 'Portal Registration', description: 'Visit the nodal government portal or local service centre.' },
        { stepNumber: 2, title: 'Submit Application', description: 'Fill application form with Aadhaar and required details.' },
        { stepNumber: 3, title: 'Approval & Sanction', description: 'Field verification and direct disbursement.' }
      ],
      officialSource: {
        isOfficialSourceDetected: true,
        portalName: 'National Government Services Portal',
        websiteUrl: 'https://services.india.gov.in',
        helpline: '1800-11-0001',
        sourceNotes: 'User-defined verified scheme parameters.'
      },
      importantConditions: ['e-KYC must be completed.', 'Keep original documents ready.'],
      warningsAndCaveats: ['Government registration is free of charge. Beware of unofficial agents.'],
      dynamicQuestions: [
        { id: 'q1', question: 'Do you meet the stated age and residency requirement?', type: 'boolean', helpText: 'Mandatory qualification.' }
      ],
      detectedLanguage: selectedLanguage
    };

    if (onCustomSchemeCreated) {
      onCustomSchemeCreated(newScheme);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6 mb-8 transition-all">
      {/* Quick Test Presets Bar */}
      <div className="mb-5 pb-5 border-b border-slate-100">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>Quick Test with Official Schemes:</span>
          </span>
          <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
            1-Click Instant Load
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {PRESET_SCHEMES.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => {
                setSelectedFile({
                  name: preset.mockFileName,
                  size: '420 KB',
                  mimeType: 'image/svg+xml',
                  base64: preset.thumbnail,
                  isPdf: false,
                });
                onSelectPreset(preset);
              }}
              disabled={isLoading}
              className="text-left p-3 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-indigo-400 hover:shadow-xs transition-all disabled:opacity-50 group"
            >
              <div className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 truncate">
                {preset.title}
              </div>
              <div className="text-[11px] text-slate-500 truncate mt-0.5">
                {preset.tagline.slice(0, 32)}...
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Upload Header & Tab switch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Upload or Define Scheme
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Choose an image/PDF document, paste an announcement, or define custom text directly
          </p>
        </div>

        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold self-start sm:self-auto overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'upload' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Image / PDF</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('text')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'text' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Paste Text</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('custom')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'custom' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-indigo-600'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>User-Defined</span>
          </button>
        </div>
      </div>

      {/* Upload Tab */}
      {activeTab === 'upload' && (
        <div>
          {!selectedFile ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 sm:p-10 text-center cursor-pointer transition-all ${
                dragActive
                  ? 'border-indigo-500 bg-indigo-50/50'
                  : 'border-slate-300 hover:border-indigo-400 bg-slate-50/50 hover:bg-slate-50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,application/pdf"
                onChange={(e) => e.target.files?.[0] && handleFiles(e.target.files[0])}
                className="hidden"
              />

              <div className="w-12 h-12 mx-auto mb-2.5 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <UploadCloud className="w-6 h-6" />
              </div>

              <div className="text-sm font-bold text-slate-800">
                Click to browse or drop document
              </div>
              <p className="text-xs text-slate-500 mt-1">
                PNG, JPG, WebP poster photos or PDF circulars up to 25MB
              </p>
            </div>
          ) : (
            <div className="border border-slate-200 bg-slate-50/80 rounded-xl p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-lg bg-white border border-slate-200 shrink-0 flex items-center justify-center overflow-hidden">
                    {selectedFile.isPdf ? (
                      <span className="text-xs font-black text-rose-600">PDF</span>
                    ) : (
                      <img
                        src={selectedFile.base64}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 truncate">
                      {selectedFile.name}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {selectedFile.size} • Ready for AI analysis
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                    className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-300 hover:bg-white text-slate-700"
                  >
                    Change
                  </button>
                  <button
                    type="button"
                    onClick={handleClear}
                    disabled={isLoading}
                    className="text-xs font-semibold p-1.5 rounded-lg text-rose-600 hover:bg-rose-50"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {!selectedFile.isPdf && (
                <details className="mt-3 pt-3 border-t border-slate-200 text-xs text-slate-600">
                  <summary className="cursor-pointer font-semibold flex items-center gap-1 hover:text-indigo-600">
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Poster Image</span>
                  </summary>
                  <div className="mt-2 p-2 bg-slate-900 rounded-lg flex justify-center">
                    <img
                      src={selectedFile.base64}
                      alt="Full poster"
                      className="max-h-60 object-contain rounded"
                    />
                  </div>
                </details>
              )}
            </div>
          )}
        </div>
      )}

      {/* Paste Text Tab */}
      {activeTab === 'text' && (
        <div>
          <textarea
            rows={4}
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Paste scheme announcement, circular text, or eligibility rules..."
            className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-hidden transition-all"
          />
        </div>
      )}

      {/* User-Defined Custom Scheme Tab */}
      {activeTab === 'custom' && (
        <form onSubmit={handleCreateCustomScheme} className="space-y-3 bg-indigo-50/40 p-4 rounded-xl border border-indigo-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                Scheme Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Free Agriculture Solar Pump Yojana"
                value={customScheme.name}
                onChange={(e) => setCustomScheme({ ...customScheme, name: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                Ministry / Department
              </label>
              <input
                type="text"
                placeholder="e.g. Ministry of New & Renewable Energy"
                value={customScheme.department}
                onChange={(e) => setCustomScheme({ ...customScheme, department: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
              Key Benefit / Monetary Amount
            </label>
            <input
              type="text"
              placeholder="e.g. 60% subsidy on solar pump setup (worth up to ₹1,20,000)"
              value={customScheme.benefit}
              onChange={(e) => setCustomScheme({ ...customScheme, benefit: e.target.value })}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                Target Group
              </label>
              <input
                type="text"
                placeholder="e.g. Farmers with land records"
                value={customScheme.eligibility}
                onChange={(e) => setCustomScheme({ ...customScheme, eligibility: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                Age Requirement
              </label>
              <input
                type="text"
                value={customScheme.age}
                onChange={(e) => setCustomScheme({ ...customScheme, age: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                Income Ceiling
              </label>
              <input
                type="text"
                value={customScheme.income}
                onChange={(e) => setCustomScheme({ ...customScheme, income: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
            >
              Generate User-Defined Guide (Instant)
            </button>
          </div>
        </form>
      )}

      {errorMessage && (
        <div className="mt-3 p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center justify-between">
          <span>{errorMessage}</span>
          <button type="button" onClick={() => setErrorMessage(null)}>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Action Footer for upload and text tabs */}
      {activeTab !== 'custom' && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Automatic detection of income, age, benefits &amp; official helpline</span>
          </span>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {hasAnalyzedScheme && (
              <button
                type="button"
                onClick={handleClear}
                disabled={isLoading}
                className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700"
              >
                Reset
              </button>
            )}

            <button
              type="button"
              onClick={triggerAnalyze}
              disabled={isLoading || (!selectedFile && !textInput.trim())}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white transition-all ${
                isLoading || (!selectedFile && !textInput.trim())
                  ? 'bg-slate-300 cursor-not-allowed text-slate-500'
                  : 'bg-indigo-600 hover:bg-indigo-700 active:scale-98 shadow-xs'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze Scheme</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
