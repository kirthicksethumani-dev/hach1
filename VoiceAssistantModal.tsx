import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  X,
  Sparkles,
  Send,
  Square,
  Users,
  Lightbulb,
  Sliders,
  Globe,
  Radio,
  VolumeX,
} from 'lucide-react';
import { SchemeAnalysis, SupportedLanguage } from '../types/scheme';
import { askVoiceAssistant, synthesizeSpeech } from '../services/api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  activeScheme: SchemeAnalysis | null;
  currentLanguage: SupportedLanguage;
  onLanguageChange?: (lang: SupportedLanguage) => void;
}

interface Message {
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  audioBase64?: string | null;
}

const SUPPORTED_LANGUAGES: { code: SupportedLanguage; name: string; nativeName: string; bcp47: string }[] = [
  { code: 'en', name: 'English', nativeName: 'English (Indian)', bcp47: 'en-IN' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', bcp47: 'ta-IN' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', bcp47: 'hi-IN' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', bcp47: 'te-IN' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', bcp47: 'ml-IN' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', bcp47: 'kn-IN' },
];

const HUMAN_GREETINGS: Record<SupportedLanguage, string> = {
  en: "Hello my friend! I am Mitra, your community welfare guide. How are you and your family doing today? Tell me, what kind of government support or scheme are you looking for?",
  ta: "வணக்கம் நண்பரே! நான் உங்க மித்ரா, கிராம நல வழிகாட்டி. நீங்களும் உங்கள் குடும்பமும் நலமா? சொல்லுங்கள், உங்களுக்கு விவசாயம், மருத்துவம் அல்லது வேறு எந்த உதவி தேவைப்படுகிறது?",
  hi: "नमस्ते भाई! मैं आपका मित्र और समुदाय मार्गदर्शक हूँ। आप और आपका परिवार कैसा है? बताइए, आज मैं आपकी किस सरकारी योजना में मदद करूँ?",
  te: "నమస్కారం మిత్రమా! నేను మీ మిత్రను. మీరూ మీ కుటుంబం క్షేమమేనా? చెప్పండి, మీకు ఏ ప్రభుత్వ సంక్షేమ పథకం గురించి వివరాలు కావాలి?",
  ml: "നമസ്കാരം സുഹൃത്തേ! ഞാൻ നിങ്ങളുടെ മിത്ര. സുഖമാണോ? ഏതു സർക്കാർ പദ്ധതിയെക്കുറിച്ചാണ് നിങ്ങൾക്ക് അറിയേണ്ടത്, പറയൂ?",
  kn: "ನಮಸ್ಕಾರ ಸ್ನೇಹಿತರೇ! ನಾನು ನಿಮ್ಮ ಮಿತ್ರ. ಹೇಗಿದ್ದೀರಾ? ನಿಮಗೆ ಯಾವ ಸರ್ಕಾರಿ ಯೋಜನೆಯ ಬಗ್ಗೆ ಸಹಾಯ ಬೇಕು ತಿಳಿಸಿ?",
};

const COMMUNITY_TIPS = [
  'Community Tip: Keep your Aadhaar linked with your bank account & mobile number for instant OTP.',
  'Community Tip: Never pay cash to middlemen. Government portal registration is 100% free.',
  'Community Tip: Carry 2 photocopies of your Aadhaar and bank passbook when visiting the CSC centre.',
  'Community Tip: If your land Patta/Chitta is in a joint family name, ensure your individual name is seeded.',
  'Community Tip: Always check your application status using your Application Reference Number online.',
];

const STUDIO_VOICES = [
  { id: 'Kore', name: '👩 Asha (Warm Female - Studio AI)', gender: 'female' },
  { id: 'Puck', name: '👨 Anand (Helpful Male - Studio AI)', gender: 'male' },
  { id: 'Zephyr', name: '✨ Zephyr (Gentle Female - Studio AI)', gender: 'female' },
  { id: 'Fenrir', name: '🏛️ Fenrir (Deep Male - Studio AI)', gender: 'male' },
];

export const VoiceAssistantModal: React.FC<Props> = ({
  isOpen,
  onClose,
  activeScheme,
  currentLanguage,
  onLanguageChange,
}) => {
  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>(currentLanguage);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [autoListenNext, setAutoListenNext] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [transcript, setTranscript] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  // High-fidelity voice selection
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>('Kore');
  const [useStudioAudio, setUseStudioAudio] = useState(true);

  // Rotating tips
  const [activeTipIdx, setActiveTipIdx] = useState(0);

  // Active audio player reference
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'assistant',
      text: HUMAN_GREETINGS[currentLanguage] || HUMAN_GREETINGS.en,
      timestamp: 'Just now',
    },
  ]);

  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync selected language with prop
  useEffect(() => {
    setSelectedLang(currentLanguage);
  }, [currentLanguage]);

  // Rotate community tips
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTipIdx((prev) => (prev + 1) % COMMUNITY_TIPS.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  // Initialize Speech Recognition for chosen language
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        const bcp47 = SUPPORTED_LANGUAGES.find((l) => l.code === selectedLang)?.bcp47 || 'en-IN';
        recognition.lang = bcp47;

        recognition.onstart = () => {
          setIsListening(true);
          setTranscript('');
        };

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition notice:', event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      stopAudio();
    };
  }, [selectedLang]);

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // When speech recognition ends with transcript, submit automatically
  useEffect(() => {
    if (!isListening && transcript.trim()) {
      handleUserQuery(transcript.trim());
      setTranscript('');
    }
  }, [isListening]);

  const stopAudio = () => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
      currentAudioRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  const playStudioOrFallback = async (text: string, audioBase64?: string | null) => {
    stopAudio();

    // 1. If Studio AI audio is provided, play crystal-clear 24kHz WAV!
    if (useStudioAudio && audioBase64) {
      try {
        const audio = new Audio(`data:audio/wav;base64,${audioBase64}`);
        currentAudioRef.current = audio;

        audio.onplay = () => setIsSpeaking(true);
        audio.onended = () => {
          setIsSpeaking(false);
          currentAudioRef.current = null;
          // Trigger next question if hands-free conversation mode is on
          if (autoListenNext && recognitionRef.current) {
            setTimeout(() => {
              try {
                recognitionRef.current.start();
              } catch {
                // ignore
              }
            }, 800);
          }
        };
        audio.onerror = () => {
          fallbackSpeechSynthesis(text);
        };

        await audio.play();
        return;
      } catch {
        fallbackSpeechSynthesis(text);
        return;
      }
    }

    // 2. If no pre-generated audio, try synthesizing via Gemini TTS on-demand
    if (useStudioAudio) {
      try {
        const synthRes = await synthesizeSpeech({ text, voiceName: selectedVoiceId });
        if (synthRes.audioBase64) {
          const audio = new Audio(`data:audio/wav;base64,${synthRes.audioBase64}`);
          currentAudioRef.current = audio;
          audio.onplay = () => setIsSpeaking(true);
          audio.onended = () => {
            setIsSpeaking(false);
            currentAudioRef.current = null;
          };
          await audio.play();
          return;
        }
      } catch {
        // Continue to browser fallback
      }
    }

    // 3. Fallback to browser SpeechSynthesis
    fallbackSpeechSynthesis(text);
  };

  const fallbackSpeechSynthesis = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const bcp47 = SUPPORTED_LANGUAGES.find((l) => l.code === selectedLang)?.bcp47 || 'en-IN';
    utterance.lang = bcp47;
    utterance.rate = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const langPrefix = bcp47.slice(0, 2);
    const matched = voices.find((v) => v.lang.startsWith(langPrefix)) ||
      voices.find((v) => v.lang.includes('IN') || v.lang.includes('en'));

    if (matched) {
      utterance.voice = matched;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please type your message below.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      stopAudio();
      try {
        const bcp47 = SUPPORTED_LANGUAGES.find((l) => l.code === selectedLang)?.bcp47 || 'en-IN';
        recognitionRef.current.lang = bcp47;
        recognitionRef.current.start();
      } catch (e) {
        console.warn('Recognition retry notice:', e);
      }
    }
  };

  const handleLanguageSwitch = async (newLang: SupportedLanguage) => {
    setSelectedLang(newLang);
    if (onLanguageChange) {
      onLanguageChange(newLang);
    }

    // Mitra warmly welcomes the citizen in the new language
    const greeting = HUMAN_GREETINGS[newLang] || HUMAN_GREETINGS.en;
    const welcomeMsg: Message = {
      sender: 'assistant',
      text: greeting,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, welcomeMsg]);
    playStudioOrFallback(greeting);
  };

  const handleUserQuery = async (queryText: string) => {
    if (!queryText.trim() || isLoading) return;

    const userMsg: Message = {
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await askVoiceAssistant({
        schemeContext: activeScheme,
        question: queryText,
        conversationHistory: messages.slice(-4),
        language: selectedLang,
        voiceName: selectedVoiceId,
      });

      const assistantMsg: Message = {
        sender: 'assistant',
        text: res.answerText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        audioBase64: res.audioBase64,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      playStudioOrFallback(res.answerText, res.audioBase64);
    } catch {
      const fallback = HUMAN_GREETINGS[selectedLang] || HUMAN_GREETINGS.en;
      const assistantMsg: Message = {
        sender: 'assistant',
        text: fallback,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
      playStudioOrFallback(fallback);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (textInput.trim()) {
      handleUserQuery(textInput.trim());
      setTextInput('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[88vh] animate-fadeIn">
        {/* Assistant Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400 shadow-xs relative">
              <Users className="w-5 h-5 text-indigo-300" />
              {isSpeaking && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full animate-ping" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm sm:text-base">Mitra • Community Guide</h3>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Radio className="w-3 h-3 text-indigo-400 animate-pulse" />
                  <span>Studio AI Voice</span>
                </span>
              </div>
              <p className="text-xs text-slate-300 truncate max-w-xs">
                {activeScheme ? activeScheme.schemeName : 'Speak naturally in any Indian language'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Voice Settings Toggle */}
            <button
              type="button"
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-xl transition-colors ${
                showSettings ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
              title="Voice Customizer & High-Fidelity Studio Voices"
            >
              <Sliders className="w-4 h-4" />
            </button>

            {isSpeaking && (
              <button
                type="button"
                onClick={stopAudio}
                className="px-2.5 py-1.5 rounded-xl bg-rose-500/90 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1 transition-colors shadow-xs"
                title="Mute voice"
              >
                <Square className="w-3 h-3 fill-current" />
                <span>Mute</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Language Selection Tabs */}
        <div className="bg-slate-800 text-white px-4 py-2 border-b border-slate-700 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
            <Globe className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleLanguageSwitch(lang.code)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  selectedLang === lang.code
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-700/70 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {lang.nativeName}
              </button>
            ))}
          </div>
        </div>

        {/* Expandable Voice Settings Drawer */}
        {showSettings && (
          <div className="bg-slate-100 p-4 border-b border-slate-200 text-xs text-slate-700 space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                High-Quality AI Voice Selection
              </span>
              <label className="flex items-center gap-1.5 text-indigo-700 font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={useStudioAudio}
                  onChange={(e) => setUseStudioAudio(e.target.checked)}
                  className="rounded text-indigo-600"
                />
                <span>Studio Audio (24kHz HD)</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {STUDIO_VOICES.map((voice) => (
                <button
                  key={voice.id}
                  type="button"
                  onClick={() => setSelectedVoiceId(voice.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    selectedVoiceId === voice.id
                      ? 'border-indigo-600 bg-white text-indigo-900 font-bold shadow-xs'
                      : 'border-slate-200 bg-white/70 text-slate-700 hover:bg-white'
                  }`}
                >
                  <div className="text-xs">{voice.name}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Crystal-clear Indian pronunciation
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Live Community Advice Banner */}
        <div className="bg-amber-50/90 border-b border-amber-200/80 px-4 py-2 text-xs text-amber-900 flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
          <span className="truncate font-medium">{COMMUNITY_TIPS[activeTipIdx]}</span>
        </div>

        {/* Chat Message Thread */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 min-h-[220px]">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${
                msg.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-xs font-medium'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs'
                }`}
              >
                <p>{msg.text}</p>
                {msg.sender === 'assistant' && (
                  <div className="mt-2.5 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => playStudioOrFallback(msg.text, msg.audioBase64)}
                      className="inline-flex items-center gap-1.5 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded-lg"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Listen in HD</span>
                    </button>
                  </div>
                )}
              </div>
              <span className="text-[10px] text-slate-400 mt-1 px-1">
                {msg.sender === 'user' ? 'You' : 'Mitra'} • {msg.timestamp}
              </span>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-indigo-600 font-semibold p-2">
              <div className="w-3.5 h-3.5 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
              <span>Mitra is listening and formulating human voice response...</span>
            </div>
          )}

          {isListening && (
            <div className="flex items-center gap-2 p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-800 animate-pulse">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              <span>
                Listening in {SUPPORTED_LANGUAGES.find((l) => l.code === selectedLang)?.nativeName}... {transcript ? `"${transcript}"` : 'Please speak naturally'}
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Human Conversation Starter Chips */}
        <div className="px-4 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[11px] scrollbar-none">
          <span className="text-slate-400 font-bold shrink-0">Ask Mitra:</span>
          <button
            type="button"
            onClick={() => handleUserQuery('Hello Mitra! Can you explain this scheme simply?')}
            className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 font-medium whitespace-nowrap transition-colors"
          >
            👋 Hello Mitra!
          </button>
          <button
            type="button"
            onClick={() => handleUserQuery('Am I eligible for this assistance?')}
            className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 font-medium whitespace-nowrap transition-colors"
          >
            ⚖️ Am I eligible?
          </button>
          <button
            type="button"
            onClick={() => handleUserQuery('How much financial benefit will my family get?')}
            className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 font-medium whitespace-nowrap transition-colors"
          >
            💰 Benefit amount?
          </button>
          <button
            type="button"
            onClick={() => handleUserQuery('What documents do I need to prepare?')}
            className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 font-medium whitespace-nowrap transition-colors"
          >
            📑 Documents needed?
          </button>
        </div>

        {/* Voice & Input Controls Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200">
          <div className="flex items-center gap-2">
            {/* Big Mic Button */}
            <button
              type="button"
              onClick={toggleListening}
              className={`p-3 rounded-2xl text-white transition-all shadow-md shrink-0 flex items-center justify-center ${
                isListening
                  ? 'bg-rose-600 animate-pulse ring-4 ring-rose-200'
                  : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95'
              }`}
              title={isListening ? 'Stop listening' : 'Click and speak in your language'}
            >
              {isListening ? (
                <MicOff className="w-5 h-5 text-white" />
              ) : (
                <Mic className="w-5 h-5 text-white" />
              )}
            </button>

            {/* Text Input Fallback */}
            <form onSubmit={handleFormSubmit} className="flex-1 flex gap-1.5">
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder={
                  isListening
                    ? `Listening in ${SUPPORTED_LANGUAGES.find((l) => l.code === selectedLang)?.nativeName}...`
                    : `Talk or type to Mitra in ${SUPPORTED_LANGUAGES.find((l) => l.code === selectedLang)?.nativeName}...`
                }
                className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-100"
              />
              <button
                type="submit"
                disabled={!textInput.trim() || isLoading}
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white transition-colors shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={autoListenNext}
                onChange={(e) => setAutoListenNext(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span>Continuous Voice Chat Mode</span>
            </label>
            <span className="font-semibold text-slate-600">
              Voice: {STUDIO_VOICES.find((v) => v.id === selectedVoiceId)?.name.split(' ')[1] || 'Asha'} (Studio AI)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
