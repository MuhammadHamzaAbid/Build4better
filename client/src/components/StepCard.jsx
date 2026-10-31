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
      {/* Step Counter & Progress Bar */}
      <div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px'
        }}>
          <span style={{
            fontSize: isUrdu ? '22px' : '18px',
            fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-roman)',
            fontWeight: 'bold',
            color: 'var(--primary)'
          }}>
            {isUrdu ? `قدم ${stepIndex + 1} از ${totalSteps}` : `Qadam ${stepIndex + 1} / ${totalSteps}`}
          </span>
          <span style={{ fontSize: '15px', color: 'var(--muted)', fontWeight: 'bold' }}>
            {progressPercent}%
          </span>
        </div>

        <div style={{
          width: '100%',
          height: '10px',
          borderRadius: '5px',
          backgroundColor: '#E2DDD5',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${progressPercent}%`,
            height: '100%',
            backgroundColor: 'var(--primary)',
            transition: 'width 0.3s ease'
          }} />
        </div>
      </div>

      {/* Mock Screen with Hotspot overlay */}
      <div
        onClick={onWrongTap}
        style={{
          position: 'relative',
          width: '100%',
          borderRadius: '20px',
          overflow: 'hidden',
          backgroundColor: '#FFFFFF',
          border: '2px solid var(--border)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
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
        borderRadius: '20px',
        padding: '20px',
        border: '1px solid var(--border)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.04)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '12px',
          marginBottom: '12px'
        }}>
          <p style={{
            fontSize: isUrdu ? '24px' : '20px',
            fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-roman)',
            lineHeight: isUrdu ? '2.0' : '1.5',
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
          borderRadius: '14px',
          borderLeft: isUrdu ? 'none' : '4px solid var(--primary)',
          borderRight: isUrdu ? '4px solid var(--primary)' : 'none'
        }}>
          <p style={{
            fontSize: isUrdu ? '22px' : '19px',
            fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-roman)',
            fontWeight: 'bold',
            color: 'var(--primary)',
            direction: isUrdu ? 'rtl' : 'ltr'
          }}>
            👉 {t(step.question)}
          </p>
        </div>
      </div>
    </div>
  );
}
