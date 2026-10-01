import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Square, Sparkles } from 'lucide-react';
import { SupportedLanguage } from '../types/scheme';
import { synthesizeSpeech } from '../services/api';

interface Props {
  textToRead: string;
  language: SupportedLanguage;
  label?: string;
}

const LANG_CODE_MAP: Record<SupportedLanguage, string> = {
  en: 'en-IN',
  ta: 'ta-IN',
  hi: 'hi-IN',
  te: 'te-IN',
  ml: 'ml-IN',
  kn: 'kn-IN',
};

export const AudioPlayerButton: React.FC<Props> = ({
  textToRead,
  language,
  label = 'Listen Explanation',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setIsLoading(false);
  };

  const handleTogglePlay = async () => {
    if (isPlaying || isLoading) {
      stopAudio();
      return;
    }

    setIsLoading(true);

    // 1. Try Gemini Studio-Quality AI TTS
    try {
      const res = await synthesizeSpeech({
        text: textToRead,
        voiceName: 'Kore',
      });

      if (res.audioBase64) {
        const audio = new Audio(`data:audio/wav;base64,${res.audioBase64}`);
        audioRef.current = audio;

        audio.onplay = () => {
          setIsLoading(false);
          setIsPlaying(true);
        };
        audio.onended = () => {
          setIsPlaying(false);
          audioRef.current = null;
        };
        audio.onerror = () => {
          fallbackSpeechSynthesis();
        };

        await audio.play();
        return;
      }
    } catch {
      // Continue to fallback
    }

    // 2. Fallback to Browser SpeechSynthesis
    fallbackSpeechSynthesis();
  };

  const fallbackSpeechSynthesis = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsLoading(false);
      setIsPlaying(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToRead);
    const targetCode = LANG_CODE_MAP[language] || 'en-IN';
    utterance.lang = targetCode;
    utterance.rate = 0.95;

    const currentVoices = window.speechSynthesis.getVoices();
    const langPrefix = targetCode.slice(0, 2);
    const matchedVoice = currentVoices.find(
      (v) => v.lang.startsWith(langPrefix) || v.lang.includes(targetCode)
    ) || currentVoices.find((v) => v.lang.includes('IN') || v.lang.includes('en'));

    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onstart = () => {
      setIsLoading(false);
      setIsPlaying(true);
    };
    utterance.onend = () => {
      setIsPlaying(false);
    };
    utterance.onerror = () => {
      setIsLoading(false);
      setIsPlaying(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  return (
    <button
      type="button"
      onClick={handleTogglePlay}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
        isPlaying
          ? 'bg-rose-600 text-white animate-pulse'
          : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/80'
      }`}
      title={isPlaying ? 'Stop listening' : `Listen with High Quality Voice in ${language.toUpperCase()}`}
    >
      {isLoading ? (
        <>
          <div className="w-3 h-3 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span>Generating Voice...</span>
        </>
      ) : isPlaying ? (
        <>
          <Square className="w-3.5 h-3.5 fill-current" />
          <span>Stop Audio</span>
        </>
      ) : (
        <>
          <Volume2 className="w-3.5 h-3.5 text-indigo-600" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
};
