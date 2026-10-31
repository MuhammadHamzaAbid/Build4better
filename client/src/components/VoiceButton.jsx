import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../lib/i18n';
import { IconVolume, IconVolumePlaying } from './Icons';

export default function VoiceButton({ text, stepId, autoPlay = false }) {
  const { lang, voiceEnabled } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (autoPlay && voiceEnabled && text) {
      // Small timeout to allow render completion
      const timer = setTimeout(() => {
        handlePlay(true);
      }, 350);
      return () => clearTimeout(timer);
    }
    return () => {
      stopAudio();
    };
  }, [text, stepId]);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
  };

  const handlePlay = async (isAuto = false) => {
    if (isPlaying && !isAuto) {
      stopAudio();
      return;
    }

    if (!text) return;

    stopAudio();
    setIsPlaying(true);

    try {
      // 1. Direct fetch to our enhanced /api/tts endpoint
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          lang: lang === 'urdu' ? 'ur' : 'roman'
        })
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audioRef.current = audio;

        audio.onended = () => {
          setIsPlaying(false);
          URL.revokeObjectURL(url);
        };
        audio.onerror = () => {
          setIsPlaying(false);
          URL.revokeObjectURL(url);
          tryFallbackSpeech();
        };

        await audio.play().catch((err) => {
          // If browser policy prevents autoplay without interaction
          console.warn('Playback gesture policy or error:', err.message);
          setIsPlaying(false);
          if (!isAuto) {
            tryFallbackSpeech();
          }
        });
        return;
      }
    } catch (err) {
      console.warn('API TTS failed:', err.message);
    }

    if (!isAuto) {
      tryFallbackSpeech();
    } else {
      setIsPlaying(false);
    }
  };

  const tryFallbackSpeech = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && text) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        const isUrduScript = /[\u0600-\u06FF]/.test(text);

        // Try to find an Urdu or Hindi voice
        const voices = window.speechSynthesis.getVoices();
        const targetVoice = voices.find(v => v.lang.startsWith('ur') || v.lang.startsWith('hi')) || null;
        if (targetVoice) {
          utterance.voice = targetVoice;
          utterance.lang = targetVoice.lang;
        } else {
          utterance.lang = isUrduScript ? 'ur-PK' : 'en-US';
        }

        utterance.rate = 0.85;
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);

        window.speechSynthesis.speak(utterance);
      } catch {
        setIsPlaying(false);
      }
    } else {
      setIsPlaying(false);
    }
  };

  const isUrdu = lang === 'urdu';

  return (
    <button
      type="button"
      onClick={() => handlePlay(false)}
      aria-label={isPlaying ? (isUrdu ? 'آواز بند کریں' : 'Aawaz rokein') : (isUrdu ? 'آواز سنیں' : 'Aawaz sunein')}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '9px 18px',
        minHeight: '44px',
        borderRadius: 'var(--radius-full)',
        border: isPlaying ? '1.5px solid var(--primary)' : '1.5px solid var(--border)',
        backgroundColor: isPlaying ? 'var(--primary-soft)' : 'var(--surface)',
        color: isPlaying ? 'var(--primary)' : 'var(--text)',
        fontSize: isUrdu ? '18px' : '15px',
        fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-sans)',
        fontWeight: '700',
        cursor: 'pointer',
        boxShadow: isPlaying ? 'var(--shadow-md)' : 'var(--shadow-sm)',
        transition: 'all 0.15s ease'
      }}
    >
      {isPlaying ? <IconVolumePlaying size={18} /> : <IconVolume size={18} />}
      <span>{isPlaying ? (isUrdu ? 'روکیں' : 'Ruk Jayein') : (isUrdu ? 'سنیں' : 'Suno')}</span>
    </button>
  );
}
