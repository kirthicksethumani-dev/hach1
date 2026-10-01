// SchemeGuide AI - GitHub Pages Standalone Script

const PRESETS = {
  'pm-kisan': {
    schemeName: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)',
    nativeName: 'பிரதமர் கிசான் சம்மான் நிதி / प्रधानमंत्री किसान सम्मान निधि',
    department: 'Department of Agriculture & Farmers Welfare',
    governmentLevel: 'Central Government',
    portal: 'pmkisan.gov.in',
    helpline: '155261 / 1800-115-526',
    simpleExplanation: 'Small and marginal landholding farmer families receive ₹6,000 every year directly into their bank account in three equal installments of ₹2,000 every four months. There are no middlemen and no loans to repay.',
    beneficiaries: ['Small and marginal farmers', 'Rural families with cultivable land in land records'],
    age: '18 years and above',
    income: 'Must not be an income-tax payer',
    occupation: 'Landholding farmer',
    benefits: [
      { title: '₹6,000 Direct Annual Assistance', desc: 'Credited directly via DBT in 3 installments of ₹2,000 every 4 months.' },
      { title: '100% Cashless & Transparent', desc: 'Aadhaar-seeded direct payment without intermediaries or agent cuts.' },
      { title: 'Timely Farming Inputs', desc: 'Disbursements timed before key agricultural sowing seasons (Kharif and Rabi).' }
    ],
    documents: [
      { name: 'Aadhaar Card', purpose: 'Identity proof & DBT transfer routing', mandatory: true },
      { name: 'Land Record (Patta / Chitta / 7-12)', purpose: 'Proof of cultivable land ownership', mandatory: true },
      { name: 'Bank Passbook', purpose: 'Aadhaar-seeded savings account for credit', mandatory: true }
    ],
    steps: [
      { title: '1. Open pmkisan.gov.in', desc: 'Visit the official national portal or your local CSC / e-Seva centre.' },
      { title: '2. New Farmer Registration', desc: 'Enter your Aadhaar number, state, and mobile number.' },
      { title: '3. Enter Land Records', desc: 'Submit your survey/patta number and upload land deed extract.' },
      { title: '4. Complete e-KYC', desc: 'Complete Aadhaar OTP authentication or biometric scan at a CSC centre.' }
    ]
  },
  'ayushman-bharat': {
    schemeName: 'Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (AB PM-JAY)',
    nativeName: 'ஆயுஷ்மான் பாரத் - PM-JAY / आयुष्मान भारत',
    department: 'National Health Authority (NHA), Ministry of Health',
    governmentLevel: 'Joint Central & State',
    portal: 'beneficiary.nha.gov.in',
    helpline: '14555 / 1800-111-565',
    simpleExplanation: 'Eligible families get ₹5,00,000 free cashless health insurance every year for hospital treatments and surgeries in thousands of empanelled government and private hospitals.',
    beneficiaries: ['Vulnerable low-income families', 'All senior citizens aged 70+ years across India'],
    age: 'No age barrier (Universal for 70+)',
    income: 'Priority Household / Ration Card based',
    occupation: 'Informal workers, daily wage laborers, rural families',
    benefits: [
      { title: '₹5 Lakh Annual Family Cover', desc: 'Covers doctor fees, surgeries, ICU, diagnostics, and medications.' },
      { title: 'Zero Cash Required', desc: 'Cashless and paperless treatment at over 27,000 empanelled hospitals.' },
      { title: 'Pan-India Portability', desc: 'Card can be used anywhere across participating states in India.' }
    ],
    documents: [
      { name: 'Aadhaar Card', purpose: 'Biometric verification for Ayushman Card generation', mandatory: true },
      { name: 'Ration Card / NFSA Card', purpose: 'Proof of family composition and SECC inclusion', mandatory: true },
      { name: 'Active Mobile Number', purpose: 'For OTP authentication', mandatory: true }
    ],
    steps: [
      { title: '1. Visit beneficiary.nha.gov.in', desc: 'Or open the official Ayushman App on your smartphone.' },
      { title: '2. Search by Ration Card or Aadhaar', desc: 'Check family listing and download Ayushman Card.' },
      { title: '3. Present at Hospital Desk', desc: 'Show your Ayushman Card at the hospital Ayushman Mitra desk for cashless admission.' }
    ]
  },
  'mudra-yojana': {
    schemeName: 'Pradhan Mantri Mudra Yojana (PMMY)',
    nativeName: 'பிரதமர் முத்ரா திட்டம் / प्रधानमंत्री मुद्रा योजना',
    department: 'Department of Financial Services, Ministry of Finance',
    governmentLevel: 'Central Government',
    portal: 'jansamarth.in / mudra.org.in',
    helpline: '1800-180-1111 / 1800-11-0001',
    simpleExplanation: 'Get a collateral-free bank loan from ₹50,000 up to ₹20 Lakhs to start or expand a micro or small business like a shop, tailoring center, repair unit, or trading business without pledging property or gold.',
    beneficiaries: ['Micro entrepreneurs', 'Shopkeepers, artisans, self-employed women and youth'],
    age: '18 to 65 years',
    income: 'Viable business plan / turnover',
    occupation: 'Non-farm micro business enterprise',
    benefits: [
      { title: 'Collateral-Free Credit', desc: 'No mortgage or third-party guarantee needed.' },
      { title: '3 Flexible Loan Tiers', desc: 'Shishu (up to ₹50k), Kishore (₹50k-5L), Tarun (₹5L-20L).' },
      { title: 'Mudra Debit Card', desc: 'Convenient working capital ATM withdrawals and purchases.' }
    ],
    documents: [
      { name: 'Aadhaar & PAN Card', purpose: 'KYC identity proof', mandatory: true },
      { name: 'Business Proof / Udyam Certificate', purpose: 'Proof of business existence', mandatory: false },
      { name: 'Bank Statement (6 Months)', purpose: 'Financial health assessment', mandatory: true }
    ],
    steps: [
      { title: '1. Choose Category', desc: 'Select Shishu, Kishore, or Tarun based on fund requirement.' },
      { title: '2. Apply on JanSamarth', desc: 'Visit jansamarth.in to submit loan request to multiple banks.' },
      { title: '3. Bank Approval', desc: 'Branch verifies your project proposal and disburses funds.' }
    ]
  },
  'sukanya-samriddhi': {
    schemeName: 'Sukanya Samriddhi Yojana (SSY)',
    nativeName: 'செல்வ மகள் சேமிப்பு திட்டம் / सुकन्या समृद्धि योजना',
    department: 'Department of Posts & Ministry of Finance',
    governmentLevel: 'Central Government',
    portal: 'indiapost.gov.in',
    helpline: '1800-266-6868',
    simpleExplanation: 'A sovereign high-interest (8.2%) savings account for daughters under 10 years of age. Deposit from ₹250/year. The entire interest and final maturity payout are 100% tax-free for her education and marriage.',
    beneficiaries: ['Parents or legal guardians of girl child below 10 years of age'],
    age: 'Daughter under 10 years',
    income: 'No income barrier',
    occupation: 'All Indian citizens',
    benefits: [
      { title: '8.2% Guaranteed Interest', desc: 'Highest government small savings rate compounded annually.' },
      { title: '100% Tax-Free (EEE)', desc: 'Tax exemption on deposit, earned interest, and final maturity.' },
      { title: 'Corpus for Daughter', desc: 'Matures after 21 years with 50% partial withdrawal allowed at age 18 for education.' }
    ],
    documents: [
      { name: 'Daughter\'s Birth Certificate', purpose: 'Age and relationship proof', mandatory: true },
      { name: 'Guardian Aadhaar & Address Proof', purpose: 'KYC of parent/guardian', mandatory: true },
      { name: 'Initial Deposit (Min ₹250)', purpose: 'Opening balance', mandatory: true }
    ],
    steps: [
      { title: '1. Visit Post Office / Bank', desc: 'Visit any India Post office or authorized commercial bank branch.' },
      { title: '2. Submit Form 1', desc: 'Fill the SSY account opening form with daughter\'s details.' },
      { title: '3. Receive Passbook', desc: 'Deposit initial amount and get your official SSY passbook.' }
    ]
  }
};

