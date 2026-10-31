import React from 'react';
import { useLanguage } from '../lib/i18n';

export default function SuccessBurst() {
  const { lang } = useLanguage();
  const isUrdu = lang === 'urdu';

  return (
    <div
      style={{
        position: 'fixed',
        top: '40%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'var(--primary-soft)',
        border: '3px solid var(--primary)',
        borderRadius: '24px',
        padding: '24px 36px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 12px 32px rgba(15, 110, 90, 0.25)',
        zIndex: 300,
        animation: 'popIn 0.3s ease-out'
      }}
    >
      <div style={{ fontSize: '48px', marginBottom: '8px' }}>✅</div>
      <h3 style={{
        color: 'var(--primary)',
        fontSize: isUrdu ? '30px' : '26px',
        fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-roman)',
        fontWeight: 'bold'
      }}>
        {isUrdu ? 'شاباش! بالکل ٹھیک۔' : 'Shabash! Bilkul Theek.'}
      </h3>
    </div>
  );
}
