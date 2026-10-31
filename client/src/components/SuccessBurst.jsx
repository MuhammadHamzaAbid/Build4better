import React from 'react';
import { useLanguage } from '../lib/i18n';
import { IconCheckCircle } from './Icons';

export default function SuccessBurst() {
  const { lang } = useLanguage();
  const isUrdu = lang === 'urdu';

  return (
    <div
      role="status"
      style={{
        position: 'fixed',
        top: '42%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'var(--surface)',
        border: '2px solid var(--primary)',
        borderRadius: 'var(--radius-xl)',
        padding: '24px 32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: 'var(--shadow-lg)',
        zIndex: 300,
        animation: 'fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      <div style={{ color: 'var(--primary)', marginBottom: '8px' }}>
        <IconCheckCircle size={44} />
      </div>
      <h3 style={{
        color: 'var(--primary)',
        fontSize: isUrdu ? '28px' : '22px',
        fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-sans)',
        fontWeight: '800'
      }}>
        {isUrdu ? 'شاباش! بالکل درست۔' : 'Shabash! Bilkul Theek.'}
      </h3>
    </div>
  );
}