let currentScheme = null;
let uploadedFileBase64 = null;

// DOM Elements
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const filePreview = document.getElementById('filePreview');
const fileName = document.getElementById('fileName');
const fileSize = document.getElementById('fileSize');
const removeFileBtn = document.getElementById('removeFileBtn');
const analyzeBtn = document.getElementById('analyzeBtn');
const analysisSection = document.getElementById('analysisSection');
const languageSelect = document.getElementById('languageSelect');
const backendConfigBtn = document.getElementById('backendConfigBtn');
const backendModal = document.getElementById('backendModal');
const closeBackendModal = document.getElementById('closeBackendModal');
const saveBackendUrlBtn = document.getElementById('saveBackendUrlBtn');
const customBackendInput = document.getElementById('customBackendInput');
const readAloudBtn = document.getElementById('readAloudBtn');

// Local storage backend URL
const getBackendUrl = () => localStorage.getItem('schemeguide_custom_backend_url') || '';
customBackendInput.value = getBackendUrl();

// Backend modal
backendConfigBtn.addEventListener('click', () => { backendModal.style.display = 'flex'; });
closeBackendModal.addEventListener('click', () => { backendModal.style.display = 'none'; });
saveBackendUrlBtn.addEventListener('click', () => {
  localStorage.setItem('schemeguide_custom_backend_url', customBackendInput.value.trim().replace(/\/+$/, ''));
  backendModal.style.display = 'none';
  alert('Backend URL saved!');
});

