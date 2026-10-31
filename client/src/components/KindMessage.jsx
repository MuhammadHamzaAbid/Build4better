import React from 'react';
import { useLanguage } from '../lib/i18n';
import { IconLightbulb, IconUndo, IconRotate } from './Icons';

export default function KindMessage({ explanation, onUndo, onRetry }) {
  const { lang, t } = useLanguage();
  const isUrdu = lang === 'urdu';

  return (
    <div
      role="alert"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        maxWidth: '430px',
        margin: '0 auto',
        backgroundColor: 'var(--gentle-soft)',
        borderTop: '2px solid var(--gentle)',
        borderTopLeftRadius: 'var(--radius-xl)',
        borderTopRightRadius: 'var(--radius-xl)',
        padding: '24px 20px',
        boxShadow: 'var(--shadow-lg)',
        zIndex: 200,
        animation: 'slideUpCard 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '18px' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--gentle-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--gentle-text)',
          flexShrink: 0
        }}>
          <IconLightbulb size={24} />
        </div>

        <div style={{ flex: 1 }}>
          <h4 style={{
            fontSize: isUrdu ? '22px' : '18px',
            fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-sans)',
            color: 'var(--gentle-text)',
            marginBottom: '4px',
            fontWeight: '700',
            direction: isUrdu ? 'rtl' : 'ltr'
          }}>
            {isUrdu ? 'کوئی بات نہیں، یہ سب سے ہوتا ہے!' : 'Koi baat nahi, yeh sab se hota hai!'}
          </h4>

          <p style={{
            fontSize: isUrdu ? '21px' : '17px',
            fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-sans)',
            lineHeight: isUrdu ? '1.9' : '1.45',
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
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--gentle-border)',
            backgroundColor: '#FFFFFF',
            color: 'var(--gentle-text)',
            fontSize: isUrdu ? '19px' : '16px',
            fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-sans)',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <IconUndo size={18} />
          <span>{isUrdu ? 'واپس چلیں' : 'Wapas Jayein (Undo)'}</span>
        </button>

        <button
          type="button"
          onClick={onRetry}
          style={{
            flex: 1,
            minHeight: '52px',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            backgroundColor: 'var(--gentle)',
            color: '#FFFFFF',
            fontSize: isUrdu ? '19px' : '16px',
            fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-sans)',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <IconRotate size={18} />
          <span>{isUrdu ? 'دوبارہ کوشش' : 'Dobara Koshish'}</span>
        </button>
      </div>
    </div>
  );
}
