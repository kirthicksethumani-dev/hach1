import 'dotenv/config';
import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Enable JSON body parser with 50mb limit for base64 images and PDFs
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Enable CORS for all routes (crucial for GitHub Pages frontend)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// Gemini Client initialization with required User-Agent
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'SchemeGuide AI Backend',
    hasApiKey: Boolean(apiKey),
    timestamp: new Date().toISOString(),
  });
});

const LANGUAGE_PROMPT_MAP: Record<string, string> = {
  en: 'English',
  ta: 'Tamil (தமிழ்) - Please write in natural, fluent Tamil script',
  hi: 'Hindi (हिन्दी) - Please write in natural, fluent Devanagari script',
  te: 'Telugu (తెలుగు) - Please write in natural, fluent Telugu script',
  ml: 'Malayalam (മലയാളം) - Please write in natural, fluent Malayalam script',
  kn: 'Kannada (ಕನ್ನಡ) - Please write in natural, fluent Kannada script',
};

// Helper: Multi-model generation with automatic fallback to prevent 503 high-demand errors
async function generateWithFallback(options: {
  contents: any;
  systemInstruction?: string;
  expectJson?: boolean;
}): Promise<string> {
  // Use gemini-3.1-flash-lite as primary (fast, minimal thinking latency, reliable availability)
  // then fallback to gemini-flash-latest and gemini-3.8-flash
  const modelsToTry = ['gemini-3.1-flash-lite', 'gemini-flash-latest', 'gemini-3.8-flash'];
  let lastError: any = null;

  for (const model of modelsToTry) {
    try {
      const config: any = {};
      if (options.systemInstruction) {
        config.systemInstruction = options.systemInstruction;
      }
      if (options.expectJson) {
        config.responseMimeType = 'application/json';
      }

      const response = await ai.models.generateContent({
        model,
        contents: options.contents,
        config,
      });

      if (response && response.text) {
        return response.text;
      }
    } catch (err: any) {
      console.warn(`Model ${model} failed:`, err?.message || err);
      lastError = err;
    }
  }

  throw lastError || new Error('All AI models failed to respond.');
}

