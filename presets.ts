import { PresetScheme, SchemeAnalysis } from '../types/scheme';

// Function to generate high-resolution visual SVG poster data URI
function createSchemePosterSvg(
  schemeName: string,
  ministry: string,
  highlightAmount: string,
  badgeText: string,
  primaryColor: string,
  secondaryColor: string,
  keyBulletPoints: string[],
  officialWebsite: string
): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1100" width="800" height="1100">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${primaryColor}"/>
        <stop offset="100%" stop-color="${secondaryColor}"/>
      </linearGradient>
      <linearGradient id="cardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#ffffff"/>
        <stop offset="100%" stop-color="#f8fafc"/>
      </linearGradient>
      <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
        <feDropShadow dx="0" dy="8" stdDeviation="12" flood-opacity="0.15"/>
      </filter>
    </defs>

    <!-- Top Banner -->
    <rect width="800" height="1100" fill="#f1f5f9"/>
    <rect width="800" height="280" fill="url(#bgGrad)"/>
    
    <!-- Decorative Government Portal Stripes -->
    <rect x="0" y="272" width="266" height="8" fill="#f97316"/>
    <rect x="266" y="272" width="268" height="8" fill="#ffffff"/>
    <rect x="534" y="272" width="266" height="8" fill="#16a34a"/>

    <!-- National Emblem / Badge Mock -->
    <circle cx="100" cy="90" r="45" fill="#ffffff" opacity="0.95"/>
    <circle cx="100" cy="90" r="38" fill="none" stroke="${primaryColor}" stroke-width="3"/>
    <text x="100" y="96" font-family="sans-serif" font-size="20" font-weight="bold" fill="${primaryColor}" text-anchor="middle">GOVT</text>

    <!-- Header Text -->
    <text x="170" y="75" font-family="sans-serif" font-size="20" font-weight="600" fill="#ffffff" letter-spacing="1">GOVERNMENT INITIATIVE &amp; WELFARE</text>
    <text x="170" y="105" font-family="sans-serif" font-size="16" fill="#e2e8f0">${ministry}</text>
    <rect x="620" y="55" width="130" height="34" rx="17" fill="#ffffff" opacity="0.9"/>
    <text x="685" y="77" font-family="sans-serif" font-size="13" font-weight="bold" fill="${primaryColor}" text-anchor="middle">${badgeText}</text>

    <!-- Scheme Name Header -->
    <text x="400" y="190" font-family="sans-serif" font-size="34" font-weight="800" fill="#ffffff" text-anchor="middle">${schemeName}</text>
    <text x="400" y="235" font-family="sans-serif" font-size="22" font-weight="700" fill="#fde047" text-anchor="middle">${highlightAmount}</text>

    <!-- Main Content Card -->
    <rect x="40" y="320" width="720" height="660" rx="16" fill="url(#cardGrad)" filter="url(#shadow)"/>

    <!-- Card Header -->
    <rect x="40" y="320" width="720" height="60" rx="16" fill="#f8fafc"/>
    <path d="M 40 380 L 760 380" stroke="#e2e8f0" stroke-width="1.5"/>
    <text x="80" y="358" font-family="sans-serif" font-size="18" font-weight="bold" fill="#0f172a">OFFICIAL SCHEME NOTIFICATION &amp; GUIDELINES</text>

    <!-- Key Highlights Heading -->
    <text x="80" y="425" font-family="sans-serif" font-size="18" font-weight="700" fill="${primaryColor}">Key Benefits &amp; Objectives:</text>
    
    ${keyBulletPoints.map((pt, i) => `
      <circle cx="95" cy="${465 + i * 55}" r="7" fill="${primaryColor}"/>
      <text x="120" y="${471 + i * 55}" font-family="sans-serif" font-size="16" font-weight="500" fill="#334155">${pt}</text>
    `).join('')}

    <!-- Eligibility & Verification Notice Box -->
    <rect x="70" y="730" width="660" height="120" rx="12" fill="#eff6ff" stroke="#bfdbfe" stroke-width="1.5"/>
    <text x="100" y="765" font-family="sans-serif" font-size="16" font-weight="bold" fill="#1e40af">Mandatory Eligibility &amp; KYC Verification:</text>
    <text x="100" y="795" font-family="sans-serif" font-size="14" fill="#3b82f6">• Aadhaar linked active bank account required.</text>
    <text x="100" y="825" font-family="sans-serif" font-size="14" fill="#3b82f6">• Physical / online verification by authorized nodal officers.</text>

    <!-- Helpline & Portal Bar -->
    <rect x="70" y="880" width="660" height="70" rx="10" fill="#f1f5f9"/>
    <text x="100" y="922" font-family="sans-serif" font-size="15" font-weight="bold" fill="#0f172a">Official Portal: <tspan fill="${primaryColor}">${officialWebsite}</tspan></text>
    <text x="540" y="922" font-family="sans-serif" font-size="15" font-weight="bold" fill="#059669">Toll-Free: 1800-115-526</text>

    <!-- Footer Seal -->
    <text x="400" y="1030" font-family="sans-serif" font-size="13" fill="#64748b" text-anchor="middle">Issued for Public Awareness &amp; Direct Citizen Access | Digital India Mission</text>
    <text x="400" y="1055" font-family="sans-serif" font-size="12" fill="#94a3b8" text-anchor="middle">Always verify credentials at official .gov.in / .nic.in portals</text>
  </svg>`;

  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
}

export const PRESET_SCHEMES: PresetScheme[] = [
  {
    id: 'pm-kisan',
    title: 'PM-Kisan Samman Nidhi',
    tagline: '₹6,000 per year direct income support to landholding farmers',
    category: 'Agriculture & Farmers',
    badge: 'Central Sector',
    thumbnail: createSchemePosterSvg(
      'PM-KISAN SAMMAN NIDHI',
      'Ministry of Agriculture & Farmers Welfare, Govt. of India',
      'Direct Benefit: ₹6,000 / year in 3 Installments',
      'PM-KISAN 2026',
      '#15803d',
      '#166534',
      [
        '₹2,000 transferred every 4 months directly to Aadhaar-seeded bank account',
        'Open to small and marginal farmer families with cultivable landholding',
        'Direct electronic transfer via DBTO without any middlemen',
        'Over 11 crore farmer families supported nationwide',
        'e-KYC mandatory via facial recognition, biometric or OTP on pmkisan.gov.in'
      ],
      'https://pmkisan.gov.in'
    ),
    mockFileName: 'pm_kisan_official_poster_2026.png',
    fileBase64: '',
    mimeType: 'image/svg+xml',
    precomputedData: {
      id: 'pm-kisan-analysis',
      schemeName: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)',
      nativeSchemeName: 'பிரதமர் கிசான் சம்மான் நிதி / प्रधानमंत्री किसान सम्मान निधि',
      department: 'Department of Agriculture and Farmers Welfare (MoAFW)',
      governmentLevel: 'Central Government',
      stateOrRegion: 'All States and Union Territories across India',
      mainPurpose: 'Provide financial income support to small and marginal farmer families to meet domestic needs and purchase agricultural inputs before every crop cycle.',
      simpleExplanation: 'Every eligible farmer family receives ₹6,000 per year directly into their bank account in three equal installments of ₹2,000 every 4 months (April-July, August-November, December-March). No loans to repay.',
      targetBeneficiaries: [
        'Small and marginal landholding farmer families',
        'Rural families owning cultivable land parcels'
      ],
      eligibilityCriteria: {
        ageRequirement: '18 years and above (Head of household or land record holder)',
        incomeRequirement: 'Must not be an income-tax payer in the previous assessment year',
        occupationRequirement: 'Farmer owning cultivable land in their name in state land records',
        stateApplicability: 'Applicable in all States & UTs (All India)',
        genderRequirement: 'All genders (Female & Male farmers)',
        otherConditions: [
          'Land ownership record (RoR / Patta / Chitta) must be registered in applicant\'s name',
          'Institutional landholders and serving/retired govt employees are excluded',
          'Pensioners receiving ₹10,000+ per month are not eligible',
          'Doctors, Engineers, Lawyers, Chartered Accountants are excluded'
        ]
      },
      benefits: [
        {
          title: 'Direct Cash Transfer',
          description: '₹6,000 per year deposited directly into bank account via DBT.',
          amountOrValue: '₹6,000 / year'
        },
        {
          title: 'Zero Intermediaries',
          description: 'Direct transfer to Aadhaar-linked account ensures no deduction or middleman fee.',
          category: 'Transparency'
        },
        {
          title: 'Seasonal Support',
          description: 'Timely assistance before Kharif, Rabi, and summer cropping seasons.',
          category: 'Farming Inputs'
        }
      ],
      requiredDocuments: [
        {
          documentName: 'Aadhaar Card',
          purpose: 'Identity verification & direct payment routing (mandatory linked to mobile number)',
          isMandatory: true
        },
        {
          documentName: 'Landholding Ownership Record (Patta / Khatauni / Chitta / 7-12 extract)',
          purpose: 'Proof of cultivable agricultural land title in applicant name',
          isMandatory: true
        },
        {
          documentName: 'Bank Passbook / Account Details',
          purpose: 'Active savings account seeded with Aadhaar and NPCI mapping',
          isMandatory: true
        },
        {
          documentName: 'Active Mobile Number',
          purpose: 'For OTP verification and installment SMS alerts',
          isMandatory: true
        }
      ],
      applicationProcess: [
        {
          stepNumber: 1,
          title: 'Visit Official Portal',
          description: 'Open pmkisan.gov.in or visit the nearest Common Service Centre (CSC) / e-Seva centre.'
        },
        {
          stepNumber: 2,
          title: 'New Farmer Registration',
          description: 'Click on "New Farmer Registration" and enter Aadhaar number, state, and mobile number.'
        },
        {
          stepNumber: 3,
          title: 'Enter Land Details',
          description: 'Fill Survey / Khata number, Khasra number, and land area from land records.'
        },
        {
          stepNumber: 4,
          title: 'Complete e-KYC',
          description: 'Perform Aadhaar OTP e-KYC or biometric e-KYC at CSC centre.'
        },
        {
          stepNumber: 5,
          title: 'District Nodal Approval',
          description: 'Village Patwari / Revenue Officer verifies land record and approves DBT disbursement.'
        }
      ],
      officialSource: {
        isOfficialSourceDetected: true,
        portalName: 'PM-Kisan Official National Portal',
        websiteUrl: 'https://pmkisan.gov.in',
        helpline: '155261 / 1800-115-526 / 011-24300606',
        sourceNotes: 'Official Central Sector Scheme under Ministry of Agriculture and Farmers Welfare.'
      },
      importantConditions: [
        'Aadhaar e-KYC is strictly mandatory to receive installments.',
        'Bank account must be mapped with NPCI for Direct Benefit Transfer (DBT).',
        'Land bought after Feb 1, 2019 is subject to succession rules.'
      ],
      warningsAndCaveats: [
        'Beware of fraudulent mobile apps charging registration fees. PM-Kisan portal registration is 100% free.',
        'Falsely claiming benefits if you pay income tax will lead to recovery of funds.'
      ],
      dynamicQuestions: [
        {
          id: 'ownsLand',
          question: 'Do you or your family own cultivable agricultural land registered in your name?',
          type: 'boolean',
          helpText: 'Applicant must have legal title in the state revenue records.'
        },
        {
          id: 'isTaxPayer',
          question: 'Did any member of your immediate family pay Income Tax last year?',
          type: 'boolean',
          helpText: 'Income tax payers are excluded under scheme guidelines.'
        },
        {
          id: 'isGovtEmployee',
          question: 'Are you or your spouse a regular employee of Central / State Government?',
          type: 'boolean',
          helpText: 'Regular government employees (except Group D / Multi-tasking) are excluded.'
        }
      ],
      detectedLanguage: 'English / Multilingual',
      confidenceScore: 0.98
    }
  },
  {
    id: 'ayushman-bharat',
    title: 'Ayushman Bharat (PM-JAY)',
    tagline: '₹5,00,000 free health coverage per family per year for secondary & tertiary hospitalization',
    category: 'Healthcare & Wellness',
    badge: 'Flagship Health',
    thumbnail: createSchemePosterSvg(
      'AYUSHMAN BHARAT PM-JAY',
      'National Health Authority (NHA), Ministry of Health & Family Welfare',
      'Free Health Cover: ₹5 Lakhs per family / year',
      'SECC / Ration Card',
      '#1d4ed8',
      '#1e40af',
      [
        'Cashless and paperless access to healthcare services in 27,000+ empanelled hospitals',
        'Covers up to 3 days pre-hospitalization and 15 days post-hospitalization costs',
        'Includes 1,949 medical and surgical procedures with no disease capping',
        'All senior citizens aged 70+ now eligible regardless of income under PM-JAY expansion',
        'Ayushman Vaya Vandana card available instantly with Aadhaar e-KYC'
      ],
      'https://beneficiary.nha.gov.in'
    ),
    mockFileName: 'ayushman_bharat_pmjay_flyer.png',
    fileBase64: '',
    mimeType: 'image/svg+xml',
    precomputedData: {
      id: 'ayushman-bharat-analysis',
      schemeName: 'Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (AB PM-JAY)',
      nativeSchemeName: 'ஆயுஷ்மான் பாரத் - பிரதம மந்திரி ஜன் ஆரோக்கிய யோஜனா / आयुष्मान भारत',
      department: 'National Health Authority (NHA), Ministry of Health and Family Welfare',
      governmentLevel: 'Joint Central & State',
      stateOrRegion: '33+ States & UTs across India',
      mainPurpose: 'Protect vulnerable Indian families against catastrophic health expenditures and medical debt by providing ₹5 Lakh per year cashless hospitalization coverage.',
      simpleExplanation: 'If you or any family member falls sick and needs hospital admission or surgery, the government pays the hospital bill directly up to ₹5,00,000 every year at thousands of public and private hospitals. You pay ₹0 at the hospital.',
      targetBeneficiaries: [
        'Bottom 40% vulnerable and low-income families identified by SECC 2011 / NFSA Ration Cards',
        'All senior citizens aged 70 years and above across India (new universal expansion)'
      ],
      eligibilityCriteria: {
        ageRequirement: 'No age barrier for families on beneficiary list; or any individual aged 70+ years',
        incomeRequirement: 'Low income / Deprived households based on SECC 2011 / Priority Ration Card',
        occupationRequirement: 'Informal workers, daily wage laborers, rural poor, unorganized sector',
        stateApplicability: 'Nationwide (portable across India except states with standalone health schemes)',
        otherConditions: [
          'Name must appear in the SECC 2011 database, NFSA ration card list, or state health database',
          'Family size has no cap (entire joint family is covered under single entitlement)'
        ]
      },
      benefits: [
        {
          title: '₹5,00,000 Annual Coverage',
          description: 'Covers doctor fees, surgeries, ICU, implants, diagnostics, and medicines.',
          amountOrValue: '₹5,00,000 / year'
        },
        {
          title: 'Completely Cashless & Paperless',
          description: 'No reimbursement hassle. Treatment is approved digitally at the hospital reception.',
          category: 'Zero Out of Pocket'
        },
        {
          title: 'Pan-India Portability',
          description: 'Card can be used at any empanelled hospital anywhere in India, even when traveling.',
          category: 'Portability'
        }
      ],
      requiredDocuments: [
        {
          documentName: 'Aadhaar Card',
          purpose: 'Primary identity document and biometric authentication for the Ayushman Card',
          isMandatory: true
        },
        {
          documentName: 'Ration Card / NFSA Smart Card',
          purpose: 'Proof of family composition and inclusion in welfare database',
          isMandatory: true
        },
        {
          documentName: 'Active Mobile Number',
          purpose: 'For OTP verification on beneficiary portal',
          isMandatory: true
        }
      ],
      applicationProcess: [
        {
          stepNumber: 1,
          title: 'Check Your Eligibility',
          description: 'Go to beneficiary.nha.gov.in or download the Ayushman App on your phone.'
        },
        {
          stepNumber: 2,
          title: 'Search by Aadhaar or Ration Card',
          description: 'Select your state, enter your Ration Card number, Family ID, or Aadhaar number.'
        },
        {
          stepNumber: 3,
          title: 'Complete e-KYC',
          description: 'Verify with Aadhaar OTP or facial recognition to generate Ayushman Card.'
        },
        {
          stepNumber: 4,
          title: 'Download Ayushman Card (PVC/PDF)',
          description: 'Download the card immediately with unique ABHA number and QR code.'
        },
        {
          stepNumber: 5,
          title: 'Show at Hospital Ayushman Mitra Kiosk',
          description: 'Present the card at any empanelled hospital helpdesk for instant cashless admission.'
        }
      ],
      officialSource: {
        isOfficialSourceDetected: true,
        portalName: 'NHA Beneficiary Portal & PM-JAY',
        websiteUrl: 'https://beneficiary.nha.gov.in',
        helpline: '14555 / 1800-111-565',
        sourceNotes: 'Official portal managed directly by National Health Authority.'
      },
      importantConditions: [
        'Pre-existing diseases are covered from Day 1 without waiting periods.',
        'Treatment must be availed at an empanelled hospital (list available on portal).'
      ],
      warningsAndCaveats: [
        'Ayushman Cards are free of cost. Never pay any fee or tout at hospitals.',
        'Always check with the hospital\'s "Ayushman Mitra" desk before admission.'
      ],
      dynamicQuestions: [
        {
          id: 'isSenior70',
          question: 'Are you or anyone in your household aged 70 years or older?',
          type: 'boolean',
          helpText: 'All senior citizens 70+ qualify for universal coverage under the new expansion.'
        },
        {
          id: 'hasRationCard',
          question: 'Do you hold an active Priority Household (PHH) or Antyodaya (AAY) Ration Card?',
          type: 'boolean',
          helpText: 'Ration card holders are automatically pre-seeded in the database.'
        }
      ],
      detectedLanguage: 'English / Multilingual',
      confidenceScore: 0.99
    }
  },
  {
    id: 'mudra-yojana',
    title: 'Pradhan Mantri Mudra Yojana (PMMY)',
    tagline: 'Collateral-free business loans up to ₹20 Lakhs for micro and small enterprises',
    category: 'Business & Entrepreneurship',
    badge: 'Self-Employment',
    thumbnail: createSchemePosterSvg(
      'PM MUDRA YOJANA (PMMY)',
      'Department of Financial Services, Ministry of Finance, Govt. of India',
      'Collateral-Free Loan up to ₹20 Lakhs',
      'Shishu • Kishore • Tarun',
      '#0f766e',
      '#115e59',
      [
        'Shishu: Loans up to ₹50,000 for starting new small ventures',
        'Kishore: Loans from ₹50,001 to ₹5 Lakhs for business equipment & expansion',
        'Tarun: Loans from ₹5 Lakhs to ₹10 Lakhs (and up to ₹20 Lakhs under Tarun Plus)',
        'Zero collateral or third-party guarantee required',
        'Available via all Commercial Banks, RRBs, Small Finance Banks, and MFIs'
      ],
      'https://www.mudra.org.in'
    ),
    mockFileName: 'pm_mudra_loan_guidelines.png',
    fileBase64: '',
    mimeType: 'image/svg+xml',
    precomputedData: {
      id: 'mudra-analysis',
      schemeName: 'Pradhan Mantri Mudra Yojana (PMMY)',
      nativeSchemeName: 'பிரதமர் முத்ரா திட்டம் / प्रधानमंत्री मुद्रा योजना',
      department: 'Department of Financial Services (DFS), Ministry of Finance',
      governmentLevel: 'Central Government',
      stateOrRegion: 'All States and UTs across India',
      mainPurpose: 'Provide institutional credit and working capital to micro-enterprises, small shopkeepers, artisans, and entrepreneurs without requiring collateral security.',
      simpleExplanation: 'If you want to start or expand a small business (like a grocery shop, tailoring unit, food stall, salon, transport vehicle, or repair shop), you can get a bank loan from ₹50,000 up to ₹20 Lakhs without pledging property or gold.',
      targetBeneficiaries: [
        'Small business owners, shopkeepers, street vendors, artisans',
        'Women entrepreneurs, self-employed youth, food processing units'
      ],
      eligibilityCriteria: {
        ageRequirement: '18 years to 65 years',
        incomeRequirement: 'Viable business plan or existing trading/service enterprise generating revenue',
        occupationRequirement: 'Non-farm micro or small business enterprise in manufacturing, trading, or services',
        stateApplicability: 'Nationwide across all districts',
        otherConditions: [
          'Applicant must not have defaulted on any previous bank loan',
          'Good CIBIL / credit score or clean banking history'
        ]
      },
      benefits: [
        {
          title: 'No Collateral Required',
          description: 'No mortgage or security pledge needed; covered under Credit Guarantee Fund.',
          category: 'Collateral Free'
        },
        {
          title: '3 Flexible Loan Tiers',
          description: 'Shishu (up to ₹50k), Kishore (₹50k-₹5L), Tarun (₹5L-₹10L), Tarun Plus (up to ₹20L).',
          amountOrValue: 'Up to ₹20,00,000'
        },
        {
          title: 'Mudra Debit Card',
          description: 'Issued with working capital limit for easy ATM withdrawals and supplier payments.',
          category: 'Working Capital'
        }
      ],
      requiredDocuments: [
        {
          documentName: 'Identity Proof (Aadhaar / Voter ID / PAN)',
          purpose: 'KYC identity proof',
          isMandatory: true
        },
        {
          documentName: 'Business Registration / Udyam Certificate',
          purpose: 'Proof of business existence or establishment',
          isMandatory: false
        },
        {
          documentName: 'Last 6 Months Bank Statement',
          purpose: 'Verify financial cash flow and transaction health',
          isMandatory: true
        },
        {
          documentName: 'Project Report / Business Quotation',
          purpose: 'Details of machinery, tools, or stock to be purchased with the loan',
          isMandatory: true
        }
      ],
      applicationProcess: [
        {
          stepNumber: 1,
          title: 'Select Category',
          description: 'Choose between Shishu (<₹50k), Kishore (₹50k-5L), or Tarun (₹5L-20L) depending on requirement.'
        },
        {
          stepNumber: 2,
          title: 'Apply via JanSamarth Portal',
          description: 'Visit jansamarth.in or mudra.org.in to apply online with multiple banks simultaneously.'
        },
        {
          stepNumber: 3,
          title: 'Submit Quotation & Documents',
          description: 'Provide machinery quotation, vendor invoices, and KYC documents.'
        },
        {
          stepNumber: 4,
          title: 'Bank Verification & Sanction',
          description: 'Branch manager assesses feasibility and sanctions the loan with Mudra card.'
        }
      ],
      officialSource: {
        isOfficialSourceDetected: true,
        portalName: 'Mudra & JanSamarth Government Portal',
        websiteUrl: 'https://www.jansamarth.in',
        helpline: '1800-180-1111 / 1800-11-0001',
        sourceNotes: 'Official scheme facilitated via MUDRA (Micro Units Development & Refinance Agency).'
      },
      importantConditions: [
        'Interest rate is determined by the lending bank guidelines without usurious rates.',
        'Repayment tenure usually ranges between 3 to 5 years.'
      ],
      warningsAndCaveats: [
        'Never pay middlemen or agents promising "guaranteed Mudra loan approval". Banks process loans directly.',
        'Mudra loans are strictly for business purposes and cannot be used for personal consumption.'
      ],
      dynamicQuestions: [
        {
          id: 'loanCategoryNeeded',
          question: 'What is your required loan amount category?',
          type: 'select',
          options: ['Shishu (Up to ₹50,000)', 'Kishore (₹50,001 to ₹5 Lakhs)', 'Tarun (₹5 Lakhs to ₹20 Lakhs)'],
          helpText: 'Select based on your business stage and equipment budget.'
        },
        {
          id: 'hasExistingLoanDefault',
          question: 'Do you have any overdue or defaulted loans with any bank?',
          type: 'boolean',
          helpText: 'Clean credit history is mandatory for sanction.'
        }
      ],
      detectedLanguage: 'English / Multilingual',
      confidenceScore: 0.97
    }
  },
  {
    id: 'sukanya-samriddhi',
    title: 'Sukanya Samriddhi Yojana (SSY)',
    tagline: 'High interest rate (8.2%) tax-free small savings scheme for girl child future',
    category: 'Women & Child Development',
    badge: 'Beti Bachao Beti Padhao',
    thumbnail: createSchemePosterSvg(
      'SUKANYA SAMRIDDHI YOJANA',
      'Ministry of Finance & Department of Posts, Govt. of India',
      'Interest Rate: 8.2% p.a. (Tax-Free EEE)',
      'Girl Child Welfare',
      '#9333ea',
      '#7e22ce',
      [
        'Can be opened for any girl child from birth up to 10 years of age',
        'Deposit from minimum ₹250 to maximum ₹1.5 Lakh per financial year',
        'Exempt-Exempt-Exempt (EEE) tax status under Section 80C',
        'Partial withdrawal up to 50% allowed for higher education after girl turns 18',
        'Available at any Post Office or authorized commercial bank branch'
      ],
      'https://www.indiapost.gov.in'
    ),
    mockFileName: 'sukanya_samriddhi_flyer.png',
    fileBase64: '',
    mimeType: 'image/svg+xml',
    precomputedData: {
      id: 'ssy-analysis',
      schemeName: 'Sukanya Samriddhi Yojana (SSY)',
      nativeSchemeName: 'சுகன்யா சம்ரிதி யோஜனா / செல்வ மகள் சேமிப்பு திட்டம் / सुकन्या समृद्धि योजना',
      department: 'Department of Economic Affairs, Ministry of Finance',
      governmentLevel: 'Central Government',
      stateOrRegion: 'All States and UTs across India',
      mainPurpose: 'Promote the financial security, higher education, and marriage fund of girl children through sovereign-backed high-interest compounding savings.',
      simpleExplanation: 'A special government savings account for parents of daughters aged 0 to 10 years. You deposit money whenever you can (min ₹250/year). The government gives one of the highest interest rates (8.2% per year), and the entire interest and final maturity payout are 100% tax-free.',
      targetBeneficiaries: [
        'Parents or legal guardians of a girl child resident in India',
        'Maximum 2 girl children per family (up to 3 in case of twin girls in second birth)'
      ],
      eligibilityCriteria: {
        ageRequirement: 'Girl child must be below 10 years of age at the time of account opening',
        incomeRequirement: 'No income ceiling; accessible to all economic classes',
        occupationRequirement: 'Open to all Indian citizen parents/guardians',
        stateApplicability: 'Nationwide across all post offices and banks',
        genderRequirement: 'Female (Girl Child only)',
        otherConditions: [
          'Account must be opened by biological parents or legal guardians in the name of the girl child',
          'Only one account is permitted per girl child'
        ]
      },
      benefits: [
        {
          title: 'High Guaranteed Interest (8.2%)',
          description: 'Quarterly revised sovereign interest rate, compounded annually.',
          amountOrValue: '8.2% per annum'
        },
        {
          title: 'Triple Tax Exemption (EEE)',
          description: 'Deposits qualify for 80C deduction, interest earned is tax-free, maturity is tax-free.',
          category: 'Tax Benefit'
        },
        {
          title: 'Maturity on 21 Years',
          description: 'Account matures 21 years from opening date, providing a substantial corpus for the daughter.',
          category: 'Long Term Security'
        }
      ],
      requiredDocuments: [
        {
          documentName: 'Birth Certificate of the Girl Child',
          purpose: 'Verify age, birth date, and parentage of the girl child',
          isMandatory: true
        },
        {
          documentName: 'Identity & Address Proof of Parent / Guardian (Aadhaar / Voter ID)',
          purpose: 'KYC of the person opening the account',
          isMandatory: true
        },
        {
          documentName: 'Passport Size Photographs',
          purpose: 'Parent/Guardian and girl child photos for passbook',
          isMandatory: true
        },
        {
          documentName: 'Initial Deposit (Min ₹250)',
          purpose: 'Opening balance deposit',
          isMandatory: true
        }
      ],
      applicationProcess: [
        {
          stepNumber: 1,
          title: 'Visit Post Office or Bank',
          description: 'Visit nearest India Post branch or any authorized bank (SBI, PNB, ICICI, etc.).'
        },
        {
          stepNumber: 2,
          title: 'Fill SSY Account Form',
          description: 'Fill Form-1 with daughter\'s details and guardian details.'
        },
        {
          stepNumber: 3,
          title: 'Submit Birth Certificate & KYC',
          description: 'Attach certified copy of birth certificate and guardian Aadhaar.'
        },
        {
          stepNumber: 4,
          title: 'Deposit Initial Amount & Receive Passbook',
          description: 'Deposit ₹250 or more; branch issues an official Sukanya Samriddhi Passbook.'
        }
      ],
      officialSource: {
        isOfficialSourceDetected: true,
        portalName: 'India Post Official Banking Portal',
        websiteUrl: 'https://www.indiapost.gov.in',
        helpline: '1800-266-6868',
        sourceNotes: 'Regulated under Government Savings Promotion Act by Ministry of Finance.'
      },
      importantConditions: [
        'Deposits can be made for 15 years from date of account opening.',
        'A minimum deposit of ₹250 must be made in every financial year to keep the account active.'
      ],
      warningsAndCaveats: [
        'If ₹250 is not deposited in a year, a minor penalty of ₹50 per default year applies.',
        'Premature closure is strictly restricted except in critical medical emergencies.'
      ],
      dynamicQuestions: [
        {
          id: 'girlChildAge',
          question: 'What is the current age of your daughter?',
          type: 'number',
          helpText: 'Must be 10 years or younger.'
        },
        {
          id: 'existingAccounts',
          question: 'Has an SSY account already been opened for this girl child previously?',
          type: 'boolean',
          helpText: 'Only one account per girl child is permitted across India.'
        }
      ],
      detectedLanguage: 'English / Multilingual',
      confidenceScore: 0.99
    }
  }
];