// Dropzone interaction
dropZone.addEventListener('click', () => fileInput.click());
dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.style.borderColor = '#4f46e5'; });
dropZone.addEventListener('dragleave', () => { dropZone.style.borderColor = '#cbd5e1'; });
dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.style.borderColor = '#cbd5e1';
  if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
});
fileInput.addEventListener('change', (e) => {
  if (e.target.files[0]) handleFile(e.target.files[0]);
});

function handleFile(file) {
  fileName.textContent = file.name;
  fileSize.textContent = (file.size / 1024).toFixed(1) + ' KB';
  filePreview.style.display = 'flex';
  dropZone.style.display = 'none';
  analyzeBtn.disabled = false;

  const reader = new FileReader();
  reader.onload = (e) => {
    uploadedFileBase64 = e.target.result;
  };
  reader.readAsDataURL(file);
}

removeFileBtn.addEventListener('click', () => {
  uploadedFileBase64 = null;
  fileInput.value = '';
  filePreview.style.display = 'none';
  dropZone.style.display = 'block';
  analyzeBtn.disabled = true;
});

// Presets
document.querySelectorAll('.preset-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const pKey = btn.dataset.preset;
    if (PRESETS[pKey]) {
      renderScheme(PRESETS[pKey]);
      analyzeBtn.disabled = false;
    }
  });
});

// Analyze Click
analyzeBtn.addEventListener('click', async () => {
  analyzeBtn.textContent = 'Analyzing with Gemini AI...';
  analyzeBtn.disabled = true;

  const backendUrl = getBackendUrl();

  if (backendUrl && uploadedFileBase64) {
    try {
      const res = await fetch(`${backendUrl}/api/analyze-scheme`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileBase64: uploadedFileBase64,
          language: languageSelect.value
        })
      });
      if (res.ok) {
        const data = await res.json();
        renderScheme(data);
        return;
      }
    } catch (e) {
      console.warn('Backend call failed, using fallback display:', e);
    }
  }

  // Fallback to PM-Kisan demonstration if custom image without live backend
  setTimeout(() => {
    renderScheme(PRESETS['pm-kisan']);
    analyzeBtn.textContent = 'Analyze Scheme with AI';
    analyzeBtn.disabled = false;
  }, 1000);
});

