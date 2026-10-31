import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../lib/i18n';

export default function VoiceButton({ text, lessonId, stepId, autoPlay = false }) {
  const { lang, voiceEnabled } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (autoPlay && voiceEnabled && text) {
      handlePlay();
    }
    return () => {
      stopAudio();
    };
  }, [text, stepId]);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
  };

  const handlePlay = async () => {
    if (isPlaying) {
      stopAudio();
      return;
    }

    setIsPlaying(true);

    // Try 1: Call /api/tts endpoint
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, lang: 'ur' })
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audioRef.current = audio;
        audio.onended = () => setIsPlaying(false);
        audio.onerror = () => tryFallback();
        await audio.play();
        return;
      }
    } catch {
      // Proceed to fallback
    }

    tryFallback();
  };

  const tryFallback = () => {
    // Try 2: Browser SpeechSynthesis
    if ('speechSynthesis' in window && text) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'urdu' ? 'ur-PK' : 'en-US';
      utterance.rate = 0.85;
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setIsPlaying(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handlePlay}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 18px',
        borderRadius: '24px',
        border: '2px solid var(--primary)',
        backgroundColor: isPlaying ? 'var(--primary-soft)' : 'var(--surface)',
        color: 'var(--primary)',
        fontSize: '18px',
        fontWeight: 'bold',
        cursor: 'pointer',
        boxShadow: '0 2px 4px rgba(0,0,0,0.06)',
        transition: 'all 0.2s ease'
      }}
    >
      <span>{isPlaying ? '⏹️' : '🔊'}</span>
      <span>{isPlaying ? (lang === 'urdu' ? 'روکیں' : 'Ruk Jayein') : (lang === 'urdu' ? 'سنیں' : 'Suno')}</span>
    </button>
  );
}
