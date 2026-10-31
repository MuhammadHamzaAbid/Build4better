import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../lib/i18n';
import { IconVolume, IconVolumePlaying } from './Icons';

export default function VoiceButton({ text, stepId, autoPlay = false }) {
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

    // Call /api/tts endpoint
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
      // Fallback
    }

    tryFallback();
  };

  const tryFallback = () => {
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

  const isUrdu = lang === 'urdu';

  return (
    <button
      type="button"
      onClick={handlePlay}
      aria-label={isPlaying ? 'Aawaz rokein' : 'Aawaz sunein'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 16px',
        borderRadius: 'var(--radius-full)',
        border: '1.5px solid var(--primary)',
        backgroundColor: isPlaying ? 'var(--primary-soft)' : 'var(--surface)',
        color: 'var(--primary)',
        fontSize: isUrdu ? '18px' : '15px',
        fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-sans)',
        fontWeight: 'bold',
        cursor: 'pointer',
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      {isPlaying ? <IconVolumePlaying size={18} /> : <IconVolume size={18} />}
      <span>{isPlaying ? (isUrdu ? 'روکیں' : 'Ruk Jayein') : (isUrdu ? 'سنیں' : 'Suno')}</span>
    </button>
  );
}
