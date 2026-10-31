import React from 'react';
import { useLanguage } from '../lib/i18n';

export default function KindMessage({ explanation, onUndo, onRetry }) {
  const { lang, t } = useLanguage();
  const isUrdu = lang === 'urdu';

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        maxWidth: '430px',
        margin: '0 auto',
        backgroundColor: 'var(--gentle-soft)',
        borderTop: '3px solid var(--gentle)',
        borderTopLeftRadius: '24px',
        borderTopRightRadius: '24px',
        padding: '24px 20px',
        boxShadow: '0 -8px 24px rgba(0,0,0,0.12)',
        zIndex: 200,
        animation: 'slideUp 0.3s ease-out'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '16px' }}>
        <div style={{
          fontSize: '28px',
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          backgroundColor: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          💡
        </div>

        <div style={{ flex: 1 }}>
          <h4 style={{
            fontSize: isUrdu ? '24px' : '20px',
            fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-roman)',
            color: '#8A5200',
            marginBottom: '6px',
            direction: isUrdu ? 'rtl' : 'ltr'
          }}>
            {isUrdu ? 'کوئی بات نہیں، یہ سب سے ہوتا ہے!' : 'Koi baat nahi, yeh sab se hota hai!'}
          </h4>

          <p style={{
            fontSize: isUrdu ? '22px' : '18px',
            fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-roman)',
            lineHeight: isUrdu ? '1.8' : '1.4',
            color: 'var(--text)',
            direction: isUrdu ? 'rtl' : 'ltr'
          }}>
            {t(explanation)}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          type="button"
          onClick={onUndo}
          style={{
            flex: 1,
            minHeight: '52px',
            borderRadius: '16px',
            border: '2px solid var(--gentle)',
            backgroundColor: '#FFFFFF',
            color: '#8A5200',
            fontSize: isUrdu ? '20px' : '17px',
            fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-roman)',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          {isUrdu ? 'واپس چلتے ہیں' : 'Wapas Jayein (Undo)'}
        </button>

        <button
          type="button"
          onClick={onRetry}
          style={{
            flex: 1,
            minHeight: '52px',
            borderRadius: '16px',
            border: 'none',
            backgroundColor: 'var(--gentle)',
            color: '#FFFFFF',
            fontSize: isUrdu ? '20px' : '17px',
            fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-roman)',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          {isUrdu ? 'دوبارہ کوشش کریں' : 'Dobara Koshish'}
        </button>
      </div>
    </div>
  );
}
