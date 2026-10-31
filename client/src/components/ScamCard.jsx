import React, { useState } from 'react';
import { useLanguage } from '../lib/i18n';
import VoiceButton from './VoiceButton';

export default function ScamCard({ card, onAnswer, onNext, isLast }) {
  const { lang, t } = useLanguage();
  const [answered, setAnswered] = useState(false);
  const [userChoice, setUserChoice] = useState(null);

  const isUrdu = lang === 'urdu';
  const messageText = isUrdu ? card.message.urdu : card.message.roman;
  const isScam = card.answer === 'scam';

  const handleSelect = (choice) => {
    if (answered) return;
    setUserChoice(choice);
    setAnswered(true);
    const isCorrect = choice === card.answer;
    onAnswer(isCorrect);
  };

  // Render message text with highlighted red flags if answered
  const renderMessageContent = () => {
    if (!answered || !card.red_flags || card.red_flags.length === 0) {
      return messageText;
    }

    // Replace each red flag phrase with highlighted span
    let text = messageText;
    const phrases = card.red_flags.map((rf, idx) => ({
      phrase: isUrdu ? rf.phrase.urdu : rf.phrase.roman,
      idx: idx + 1
    }));

    // Find and highlight
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
              color: 'var(--danger)',
              borderBottom: '2px solid var(--danger)',
              fontWeight: 'bold',
              padding: '2px 6px',
              borderRadius: '6px',
              display: 'inline-block',
              margin: '0 2px'
            }}
          >
            {p.phrase} <small style={{ fontSize: '11px', background: 'var(--danger)', color: '#fff', borderRadius: '50%', padding: '1px 5px' }}>{p.idx}</small>
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
      {/* WhatsApp Message Bubble */}
      <div style={{
        backgroundColor: '#DCF8C6',
        borderRadius: '18px',
        borderTopRightRadius: '4px',
        padding: '18px 20px',
        maxWidth: '92%',
        alignSelf: isUrdu ? 'flex-start' : 'flex-end',
        boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
        position: 'relative',
        direction: isUrdu ? 'rtl' : 'ltr'
      }}>
        <div style={{
          fontSize: '12px',
          color: '#075E54',
          fontWeight: 'bold',
          marginBottom: '6px'
        }}>
          💬 {isUrdu ? 'موصول شدہ پیغام:' : 'Mausool Shuda Message:'}
        </div>

        <p style={{
          fontSize: isUrdu ? '24px' : '20px',
          fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-roman)',
          lineHeight: isUrdu ? '2.0' : '1.5',
          color: '#1F2933'
        }}>
          {renderMessageContent()}
        </p>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '10px'
        }}>
          <VoiceButton text={messageText} stepId={card.id} />
          <span style={{ fontSize: '12px', color: '#5B6770' }}>12:45 PM ✓✓</span>
        </div>
      </div>

      {/* Answer Buttons (Large, Equal) */}
      {!answered ? (
        <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
          <button
            type="button"
            onClick={() => handleSelect('real')}
            style={{
              flex: 1,
              minHeight: '62px',
              borderRadius: '18px',
              border: '2px solid var(--primary)',
              backgroundColor: 'var(--surface)',
              color: 'var(--primary)',
              fontSize: isUrdu ? '24px' : '20px',
              fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-roman)',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
            }}
          >
            {isUrdu ? 'اصل (Real)' : 'Asli (Real)'}
          </button>

          <button
            type="button"
            onClick={() => handleSelect('scam')}
            style={{
              flex: 1,
              minHeight: '62px',
              borderRadius: '18px',
              border: '2px solid #5B6770',
              backgroundColor: 'var(--surface)',
              color: '#1F2933',
              fontSize: isUrdu ? '24px' : '20px',
              fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-roman)',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
            }}
          >
            {isUrdu ? 'فراڈ (Scam)' : 'Fraud (Scam)'}
          </button>
        </div>
      ) : (
        /* Explanations & Red Flags Reveal */
        <div style={{
          backgroundColor: 'var(--surface)',
          borderRadius: '20px',
          padding: '20px',
          border: '1px solid var(--border)',
          animation: 'slideUp 0.3s ease-out'
        }}>
          {/* Result banner */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '14px',
            padding: '12px 16px',
            borderRadius: '14px',
            backgroundColor: userChoice === card.answer ? 'var(--primary-soft)' : 'var(--gentle-soft)',
            color: userChoice === card.answer ? 'var(--primary)' : '#8A5200'
          }}>
            <span style={{ fontSize: '24px' }}>
              {userChoice === card.answer ? '🎉' : '💡'}
            </span>
            <span style={{
              fontSize: isUrdu ? '22px' : '18px',
              fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-roman)',
              fontWeight: 'bold'
            }}>
              {userChoice === card.answer
                ? (isUrdu ? 'شاباش! آپ کا اندازہ بالکل درست تھا۔' : 'Shabash! Aap ka andaza theek tha.')
                : (isUrdu ? 'کوئی بات نہیں۔ آئیے دیکھیں اس میں کیا راز ہے۔' : 'Koi baat nahi. Aaiye dekhein isme kya raaz hai.')}
            </span>
          </div>

          {/* Red flags list */}
          {card.red_flags && card.red_flags.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <h4 style={{
                fontSize: isUrdu ? '22px' : '17px',
                fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-roman)',
                color: 'var(--danger)',
                marginBottom: '10px',
                direction: isUrdu ? 'rtl' : 'ltr'
              }}>
                🚨 {isUrdu ? 'فراڈ کی نشانیاں (Red Flags):' : 'Fraud Ki Nishaniyan:'}
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {card.red_flags.map((rf, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '12px',
                      backgroundColor: 'var(--danger-soft)',
                      borderLeft: isUrdu ? 'none' : '3px solid var(--danger)',
                      borderRight: isUrdu ? '3px solid var(--danger)' : 'none',
                      direction: isUrdu ? 'rtl' : 'ltr'
                    }}
                  >
                    <span style={{
                      fontWeight: 'bold',
                      color: 'var(--danger)',
                      fontSize: isUrdu ? '20px' : '16px',
                      fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-roman)'
                    }}>
                      {idx + 1}. "{t(rf.phrase)}":
                    </span>
                    <span style={{
                      fontSize: isUrdu ? '20px' : '16px',
                      fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-roman)',
                      color: 'var(--text)',
                      marginRight: isUrdu ? '6px' : '0',
                      marginLeft: isUrdu ? '0' : '6px'
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
            padding: '14px 16px',
            borderRadius: '14px',
            backgroundColor: '#FAF7F2',
            border: '1px dashed var(--muted)',
            marginBottom: '18px',
            direction: isUrdu ? 'rtl' : 'ltr'
          }}>
            <p style={{
              fontSize: isUrdu ? '20px' : '16px',
              fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-roman)',
              color: 'var(--text)',
              lineHeight: isUrdu ? '1.8' : '1.4'
            }}>
              📌 <strong>{isUrdu ? 'ہمیشہ یاد رکھیں:' : 'Hamesha yaad rakhein:'}</strong> {t(card.remember)}
            </p>
          </div>

          <button
            type="button"
            onClick={onNext}
            style={{
              width: '100%',
              minHeight: '56px',
              borderRadius: '16px',
              border: 'none',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              fontSize: isUrdu ? '22px' : '18px',
              fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-roman)',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            {isLast
              ? (isUrdu ? 'نتیجہ دیکھیں ➔' : 'Nateeja Dekhein ➔')
              : (isUrdu ? 'اگلا پیغام ➔' : 'Agla Message ➔')}
          </button>
        </div>
      )}
    </div>
  );
}
