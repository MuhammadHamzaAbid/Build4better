import React from 'react';
import { useLanguage } from '../lib/i18n';
import { IconVolume, IconVolumePlaying } from './Icons';

export default function LanguageToggle() {
  const { lang, setLang, voiceEnabled, toggleVoice } = useLanguage();

  return (
    <nav
      aria-label="Language and audio selection"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 16px',
        backgroundColor: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        gap: '10px'
      }}
    >
      {/* Language Segmented Control */}
      <div style={{
        display: 'inline-flex',
        padding: '3px',
        backgroundColor: 'var(--surface-muted)',
        borderRadius: 'var(--radius-full)',
        border: '1px solid var(--border)'
      }}>
        <button
          type="button"
          onClick={() => setLang('urdu')}
          style={{
            padding: '6px 18px',
            borderRadius: 'var(--radius-full)',
            border: 'none',
            backgroundColor: lang === 'urdu' ? 'var(--surface)' : 'transparent',
            color: lang === 'urdu' ? 'var(--primary)' : 'var(--text-secondary)',
            boxShadow: lang === 'urdu' ? 'var(--shadow-sm)' : 'none',
            fontFamily: 'var(--font-urdu)',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          اردو
        </button>

        <button
          type="button"
          onClick={() => setLang('roman')}
          style={{
            padding: '6px 18px',
            borderRadius: 'var(--radius-full)',
            border: 'none',
            backgroundColor: lang === 'roman' ? 'var(--surface)' : 'transparent',
            color: lang === 'roman' ? 'var(--primary)' : 'var(--text-secondary)',
            boxShadow: lang === 'roman' ? 'var(--shadow-sm)' : 'none',
            fontFamily: 'var(--font-sans)',
            fontSize: '15px',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          Roman
        </button>
      </div>

      {/* Voice Toggle */}
      <button
        type="button"
        onClick={toggleVoice}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '7px',
          height: '38px',
          padding: '0 14px',
          borderRadius: 'var(--radius-full)',
          border: '1px solid',
          borderColor: voiceEnabled ? 'var(--primary)' : 'var(--border)',
          backgroundColor: voiceEnabled ? 'var(--primary-soft)' : 'var(--surface)',
          color: voiceEnabled ? 'var(--primary)' : 'var(--text-secondary)',
          fontSize: '14px',
          fontWeight: '700',
          cursor: 'pointer'
        }}
        title="Toggle voice narration"
      >
        {voiceEnabled ? <IconVolumePlaying size={17} /> : <IconVolume size={17} />}
        <span>{voiceEnabled ? 'Aawaz On' : 'Aawaz Off'}</span>
      </button>
    </nav>
  );
}
