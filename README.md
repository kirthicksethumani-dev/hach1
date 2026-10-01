# SchemeGuide AI 🛡️🇮🇳

> **Citizen-First Government Welfare Scheme Analyzer & Multilingual Eligibility Assistant**  
> Built for hackathons, public service, and direct citizen empowerment.

[![Deploy to GitHub Pages](https://github.com/YOUR-GITHUB-USERNAME/hackerarena-kirthick/actions/workflows/deploy.yml/badge.svg)](https://YOUR-GITHUB-USERNAME.github.io/hackerarena-kirthick/)
[![Powered by Gemini](https://img.shields.io/badge/Powered%20By-Google%20Gemini%203.8%20Flash-4f46e5)](https://ai.google.dev/)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)

---

## 🌟 Overview

**SchemeGuide AI** empowers ordinary citizens to understand and apply for government welfare schemes without confusing bureaucratic jargon, predatory middlemen, or language barriers. 

Users upload an image, poster, circular photo, or official PDF of any central or state government scheme. The application leverages **Google Gemini 3.8 Flash** to extract crucial guidelines, translate them into regional Indian languages, and provide an interactive eligibility test with a personalized verdict.

---

## 🚀 Key Features

1. **Multi-Format Document Upload**:
   - Accepts PNG, JPG, WebP posters, social media announcements, newspaper circulars, and PDF documents.
   - Built-in drag-and-drop zone and instant document preview.
   - 4 pre-loaded flagship scheme posters (PM-Kisan, Ayushman Bharat PM-JAY, Mudra Yojana, Sukanya Samriddhi Yojana) for instant 1-click evaluation.

2. **AI Scheme Analysis**:
   - **Scheme Name & Native Title** (in chosen regional script)
   - **Government Level & Nodal Ministry** (Central / State / Joint)
   - **Simplified 1-Minute Citizen Summary** (avoids complicated terminology)
   - **Target Beneficiaries & Who Can Apply**
   - **Age, Income, and Occupation Requirements**
   - **Key Advantages & Monetary Assistance**
   - **Required Documents Checklist** with interactive check-off and print capability
   - **Step-by-Step Application Walkthrough**
   - **Official Verification Badge**: Clearly distinguishes verified government portal data (`.gov.in`, `.nic.in`, toll-free helplines) from advisory AI text.

3. **Interactive Eligibility Checker**:
   - Evaluates citizen profile (Age, State/UT, Occupation, Annual Income, Social Category, Gender).
   - Dynamically asks scheme-specific verification questions detected directly by the AI.
   - Delivers high-impact verdicts:
     - 🟢 **Eligible**
     - 🟡 **Possibly Eligible / Needs Verification**
     - 🔴 **Not Eligible**
   - Detailed criteria breakdown and next recommended steps.
   - **Strict Disclaimer**: Clearly reinforces that final sanction is determined exclusively by the authorized government nodal officer.

4. **Multi-Language Accessibility (6 Languages)**:
   - English
   - Tamil (தமிழ்)
   - Hindi (हिन्दी)
   - Telugu (తెలుగు)
   - Malayalam (മലയാളം)
   - Kannada (ಕನ್ನಡ)
   - Integrated **Text-to-Speech (TTS) Voice Narration** for elderly and rural citizens.

---

## 📁 Repository Structure (`hackerarena-kirthick`)

```text
hackerarena-kirthick/
├── index.html                    # Root entry point (Vite & GitHub Pages ready)
├── package.json                  # Dependencies & scripts
├── server.ts                     # Secure Express backend with Gemini API proxy
├── vite.config.ts                # Vite config (relative base path for GitHub Pages)
├── .env.example                  # Environment configuration template
├── README.md                     # Complete project documentation
├── metadata.json                 # AI Studio applet metadata
├── .github/
│   └── workflows/
│       └── deploy.yml            # Automated GitHub Actions workflow for Pages
├── src/                          # React + TypeScript source code
│   ├── App.tsx                   # Main SchemeGuide AI application orchestrator
│   ├── main.tsx                  # React entry point
│   ├── index.css                 # Tailwind CSS styling
│   ├── components/               # Modular UI components
│   │   ├── Header.tsx            # Header, brand, language picker & deploy guide
│   │   ├── UploadSection.tsx     # File/PDF drag & drop, previews & presets
│   │   ├── SchemeSummary.tsx     # Plain citizen summary & target beneficiaries
│   │   ├── BenefitsSection.tsx   # Advantages & monetary assistance
│   │   ├── EligibilityChecker.tsx# Dynamic interactive eligibility verification
│   │   ├── DocumentsSection.tsx  # Document readiness checklist with print
│   │   ├── ApplicationProcess.tsx# Step-by-step application walkthrough
│   │   ├── OfficialVerificationBadge.tsx # Official vs AI distinction
│   │   ├── AudioPlayerButton.tsx # Multi-language text-to-speech reader
│   │   └── GitHubDeploymentModal.tsx # In-app GitHub deployment guide
│   ├── services/
│   │   └── api.ts                # Gemini API client with backend fallback
│   ├── types/
│   │   └── scheme.ts             # TypeScript definitions
│   └── utils/
│       └── presets.ts            # Realistic pre-loaded government schemes
└── github-pages-export/          # Standalone vanilla HTML/CSS/JS version
    ├── index.html
    ├── style.css
    └── script.js
```

---

## 📦 How to Upload to GitHub

Follow these exact commands to push the project to your GitHub repository:

```bash
# 1. Initialize git
git init

# 2. Stage all project files
git add .

# 3. Create your initial commit
git commit -m "feat: complete SchemeGuide AI application for hackerarena-kirthick"

# 4. Set main branch
git branch -M main

# 5. Add remote origin (replace YOUR-GITHUB-USERNAME with your actual GitHub username)
git remote add origin https://github.com/YOUR-GITHUB-USERNAME/hackerarena-kirthick.git

# 6. Push to GitHub
git push -u origin main
```

---

## 🌐 Exact GitHub Pages Settings

To host the application freely on GitHub Pages:

1. Open your repository on GitHub:
   ```
   https://github.com/YOUR-GITHUB-USERNAME/hackerarena-kirthick
   ```
2. Click the **Settings** tab in the top navigation bar.
3. In the left sidebar, click **Pages** (under the "Code and automation" section).
4. Under **Build and deployment > Source**:
   - **Option 1 (Automated GitHub Actions - Recommended)**:
     - Select **GitHub Actions**.
     - The included `.github/workflows/deploy.yml` will automatically build and publish the app on every push.
   - **Option 2 (Deploy from Branch)**:
     - Select **Deploy from a branch**.
     - Branch: `main` | Folder: `/ (root)` or select `dist` if built.
     - Click **Save**.

### 🔗 Expected GitHub Pages URL Format
Your deployed application will be live at:
```
https://YOUR-GITHUB-USERNAME.github.io/hackerarena-kirthick/
```

---

## 🔒 Connecting Hosted Website to AI Backend Securely

When hosting static files on GitHub Pages:
- **Private API keys (`GEMINI_API_KEY`) must NEVER be exposed in client-side bundles.**
- SchemeGuide AI follows the industry standard **Backend Proxy Architecture**:

```text
[ Browser / GitHub Pages ]
       │
       ▼  (HTTPS POST /api/analyze-scheme)
[ Secure Server: server.ts on Cloud Run / Render / Railway ]
       │  (Uses server-side process.env.GEMINI_API_KEY)
       ▼
[ Google Gemini 3.8 Flash API ]
```

### Backend Deployment Options:
1. **Google AI Studio Hosted Environment (Default)**:  
   The application runs seamlessly out of the box with the hosted backend URL.
2. **Deploy on Free Cloud Platforms (Render / Railway / Cloud Run)**:
   - Deploy `server.ts` to Render/Railway.
   - In your dashboard, add the environment variable:
     ```env
     GEMINI_API_KEY=your_gemini_api_key_here
     ```
   - In the SchemeGuide AI web app, click **⚙️ Backend** or the **GitHub & Deploy** button and paste your backend URL (e.g. `https://schemeguide-api.onrender.com`). It will be saved securely in browser `localStorage`.
3. **Offline / Demo Mode**:  
   If no backend is connected, the app gracefully falls back to pre-loaded rich datasets for PM-Kisan, Ayushman Bharat, Mudra Loan, and Sukanya Samriddhi, making it 100% resilient during live demonstrations!

---

## 🎯 Public Demonstration Script (For Hackathons)

1. **Introduction**:
   Show the clean, high-grade interface with the Ashoka/Shield emblem and clear citizen summary tagline.
2. **Preset 1-Click Showcase**:
   Click **PM-Kisan Samman Nidhi** or **Ayushman Bharat**. Notice the instant poster rendering and simplified 1-minute breakdown.
3. **Multi-Language Adaptability**:
   Switch the language dropdown to **Tamil (தமிழ்)** or **Hindi (हिन्दी)**. Demonstrate how the title, benefits, and steps transform, and click **🔊 Listen** to trigger audio narration.
4. **Interactive Eligibility Test**:
   Scroll to the **Eligibility Checker**. Change Age to 32, select Farmer, and enter Income ₹1,50,000. Click **Evaluate My Eligibility**. Show the green "Likely Eligible" verdict, criteria checklist, and official disclaimer.
5. **Document Readiness**:
   Check off Aadhaar Card and Bank Passbook in the checklist and click **Print Checklist**.
6. **Custom Document Upload**:
   Drop any government scheme image or PDF circular to showcase real-time Gemini 3.8 Flash extraction.
