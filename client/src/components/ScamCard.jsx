import React, { useState } from 'react';
import { useLanguage } from '../lib/i18n';
import VoiceButton from './VoiceButton';
import { IconShieldAlert, IconCheckCircle, IconLightbulb, IconArrowRight } from './Icons';

export default function ScamCard({ card, onAnswer, onNext, isLast }) {
  const { lang, t } = useLanguage();
  const [answered, setAnswered] = useState(false);
  const [userChoice, setUserChoice] = useState(null);

  const isUrdu = lang === 'urdu';
  const messageText = isUrdu ? card.message.urdu : card.message.roman;

  const handleSelect = (choice) => {
    if (answered) return;
    setUserChoice(choice);
    setAnswered(true);
    const isCorrect = choice === card.answer;
    onAnswer(isCorrect);
  };

  const renderMessageContent = () => {
    if (!answered || !card.red_flags || card.red_flags.length === 0) {
      return messageText;
    }

    let text = messageText;
    const phrases = card.red_flags.map((rf, idx) => ({
      phrase: isUrdu ? rf.phrase.urdu : rf.phrase.roman,
      idx: idx + 1
    }));

    const parts = [];
    let remaining = text;

    for (let i = 0; i < phrases.length; i++) {
      const p = phrases[i];
      const matchIndex = remaining.indexOf(p.phrase);
      if (matchIndex !== -1) {
        parts.push(remaining.substring(0, matchIndex));
        parts.push(
          <span
            key={i}
            style={{
              backgroundColor: 'var(--danger-soft)',
              color: 'var(--danger-text)',
              borderBottom: '2px solid var(--danger)',
              fontWeight: '700',
              padding: '2px 6px',
              borderRadius: '4px',
              display: 'inline-block',
              margin: '0 2px'
            }}
          >
            {p.phrase}{' '}
            <span style={{
              fontSize: '11px',
              backgroundColor: 'var(--danger)',
              color: '#FFFFFF',
              borderRadius: 'var(--radius-full)',
              padding: '1px 6px',
              fontWeight: 'bold',
              fontFamily: 'var(--font-mono)'
            }}>
              {p.idx}
            </span>
          </span>
        );
        remaining = remaining.substring(matchIndex + p.phrase.length);
      }
    }
    parts.push(remaining);
    return parts;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* SMS/Message Container */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)',
        padding: '20px',
        boxShadow: 'var(--shadow-sm)',
        direction: isUrdu ? 'rtl' : 'ltr'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px',
          borderBottom: '1px solid var(--border)',
          paddingBottom: '8px'
        }}>
          <span style={{
            fontSize: '12px',
            color: 'var(--text-secondary)',
            fontWeight: '700',
            letterSpacing: '0.5px',
            textTransform: 'uppercase'
          }}>
            {isUrdu ? 'پیغام برائے جائزہ:' : 'SMS Message for Review:'}
          </span>
          <span style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
            12:45 PM
          </span>
        </div>

        <p style={{
          fontSize: isUrdu ? '23px' : '18px',
          fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-sans)',
          lineHeight: isUrdu ? '2.1' : '1.5',
          color: 'var(--text)'
        }}>
          {renderMessageContent()}
        </p>

        <div style={{
          display: 'flex',
          justifyContent: 'flex-start',
          marginTop: '14px'
        }}>
          <VoiceButton text={messageText} stepId={card.id} />
        </div>
      </div>

      {/* Answer Buttons (Large, Touch Comfort) */}
      {!answered ? (
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            type="button"
            onClick={() => handleSelect('real')}
            style={{
              flex: 1,
              minHeight: '60px',
              borderRadius: 'var(--radius-md)',
              border: '2px solid var(--primary)',
              backgroundColor: 'var(--surface)',
              color: 'var(--primary)',
              fontSize: isUrdu ? '22px' : '18px',
              fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-sans)',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            {isUrdu ? 'اصل (Real)' : 'Asli (Real)'}
          </button>

          <button
            type="button"
            onClick={() => handleSelect('scam')}
            style={{
              flex: 1,
              minHeight: '60px',
              borderRadius: 'var(--radius-md)',
              border: '2px solid var(--text-secondary)',
              backgroundColor: 'var(--surface)',
              color: 'var(--text)',
              fontSize: isUrdu ? '22px' : '18px',
              fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-sans)',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            {isUrdu ? 'فراڈ (Scam)' : 'Fraud (Scam)'}
          </button>
        </div>
      ) : (
        /* Explanations & Red Flags Reveal */
        <div style={{
          backgroundColor: 'var(--surface)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-md)',
          animation: 'fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          {/* Result banner */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '16px',
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: userChoice === card.answer ? 'var(--primary-soft)' : 'var(--gentle-soft)',
            color: userChoice === card.answer ? 'var(--primary)' : 'var(--gentle-text)'
          }}>
            {userChoice === card.answer ? <IconCheckCircle size={22} /> : <IconLightbulb size={22} />}
            <span style={{
              fontSize: isUrdu ? '21px' : '16px',
              fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-sans)',
              fontWeight: '700'
            }}>
              {userChoice === card.answer
                ? (isUrdu ? 'شاباش! آپ کا فیصلہ بالکل درست تھا۔' : 'Shabash! Aap ka andaza theek tha.')
                : (isUrdu ? 'کوئی بات نہیں۔ آئیے دیکھیں اس میں کیا راز ہے۔' : 'Koi baat nahi. Aaiye samjhein isme kya raaz hai.')}
            </span>
          </div>

          {/* Red flags list */}
          {card.red_flags && card.red_flags.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: 'var(--danger-text)',
                marginBottom: '10px',
                direction: isUrdu ? 'rtl' : 'ltr'
              }}>
                <IconShieldAlert size={18} />
                <h4 style={{
                  fontSize: isUrdu ? '20px' : '16px',
                  fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-sans)',
                  fontWeight: '700'
                }}>
                  {isUrdu ? 'فراڈ کی نشانیاں (Red Flags):' : 'Fraud Ki Nishaniyan:'}
                </h4>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {card.red_flags.map((rf, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--danger-soft)',
                      borderLeft: isUrdu ? 'none' : '3px solid var(--danger)',
                      borderRight: isUrdu ? '3px solid var(--danger)' : 'none',
                      direction: isUrdu ? 'rtl' : 'ltr'
                    }}
                  >
                    <span style={{
                      fontWeight: '700',
                      color: 'var(--danger-text)',
                      fontSize: isUrdu ? '19px' : '15px',
                      fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-sans)'
                    }}>
                      {idx + 1}. "{t(rf.phrase)}":{' '}
                    </span>
                    <span style={{
                      fontSize: isUrdu ? '19px' : '15px',
                      fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-sans)',
                      color: 'var(--text)'
                    }}>
                      {t(rf.why)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Remember Box */}
          <div style={{
            padding: '12px 14px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--surface-muted)',
            border: '1px solid var(--border)',
            marginBottom: '16px',
            direction: isUrdu ? 'rtl' : 'ltr'
          }}>
            <p style={{
              fontSize: isUrdu ? '19px' : '15px',
              fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-sans)',
              color: 'var(--text)',
              lineHeight: isUrdu ? '1.8' : '1.4'
            }}>
              <strong>{isUrdu ? 'ہمیشہ یاد رکھیں:' : 'Hamesha yaad rakhein:'}</strong> {t(card.remember)}
            </p>
          </div>

          <button
            type="button"
            onClick={onNext}
            style={{
              width: '100%',
              minHeight: '54px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              fontSize: isUrdu ? '21px' : '17px',
              fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-sans)',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <span>{isLast ? (isUrdu ? 'نتیجہ دیکھیں' : 'Nateeja Dekhein') : (isUrdu ? 'اگلا پیغام' : 'Agla Message')}</span>
            <IconArrowRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