// Clean and parse JSON safely
function cleanAndParseJson(rawText: string): any {
  const cleaned = rawText.trim();
  const match = cleaned.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
  if (match) {
    try {
      return JSON.parse(match[0]);
    } catch {
      // Continue to fallback
    }
  }
  let fallback = cleaned;
  if (fallback.startsWith('```json')) {
    fallback = fallback.replace(/^```json\s*/i, '').replace(/\s*```$/, '');
  } else if (fallback.startsWith('```')) {
    fallback = fallback.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  return JSON.parse(fallback);
}

// 1. Analyze Scheme Endpoint
app.post('/api/analyze-scheme', async (req: Request, res: Response) => {
  try {
    const { fileBase64, mimeType, language = 'en', schemeText } = req.body;

    if (!fileBase64 && !schemeText) {
      return res.status(400).json({
        error: 'Please upload a scheme poster/PDF or enter scheme text.',
      });
    }

    if (!apiKey) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured on the server.',
      });
    }

    const targetLanguage = LANGUAGE_PROMPT_MAP[language] || 'English';

    const systemInstruction = `You are SchemeGuide AI, an expert public welfare advisor.
Analyze the uploaded document or text about a government scheme.
Translate and explain everything in simple, everyday language in ${targetLanguage}.

You MUST return a JSON object with this EXACT structure:
{
  "schemeName": "Official Scheme Name",
  "nativeSchemeName": "Scheme Name in ${targetLanguage}",
  "department": "Ministry or Department name",
  "governmentLevel": "Central Government" or "State Government" or "Joint Central & State",
  "stateOrRegion": "Applicable state(s) or All India",
  "mainPurpose": "Brief statement of core purpose",
  "simpleExplanation": "2-3 sentences explaining in everyday citizen language what this scheme is and how it helps a normal person",
  "targetBeneficiaries": ["Beneficiary group 1", "Beneficiary group 2"],
  "eligibilityCriteria": {
    "ageRequirement": "Age limit details",
    "incomeRequirement": "Income ceiling details or None",
    "occupationRequirement": "Eligible occupations or roles",
    "stateApplicability": "Region/State rules",
    "genderRequirement": "Gender requirements if any",
    "otherConditions": ["Condition 1", "Condition 2"]
  },
  "benefits": [
    { "title": "Benefit title", "description": "Simple description", "amountOrValue": "e.g. ₹6,000/yr or ₹5 Lakhs", "category": "Direct Assistance" }
  ],
  "requiredDocuments": [
    { "documentName": "Aadhaar Card", "purpose": "Identity verification", "isMandatory": true }
  ],
  "applicationProcess": [
    { "stepNumber": 1, "title": "Step title", "description": "Step instruction" }
  ],
  "officialSource": {
    "isOfficialSourceDetected": true,
    "portalName": "Official portal name",
    "websiteUrl": "https://official-portal.gov.in",
    "helpline": "Toll free number",
    "sourceNotes": "Official guidelines note"
  },
  "importantConditions": ["Rule 1", "Rule 2"],
  "warningsAndCaveats": ["Beware of fraudulent agents charging registration fees."],
  "dynamicQuestions": [
    { "id": "q1", "question": "Relevant question for this scheme", "type": "boolean", "helpText": "Explanation" }
  ],
  "detectedLanguage": "${targetLanguage}"
}`;

    const promptText = `Analyze this government scheme in ${targetLanguage}.
Provide all details strictly in JSON matching the specified structure.
${schemeText ? `Context/Text: "${schemeText}"` : ''}`;

    const parts: any[] = [];

    if (fileBase64) {
      // Check if it's an SVG data URI
      if (fileBase64.includes('image/svg+xml') || (mimeType && mimeType.includes('svg'))) {
        // Decode SVG text from base64 so Gemini reads it as textual context
        try {
          const rawBase64 = fileBase64.replace(/^data:[^;]+;base64,/, '');
          const decodedSvg = Buffer.from(rawBase64, 'base64').toString('utf-8');
          // Extract text content inside SVG
          const textMatches = decodedSvg.match(/>([^<]+)</g);
          const extractedText = textMatches ? textMatches.map(m => m.replace(/[><]/g, '').trim()).filter(Boolean).join(' ') : decodedSvg;
          parts.push({
            text: `[DOCUMENT CONTENT FROM POSTER]:\n${extractedText}\n\n${promptText}`,
          });
        } catch {
          parts.push({ text: promptText });
        }
      } else {
        // Standard PNG, JPEG, WEBP, or PDF
        const match = fileBase64.match(/^data:([^;]+);base64,(.+)$/);
        const effectiveMime = mimeType || (match ? match[1] : 'image/jpeg');
        const rawData = match ? match[2] : fileBase64;

        parts.push({
          inlineData: {
            mimeType: effectiveMime,
            data: rawData,
          },
        });
        parts.push({ text: promptText });
      }
    } else {
      parts.push({ text: promptText });
    }

    const rawResponse = await generateWithFallback({
      contents: { parts },
      systemInstruction,
      expectJson: true,
    });

    const parsedData = cleanAndParseJson(rawResponse);
    parsedData.id = 'scheme_' + Date.now();

    res.json(parsedData);
  } catch (error: any) {
    console.error('Error analyzing scheme:', error);
    res.status(500).json({
      error: error?.message || 'Failed to analyze scheme. Please verify the document is legible.',
    });
  }
});

// 2. Eligibility Checker Endpoint
app.post('/api/check-eligibility', async (req: Request, res: Response) => {
  try {
    const { schemeDetails, userProfile, language = 'en' } = req.body;

    if (!schemeDetails || !userProfile) {
      return res.status(400).json({
        error: 'Missing required parameters: schemeDetails and userProfile.',
      });
    }

    const targetLanguage = LANGUAGE_PROMPT_MAP[language] || 'English';

    const systemInstruction = `You are the Eligibility Verification Engine for SchemeGuide AI.
Objectively evaluate if the user satisfies the scheme rules.
Return strictly JSON matching this structure:
{
  "status": "eligible" | "possibly_eligible" | "not_eligible",
  "verdictTitle": "Short descriptive title in ${targetLanguage}",
  "verdictSummary": "Clear 2-sentence explanation of why the user got this verdict in ${targetLanguage}",
  "criteriaEvaluations": [
    { "criterion": "Age Requirement", "status": "pass" | "warning" | "fail", "detail": "Explanation in ${targetLanguage}" },
    { "criterion": "Occupation & Income", "status": "pass" | "warning" | "fail", "detail": "Explanation in ${targetLanguage}" }
  ],
  "recommendedSteps": ["Step 1", "Step 2"],
  "officialDisclaimer": "This is an AI-assisted preliminary assessment based on published guidelines. Final eligibility, biometric authentication, and financial disbursements are determined exclusively by authorized government nodal officers."
}`;

    const promptText = `Evaluate eligibility:
SCHEME:
Name: ${schemeDetails.schemeName}
Age rule: ${schemeDetails.eligibilityCriteria?.ageRequirement || 'N/A'}
Income rule: ${schemeDetails.eligibilityCriteria?.incomeRequirement || 'N/A'}
Occupation rule: ${schemeDetails.eligibilityCriteria?.occupationRequirement || 'N/A'}
Other rules: ${JSON.stringify(schemeDetails.eligibilityCriteria?.otherConditions || [])}

USER PROFILE:
Age: ${userProfile.age}
State: ${userProfile.state}
Occupation: ${userProfile.occupation}
Annual Income: ₹${userProfile.annualIncome || '0'}
Category: ${userProfile.category || 'General'}
Answers to specific questions: ${JSON.stringify(userProfile.customAnswers || {})}

Return strictly valid JSON in ${targetLanguage}.`;

    const rawResponse = await generateWithFallback({
      contents: promptText,
      systemInstruction,
      expectJson: true,
    });

    const parsedData = cleanAndParseJson(rawResponse);
    res.json(parsedData);
  } catch (error: any) {
    console.error('Eligibility check error:', error);
    res.status(500).json({
      error: error?.message || 'Failed to determine eligibility.',
    });
  }
});

