import React from 'react';
import { useLanguage } from '../lib/i18n';
import VoiceButton from './VoiceButton';

export default function StepCard({
  step,
  stepIndex,
  totalSteps,
  children,
  onWrongTap
}) {
  const { lang, t } = useLanguage();
  const isUrdu = lang === 'urdu';

  const progressPercent = Math.round(((stepIndex + 1) / totalSteps) * 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px' }}>
      {/* Step Counter & Progress Track */}
      <div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px'
        }}>
          <span style={{
            fontSize: isUrdu ? '22px' : '17px',
            fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-sans)',
            fontWeight: '700',
            color: 'var(--primary)'
          }}>
            {isUrdu ? `قدم ${stepIndex + 1} از ${totalSteps}` : `Qadam ${stepIndex + 1} / ${totalSteps}`}
          </span>
          <span style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: '600', fontFamily: 'var(--font-mono)' }}>
            {progressPercent}%
          </span>
        </div>

        <div style={{
          width: '100%',
          height: '6px',
          borderRadius: 'var(--radius-full)',
          backgroundColor: 'var(--border)',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${progressPercent}%`,
            height: '100%',
            backgroundColor: 'var(--primary)',
            borderRadius: 'var(--radius-full)',
            transition: 'width 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
          }} />
        </div>
      </div>

      {/* Mock Screen Surface */}
      <div
        onClick={onWrongTap}
        style={{
          position: 'relative',
          width: '100%',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-md)',
          cursor: 'pointer'
        }}
      >
        <img
          src={step.image}
          alt={`Step ${stepIndex + 1}`}
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
            pointerEvents: 'none',
            userSelect: 'none'
          }}
        />
        {/* Child hotspot layer */}
        {children}
      </div>

      {/* Explanation & Question Card */}
      <div style={{
        backgroundColor: 'var(--surface)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '12px',
          marginBottom: '14px'
        }}>
          <p style={{
            fontSize: isUrdu ? '23px' : '18px',
            fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-sans)',
            lineHeight: isUrdu ? '2.1' : '1.5',
            color: 'var(--text)',
            direction: isUrdu ? 'rtl' : 'ltr',
            flex: 1
          }}>
            {t(step.explain)}
          </p>

          <VoiceButton
            text={step.explain?.voice || t(step.explain)}
            stepId={step.id}
            autoPlay={true}
          />
        </div>

        <div style={{
          padding: '12px 16px',
          backgroundColor: 'var(--primary-soft)',
          borderRadius: 'var(--radius-md)',
          borderLeft: isUrdu ? 'none' : '3px solid var(--primary)',
          borderRight: isUrdu ? '3px solid var(--primary)' : 'none'
        }}>
          <p style={{
            fontSize: isUrdu ? '21px' : '17px',
            fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-sans)',
            fontWeight: '700',
            color: 'var(--primary)',
            direction: isUrdu ? 'rtl' : 'ltr'
          }}>
            {t(step.question)}
          </p>
        </div>
      </div>
    </div>
  );
}