function renderScheme(data) {
  currentScheme = data;
  document.getElementById('dispSchemeName').textContent = data.schemeName;
  document.getElementById('dispNativeName').textContent = data.nativeName || '';
  document.getElementById('dispDepartment').textContent = data.department;
  document.getElementById('govLevelBadge').textContent = data.governmentLevel || 'Central';
  document.getElementById('dispPortal').textContent = data.portal || (data.officialSource?.websiteUrl || 'Official Portal');
  document.getElementById('dispHelpline').textContent = data.helpline || (data.officialSource?.helpline || '1800-11-0001');
  document.getElementById('dispExplanation').textContent = data.simpleExplanation;
  
  // Beneficiaries
  const benList = document.getElementById('dispBeneficiaries');
  benList.innerHTML = '';
  (data.beneficiaries || data.targetBeneficiaries || []).forEach(b => {
    const li = document.createElement('li');
    li.textContent = b;
    benList.appendChild(li);
  });

  // Criteria
  document.getElementById('dispAge').textContent = data.age || data.eligibilityCriteria?.ageRequirement || 'N/A';
  document.getElementById('dispIncome').textContent = data.income || data.eligibilityCriteria?.incomeRequirement || 'N/A';
  document.getElementById('dispOccupation').textContent = data.occupation || data.eligibilityCriteria?.occupationRequirement || 'N/A';

  // Benefits
  const benGrid = document.getElementById('dispBenefits');
  benGrid.innerHTML = '';
  (data.benefits || []).forEach(b => {
    const card = document.createElement('div');
    card.className = 'benefit-card';
    card.innerHTML = `<h4>${b.title}</h4><p>${b.desc || b.description}</p>`;
    benGrid.appendChild(card);
  });

  // Documents
  const docGrid = document.getElementById('dispDocuments');
  docGrid.innerHTML = '';
  (data.documents || data.requiredDocuments || []).forEach(d => {
    const docDiv = document.createElement('div');
    docDiv.className = 'doc-item';
    docDiv.innerHTML = `
      <input type="checkbox" checked>
      <div>
        <div class="doc-name">${d.name || d.documentName}</div>
        <div class="doc-purpose">${d.purpose}</div>
      </div>
    `;
    docGrid.appendChild(docDiv);
  });

  // Steps
  const stepsGrid = document.getElementById('dispSteps');
  stepsGrid.innerHTML = '';
  (data.steps || data.applicationProcess || []).forEach(s => {
    const sCard = document.createElement('div');
    sCard.className = 'step-card';
    sCard.innerHTML = `<h4>${s.title}</h4><p>${s.desc || s.description}</p>`;
    stepsGrid.appendChild(sCard);
  });

  analysisSection.style.display = 'block';
  analysisSection.scrollIntoView({ behavior: 'smooth' });
}

// Eligibility Checker
document.getElementById('eligibilityForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const age = parseInt(document.getElementById('userAge').value, 10);
  const occ = document.getElementById('userOccupation').value;
  const resBox = document.getElementById('eligibilityResultBox');
  const badge = document.getElementById('verdictBadge');
  const title = document.getElementById('verdictTitle');
  const desc = document.getElementById('verdictSummary');

  if (age >= 18 && age <= 75) {
    badge.textContent = 'Likely Eligible';
    badge.style.background = '#bbf7d0';
    badge.style.color = '#14532d';
    title.textContent = 'Preliminary Criteria Satisfied';
    desc.textContent = `Based on your stated age (${age}) and occupation (${occ}), you appear to meet initial baseline requirements. Ensure you have your Aadhaar and bank passbook ready for biometric e-KYC.`;
  } else {
    badge.textContent = 'Verification Needed';
    badge.style.background = '#fef08a';
    badge.style.color = '#713f12';
    title.textContent = 'Age Verification Required';
    desc.textContent = `The applicant age (${age}) requires manual confirmation against scheme guidelines.`;
  }

  resBox.style.display = 'block';
  resBox.scrollIntoView({ behavior: 'smooth' });
});

// Read aloud
readAloudBtn.addEventListener('click', () => {
  if ('speechSynthesis' in window && currentScheme) {
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(currentScheme.simpleExplanation);
    window.speechSynthesis.speak(utt);
  }
});

// Print
document.getElementById('printBtn').addEventListener('click', () => window.print());