// 3. Fast Translation Endpoint
app.post('/api/translate-scheme', async (req: Request, res: Response) => {
  try {
    const { schemeData, targetLanguageCode = 'en' } = req.body;

    if (!schemeData) {
      return res.status(400).json({ error: 'Missing schemeData' });
    }

    const targetLanguage = LANGUAGE_PROMPT_MAP[targetLanguageCode] || 'English';

    const prompt = `Translate and localize this government scheme analysis into ${targetLanguage}.
Keep all numbers, URLs, and structure identical. Output strictly JSON.

DATA:
${JSON.stringify(schemeData)}`;

    const rawResponse = await generateWithFallback({
      contents: prompt,
      expectJson: true,
    });

    const translated = cleanAndParseJson(rawResponse);
    res.json(translated);
  } catch (error: any) {
    console.error('Translation error:', error);
    res.status(500).json({ error: 'Translation failed' });
  }
});

const HUMAN_GREETINGS: Record<string, string> = {
  en: "Hello my friend! I am Mitra, your community welfare companion. How are you and your family doing today? Tell me, what kind of government support or scheme are you looking for?",
  ta: "வணக்கம் நண்பரே! நான் உங்க மித்ரா, கிராம நல வழிகாட்டி. நீங்களும் உங்கள் குடும்பமும் நலமா? சொல்லுங்கள், உங்களுக்கு விவசாயம், மருத்துவம் அல்லது வேறு எந்த உதவி தேவைப்படுகிறது?",
  hi: "नमस्ते भाई! मैं आपका मित्र और समुदाय मार्गदर्शक हूँ। आप और आपका परिवार कैसा है? बताइए, आज आपकी किस सरकारी योजना में सहायता करूँ?",
  te: "నమస్కారం మిత్రమా! నేను మీ మిత్రను. మీరూ మీ కుటుంబం బాగున్నారా? చెప్పండి, మీకు ఏ ప్రభుత్వ పథకం గురించి సహాయం కావాలి?",
  ml: "നമസ്കാരം സുഹൃത്തേ! ഞാൻ നിങ്ങളുടെ മിത്ര. സുഖമാണോ? ഏതു സർക്കാർ പദ്ധതിയെക്കുറിച്ചാണ് നിങ്ങൾക്ക് അറിയേണ്ടത്, പറയൂ?",
  kn: "ನಮಸ್ಕಾರ ಸ್ನೇಹಿತರೇ! ನಾನು ನಿಮ್ಮ ಮಿತ್ರ. ಹೇಗಿದ್ದೀರಾ? ನಿಮಗೆ ಯಾವ ಸರ್ಕಾರಿ ಯೋಜನೆಯ ಬಗ್ಗೆ ಸಹಾಯ ಬೇಕು ತಿಳಿಸಿ?",
};

// Studio-Grade High-Fidelity Gemini TTS with In-Memory Caching and Rate-Limit Circuit Breaker
const audioCache = new Map<string, string>();
let ttsCooldownUntil = 0;

