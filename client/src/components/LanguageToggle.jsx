import React from 'react';
import { useLanguage } from '../lib/i18n';

export default function LanguageToggle() {
  const { lang, setLang, voiceEnabled, toggleVoice } = useLanguage();

  return (
    <div style={{
      display: 'flex',
      gap: '8px',
      padding: '12px 16px',
      backgroundColor: 'var(--surface)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      justifyContent: 'center'
    }}>
      <button
        type="button"
        onClick={() => setLang('urdu')}
        style={{
          flex: 1,
          height: '46px',
          borderRadius: '23px',
          border: '2px solid var(--primary)',
          backgroundColor: lang === 'urdu' ? 'var(--primary)' : 'var(--surface)',
          color: lang === 'urdu' ? '#FFFFFF' : 'var(--primary)',
          fontFamily: 'var(--font-urdu)',
          fontSize: '20px',
          cursor: 'pointer',
          fontWeight: 'bold',
          transition: 'all 0.2s ease'
        }}
      >
        اردو
      </button>

      <button
        type="button"
        onClick={() => setLang('roman')}
        style={{
          flex: 1,
          height: '46px',
          borderRadius: '23px',
          border: '2px solid var(--primary)',
          backgroundColor: lang === 'roman' ? 'var(--primary)' : 'var(--surface)',
          color: lang === 'roman' ? '#FFFFFF' : 'var(--primary)',
          fontFamily: 'var(--font-roman)',
          fontSize: '18px',
          cursor: 'pointer',
          fontWeight: 'bold',
          transition: 'all 0.2s ease'
        }}
      >
        Roman
      </button>

      <button
        type="button"
        onClick={toggleVoice}
        style={{
          height: '46px',
          padding: '0 16px',
          borderRadius: '23px',
          border: voiceEnabled ? '2px solid var(--primary)' : '2px solid var(--border)',
          backgroundColor: voiceEnabled ? 'var(--primary-soft)' : 'var(--surface)',
          color: voiceEnabled ? 'var(--primary)' : 'var(--muted)',
          fontSize: '16px',
          cursor: 'pointer',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          transition: 'all 0.2s ease'
        }}
        title="Voice audio toggle"
      >
        <span>🔊</span>
        <span>{voiceEnabled ? 'On' : 'Off'}</span>
      </button>
    </div>
  );
}
