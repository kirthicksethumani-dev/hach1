import React, { useState } from 'react';
import {
  X,
  Github,
  Terminal,
  Server,
  Globe,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  FolderTree,
  Zap,
} from 'lucide-react';
import { getCustomBackendUrl, setCustomBackendUrl } from '../services/api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubDeploymentModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'git' | 'pages' | 'backend' | 'structure'>('git');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [customBackend, setCustomBackend] = useState(getCustomBackendUrl());
  const [savedBackendSuccess, setSavedBackendSuccess] = useState(false);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSaveBackend = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomBackendUrl(customBackend);
    setSavedBackendSuccess(true);
    setTimeout(() => setSavedBackendSuccess(false), 2500);
  };

  const gitCommands = `# 1. Initialize git and configure repository
git init
git add .
git commit -m "feat: complete SchemeGuide AI application for hackerarena-kirthick"

# 2. Add your GitHub remote repository (replace YOUR-GITHUB-USERNAME)
git branch -M main
git remote add origin https://github.com/YOUR-GITHUB-USERNAME/hackerarena-kirthick.git

# 3. Push to GitHub
git push -u origin main`;

  const repoTree = `hackerarena-kirthick/
├── index.html                    # Web app entry point (Vite & GitHub Pages ready)
├── package.json                  # Dependencies & start scripts
├── server.ts                     # Secure Express backend with Gemini API proxy
├── .env.example                  # Environment configuration template
├── README.md                     # Complete project documentation & setup
├── metadata.json                 # AI Studio applet metadata
├── src/                          # Modern React + TypeScript source code
│   ├── App.tsx                   # Main SchemeGuide AI application orchestrator
│   ├── main.tsx                  # React entry point
│   ├── index.css                 # Tailwind CSS styling
│   ├── components/               # Modular UI components
│   │   ├── Header.tsx            # Navigation, branding & language bar
│   │   ├── UploadSection.tsx     # File/PDF drag & drop, previews & presets
│   │   ├── SchemeSummary.tsx     # Plain citizen summary & target beneficiaries
│   │   ├── BenefitsSection.tsx   # Advantages & monetary assistance
│   │   ├── EligibilityChecker.tsx# Dynamic interactive eligibility verification
│   │   ├── DocumentsSection.tsx  # Document readiness checklist with print
│   │   ├── ApplicationProcess.tsx# Step-by-step application walkthrough
│   │   ├── AudioPlayerButton.tsx # Multi-language text-to-speech reader
│   │   └── GitHubDeploymentModal.tsx # GitHub & Pages deployment guide
│   ├── services/
│   │   └── api.ts                # Gemini API client with backend fallback
│   ├── types/
│   │   └── scheme.ts             # TypeScript definitions
│   └── utils/
│       └── presets.ts            # Realistic pre-loaded government schemes
└── .github/
    └── workflows/
        └── deploy.yml            # Automated GitHub Actions workflow for Pages`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
              <Github className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold">GitHub &amp; Hosting Guide</h3>
                <span className="text-[10px] font-mono bg-indigo-500/30 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-400/30">
                  hackerarena-kirthick
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Exact instructions for GitHub repository upload, GitHub Pages hosting, and secure backend proxy
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 text-xs font-semibold overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('git')}
            className={`py-3 px-3.5 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'git'
                ? 'border-indigo-600 text-indigo-600 font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>1. Push to GitHub</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('pages')}
            className={`py-3 px-3.5 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'pages'
                ? 'border-indigo-600 text-indigo-600 font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>2. GitHub Pages Settings</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('backend')}
            className={`py-3 px-3.5 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'backend'
                ? 'border-indigo-600 text-indigo-600 font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>3. Backend &amp; API Security</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('structure')}
            className={`py-3 px-3.5 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'structure'
                ? 'border-indigo-600 text-indigo-600 font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FolderTree className="w-3.5 h-3.5" />
            <span>Repository Structure</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto text-sm text-slate-700">
          {activeTab === 'git' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-slate-900 mb-1">
                  Steps to Upload Files to Your GitHub Repository
                </h4>
                <p className="text-xs text-slate-600">
                  Target Repository: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-indigo-700 font-mono font-bold">hackerarena-kirthick</code>
                </p>
              </div>

              <div className="relative">
                <pre className="bg-slate-900 text-slate-100 p-4 rounded-2xl text-xs font-mono overflow-x-auto leading-relaxed">
                  {gitCommands}
                </pre>
                <button
                  type="button"
                  onClick={() => copyToClipboard(gitCommands, 'git')}
                  className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 border border-slate-700"
                >
                  {copiedKey === 'git' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Commands</span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-800 leading-relaxed">
                <strong>Tip:</strong> If the repository already exists on GitHub with a README, use <code className="bg-blue-100 px-1 py-0.5 rounded font-mono">git push -u origin main --force</code> or rebase before pushing.
              </div>
            </div>
          )}

          {activeTab === 'pages' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-slate-900 mb-1">
                  Exact GitHub Pages Setup Instructions
                </h4>
                <p className="text-xs text-slate-600">
                  Enable automatic free web hosting directly from your repository settings.
                </p>
              </div>

              <ol className="list-decimal list-inside space-y-2.5 text-xs sm:text-sm text-slate-800">
                <li className="pl-1">
                  Open your repository on GitHub:
                  <div className="mt-1 font-mono text-xs bg-slate-100 p-2 rounded-lg text-indigo-700">
                    https://github.com/YOUR-GITHUB-USERNAME/hackerarena-kirthick
                  </div>
                </li>
                <li className="pl-1">
                  Click on the <strong>Settings</strong> tab at the top of the repository.
                </li>
                <li className="pl-1">
                  In the left sidebar, navigate to <strong>Pages</strong> (under Code and automation).
                </li>
                <li className="pl-1">
                  Under <strong>Build and deployment &gt; Source</strong>:
                  <ul className="list-disc list-inside ml-4 mt-1 space-y-1 text-slate-600 text-xs">
                    <li>Select <strong>GitHub Actions</strong> (if using our included automated workflow)</li>
                    <li>OR select <strong>Deploy from a branch</strong> &gt; Branch: <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">main</code> / Folder: <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">/ (root)</code></li>
                  </ul>
                </li>
                <li className="pl-1">
                  Click <strong>Save</strong>. In 1-2 minutes, GitHub will publish your site!
                </li>
              </ol>

              {/* URL Format Requirement */}
              <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block mb-1">
                  Your Expected Live GitHub Pages URL:
                </span>
                <div className="text-sm font-mono font-bold text-emerald-900 bg-white/80 p-2.5 rounded-xl border border-emerald-200 break-all">
                  https://YOUR-GITHUB-USERNAME.github.io/hackerarena-kirthick/
                </div>
              </div>
            </div>
          )}

          {activeTab === 'backend' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-slate-900 mb-1">
                  Connecting the Hosted Website to the AI Backend Securely
                </h4>
                <p className="text-xs text-slate-600">
                  How SchemeGuide AI preserves API security while running on GitHub Pages:
                </p>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-slate-700">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5 mb-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Zero Client-Side API Key Exposure</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Under no circumstances is <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">GEMINI_API_KEY</code> ever included in frontend code or bundled in GitHub Pages. The browser only sends requests to proxy endpoints (<code className="bg-slate-100 px-1 py-0.5 rounded font-mono">/api/analyze-scheme</code>).
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5 mb-1">
                    <Server className="w-4 h-4 text-indigo-600" />
                    <span>Backend Hosting Options</span>
                  </div>
                  <ul className="list-disc list-inside text-xs text-slate-600 space-y-1">
                    <li>
                      <strong>Option A (Google AI Studio Preview / Cloud Run):</strong> The app works right out of the box with the hosted URL.
                    </li>
                    <li>
                      <strong>Option B (Deploy backend on Render / Railway / Cloud Run):</strong> Deploy <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">server.ts</code> with 1 command. Set <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">GEMINI_API_KEY</code> as an environment variable in the dashboard.
                    </li>
                  </ul>
                </div>
              </div>

              {/* In-app Backend URL Connector */}
              <div className="border border-indigo-200 bg-indigo-50/50 rounded-2xl p-4">
                <h5 className="text-xs font-bold uppercase tracking-wider text-indigo-900 mb-1">
                  Connect Custom Backend URL (Optional for GitHub Pages):
                </h5>
                <p className="text-xs text-slate-600 mb-3">
                  If you deploy the backend to a separate service, paste its base URL below:
                </p>

                <form onSubmit={handleSaveBackend} className="flex gap-2">
                  <input
                    type="url"
                    value={customBackend}
                    onChange={(e) => setCustomBackend(e.target.value)}
                    placeholder="https://your-backend-api.onrender.com"
                    className="flex-1 text-xs px-3 py-2 rounded-xl border border-indigo-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-300"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0"
                  >
                    Save URL
                  </button>
                </form>

                {savedBackendSuccess && (
                  <span className="text-[11px] text-emerald-700 font-semibold mt-1.5 block">
                    ✓ Custom backend URL saved to localStorage!
                  </span>
                )}
              </div>
            </div>
          )}

          {activeTab === 'structure' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-slate-900 mb-1">
                  Clean GitHub Repository Structure
                </h4>
                <p className="text-xs text-slate-600">
                  Full codebase mapped into a clean, modern, hackathon-grade directory layout:
                </p>
              </div>

              <div className="relative">
                <pre className="bg-slate-900 text-emerald-400 p-4 rounded-2xl text-xs font-mono overflow-x-auto leading-relaxed max-h-80">
                  {repoTree}
                </pre>
                <button
                  type="button"
                  onClick={() => copyToClipboard(repoTree, 'tree')}
                  className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 border border-slate-700"
                >
                  {copiedKey === 'tree' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Tree</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">
            Ready for submission &amp; public demonstration
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