async function synthesizeSpeechAudio(text: string, voiceName: string = 'Kore'): Promise<string | null> {
  if (!text || !text.trim()) return null;

  const cacheKey = `${voiceName}:${text.trim().slice(0, 150)}`;
  if (audioCache.has(cacheKey)) {
    return audioCache.get(cacheKey)!;
  }

  // If rate limit was recently encountered, smoothly return null without hitting API
  if (Date.now() < ttsCooldownUntil) {
    return null;
  }

  try {
    const validVoices = ['Kore', 'Puck', 'Zephyr', 'Fenrir', 'Charon'];
    const chosenVoice = validVoices.includes(voiceName) ? voiceName : 'Kore';

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [{ role: 'user', parts: [{ text }] }],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: chosenVoice },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      audioCache.set(cacheKey, base64Audio);
      // Keep cache bounded
      if (audioCache.size > 100) {
        const firstKey = audioCache.keys().next().value;
        if (firstKey) audioCache.delete(firstKey);
      }
      return base64Audio;
    }
    return null;
  } catch (err: any) {
    // If rate limit (429) is hit, activate 60s cooldown to protect the free tier quota
    if (err?.status === 429 || err?.message?.includes('429') || err?.message?.includes('quota') || err?.message?.includes('RESOURCE_EXHAUSTED')) {
      ttsCooldownUntil = Date.now() + 60000;
    }
    return null;
  }
}

// 4. Full Community Voice Assistant Query Endpoint (Human-to-Human Conversation + Studio Audio)
app.post('/api/voice-query', async (req: Request, res: Response) => {
  try {
    const { schemeContext, question, conversationHistory = [], language = 'en', voiceName = 'Kore' } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    const targetLanguage = LANGUAGE_PROMPT_MAP[language] || 'English';

    // Truly conversational, human-to-human prompt
    const systemInstruction = `You are "Mitra", a warm, empathetic, real human community counselor in India.
You talk like a caring family friend or supportive village welfare elder.
TALK LIKE A REAL HUMAN BEING, NOT A ROBOT:
1. Speak with genuine empathy, warmth, politeness, and care in ${targetLanguage}.
2. Converse naturally like having a friendly chat at a tea stall or panchayat hall.
   - Acknowledge what the citizen is feeling (hope, worry, confusion about paperwork).
   - Use warm words of encouragement: "Don't worry, you are in safe hands", "That's a very practical question!"
   - Address them with respectful warmth (e.g. in Tamil: "வணக்கம்! கவலைப்படாதீங்க...", in Hindi: "नमस्ते भाई/दीदी! बिल्कुल चिंता मत कीजिए...").
3. DO NOT just recite textbook scheme rules. Engage in a true dialogue:
   - Acknowledge their situation and family/profession.
   - Explain the benefit like talking to a friend: mention exact amounts (e.g. ₹6,000 per year) and who qualifies.
   - Always conclude with a natural, friendly follow-up question that invites them to speak back (e.g., "Do you already have an Aadhaar-linked bank account?", "Tell me, how old are you?").
4. Keep the response concise for voice (2 to 4 sentences max), strictly without bullet points, asterisks, or markdown.`;

    const historyText = conversationHistory.length > 0 
      ? `\nPREVIOUS CONVERSATION:\n` + conversationHistory.slice(-4).map((m: any) => `${m.sender === 'user' ? 'Citizen' : 'Mitra'}: ${m.text}`).join('\n')
      : '';

    const promptText = `SCHEME IN CONTEXT:
Name: ${schemeContext?.schemeName || 'Government Scheme'}
Department: ${schemeContext?.department || 'Department of Welfare'}
Summary: ${schemeContext?.simpleExplanation || ''}
Benefits: ${JSON.stringify(schemeContext?.benefits || [])}
Eligibility: ${JSON.stringify(schemeContext?.eligibilityCriteria || {})}
Documents: ${JSON.stringify(schemeContext?.requiredDocuments || [])}
Process: ${JSON.stringify(schemeContext?.applicationProcess || [])}
Official Portal: ${schemeContext?.officialSource?.websiteUrl || 'Official Portal'}
${historyText}

CITIZEN SAID:
"${question}"

Respond warmly and conversationally in ${targetLanguage} like a real human being talking to a citizen friend:`;

    const rawResponse = await generateWithFallback({
      contents: promptText,
      systemInstruction,
    });

    const answerText = rawResponse.trim();

    // Generate high-fidelity studio voice audio (safely cached and rate-protected)
    const audioBase64 = await synthesizeSpeechAudio(answerText, voiceName);

    res.json({
      answerText,
      language: targetLanguage,
      audioBase64,
    });
  } catch (error: any) {
    const lang = req.body.language || 'en';
    const fallback = HUMAN_GREETINGS[lang] || HUMAN_GREETINGS.en;
    res.json({
      answerText: fallback,
      language: lang,
      audioBase64: null,
    });
  }
});

// 5. Standalone Studio Voice Synthesis Endpoint
app.post('/api/synthesize-speech', async (req: Request, res: Response) => {
  try {
    const { text, voiceName = 'Kore' } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required', audioBase64: null });
    }
    const audioBase64 = await synthesizeSpeechAudio(text, voiceName);
    res.json({ audioBase64 });
  } catch {
    res.json({ audioBase64: null });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SchemeGuide AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
