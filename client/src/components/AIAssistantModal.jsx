import React, { useState, useEffect } from 'react';
import { useLanguage } from '../lib/i18n';
import VoiceButton from './VoiceButton';
import {
  IconSparkles,
  IconX,
  IconSend,
  IconHelpCircle,
  IconShield,
  IconLightbulb
} from './Icons';

export default function AIAssistantModal({
  isOpen,
  onClose,
  lessonId = 'bijli-bill-01',
  stepId = 's1',
  stepIndex = 0,
  totalSteps = 7
}) {
  const { lang, t } = useLanguage();
  const isUrdu = lang === 'urdu';

  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userQuestion, setUserQuestion] = useState('');
  const [conversation, setConversation] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchStepGuide();
    }
  }, [isOpen, stepId, lang]);

  const fetchStepGuide = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId, stepId, lang: isUrdu ? 'urdu' : 'roman' })
      });
      if (res.ok) {
        const data = await res.json();
        setGuide(data.guide);
        setConversation([]);
      }
    } catch (err) {
      console.warn('Failed to fetch assistant guide:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAskQuestion = async (customQ) => {
    const q = customQ || userQuestion;
    if (!q || !q.trim() || submitting) return;

    setSubmitting(true);
    const newEntry = { q, a: null, loading: true };
    setConversation(prev => [...prev, newEntry]);
    setUserQuestion('');

    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId,
          stepId,
          userQuestion: q,
          lang: isUrdu ? 'urdu' : 'roman'
        })
      });

      if (res.ok) {
        const data = await res.json();
        setConversation(prev =>
          prev.map(item =>
            item.q === q ? { q, a: data.answer, audioText: data.audioText, loading: false } : item
          )
        );
      } else {
        setConversation(prev =>
          prev.map(item =>
            item.q === q
              ? {
                  q,
                  a: isUrdu
                    ? 'کوئی بات نہیں، ایپ میں موجود بٹن کو احتیاط سے پڑھیں اور آگے بڑھیں۔'
                    : 'Koi baat nahi, screen par maujood button ko achi tarah parhein aur aage barhein.',
                  loading: false
                }
              : item
          )
        );
      }
    } catch {
      setConversation(prev =>
        prev.map(item =>
          item.q === q
            ? {
                q,
                a: isUrdu
                  ? 'تسلی رکھیں: اس مرحلے پر کوئی غلطی ہو بھی جائے تو واپس جا کر درست کیا جا سکتا ہے۔'
                  : 'Tasalli rakhein: Ghalati ho bhi jaye to back ja kar theek kiya ja sakta hai.',
                loading: false
              }
            : item
        )
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="assistant-title"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.55)',
        backdropFilter: 'blur(3px)',
        zIndex: 500,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        padding: '0'
      }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '430px',
          maxHeight: '90vh',
          backgroundColor: 'var(--surface)',
          borderTopLeftRadius: 'var(--radius-xl)',
          borderTopRightRadius: 'var(--radius-xl)',
          border: '1px solid var(--border)',
          borderBottom: 'none',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'slideUpCard 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Assistant Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'var(--primary-soft)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <IconSparkles size={20} />
            </div>
            <div>
              <h3
                id="assistant-title"
                style={{
                  fontSize: isUrdu ? '22px' : '17px',
                  fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-sans)',
                  fontWeight: '700',
                  color: 'var(--primary)',
                  lineHeight: '1.2'
                }}
              >
                {isUrdu ? 'مددگار AI (رہنما)' : 'Madadgar AI (Step Coach)'}
              </h3>
              <p style={{
                fontSize: isUrdu ? '15px' : '12px',
                fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-sans)',
                color: 'var(--text-secondary)'
              }}>
                {isUrdu ? `قدم ${stepIndex + 1} از ${totalSteps} کی رہنمائی` : `Qadam ${stepIndex + 1} of ${totalSteps} guidance`}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={isUrdu ? 'بند کریں' : 'Band karein'}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--surface)',
              color: 'var(--text)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <IconX size={18} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div style={{
          padding: '20px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          maxHeight: 'calc(90vh - 150px)'
        }}>
          {loading || !guide ? (
            <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-secondary)' }}>
              <p style={{ fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-sans)', fontSize: isUrdu ? '19px' : '15px' }}>
                {isUrdu ? 'رہنمائی تیار ہو رہی ہے...' : 'Rehnumai tayyar ho rahi hai...'}
              </p>
            </div>
          ) : (
            <>
              {/* Step Summary Card */}
              <div style={{
                backgroundColor: 'var(--surface-muted)',
                borderRadius: 'var(--radius-lg)',
                padding: '16px',
                border: '1px solid var(--border)'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '8px',
                  marginBottom: '10px'
                }}>
                  <h4 style={{
                    fontSize: isUrdu ? '20px' : '16px',
                    fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-sans)',
                    fontWeight: '700',
                    color: 'var(--text)'
                  }}>
                    {guide.stepTitle}
                  </h4>
                  <VoiceButton text={guide.audioText} autoPlay={false} />
                </div>

                <p style={{
                  fontSize: isUrdu ? '19px' : '15px',
                  fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-sans)',
                  lineHeight: isUrdu ? '1.9' : '1.5',
                  color: 'var(--text)',
                  marginBottom: '10px',
                  direction: isUrdu ? 'rtl' : 'ltr'
                }}>
                  {guide.intro}
                </p>

                <div style={{
                  padding: '10px 12px',
                  backgroundColor: 'var(--primary-soft)',
                  borderRadius: 'var(--radius-sm)',
                  borderLeft: isUrdu ? 'none' : '3px solid var(--primary)',
                  borderRight: isUrdu ? '3px solid var(--primary)' : 'none',
                  marginBottom: '10px'
                }}>
                  <p style={{
                    fontSize: isUrdu ? '18px' : '14px',
                    fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-sans)',
                    fontWeight: '600',
                    color: 'var(--primary)',
                    direction: isUrdu ? 'rtl' : 'ltr'
                  }}>
                    {guide.action}
                  </p>
                </div>

                {/* Safety Reassurance */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'var(--gentle-text)',
                  fontSize: isUrdu ? '17px' : '13px',
                  fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-sans)',
                  direction: isUrdu ? 'rtl' : 'ltr'
                }}>
                  <IconShield size={16} />
                  <span>{guide.reassurance}</span>
                </div>
              </div>

              {/* Common Questions Pill List */}
              {guide.faqs && guide.faqs.length > 0 && (
                <div>
                  <h5 style={{
                    fontSize: isUrdu ? '18px' : '14px',
                    fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-sans)',
                    fontWeight: '700',
                    color: 'var(--text-secondary)',
                    marginBottom: '8px',
                    direction: isUrdu ? 'rtl' : 'ltr'
                  }}>
                    {isUrdu ? 'عام سوالات جو لوگ پوچھتے ہیں:' : 'Aam sawalat jo log poochtay hain:'}
                  </h5>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {guide.faqs.map(faq => (
                      <button
                        key={faq.id}
                        type="button"
                        onClick={() => handleAskQuestion(faq.q)}
                        style={{
                          textAlign: isUrdu ? 'right' : 'left',
                          padding: '10px 14px',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border)',
                          backgroundColor: 'var(--surface)',
                          color: 'var(--text)',
                          fontSize: isUrdu ? '18px' : '14px',
                          fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-sans)',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <IconHelpCircle size={16} style={{ flexShrink: 0, color: 'var(--primary)' }} />
                        <span style={{ flex: 1 }}>{faq.q}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Conversation Log (Asked Questions & AI Answers) */}
              {conversation.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {conversation.map((entry, idx) => (
                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {/* User Bubble */}
                      <div style={{
                        alignSelf: isUrdu ? 'flex-start' : 'flex-end',
                        backgroundColor: 'var(--primary)',
                        color: '#FFFFFF',
                        padding: '8px 14px',
                        borderRadius: 'var(--radius-md)',
                        fontSize: isUrdu ? '18px' : '14px',
                        fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-sans)',
                        maxWidth: '85%'
                      }}>
                        {entry.q}
                      </div>

                      {/* AI Bubble */}
                      <div style={{
                        alignSelf: isUrdu ? 'flex-end' : 'flex-start',
                        backgroundColor: 'var(--surface-muted)',
                        border: '1px solid var(--border)',
                        padding: '12px 14px',
                        borderRadius: 'var(--radius-md)',
                        maxWidth: '90%',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                      }}>
                        {entry.loading ? (
                          <span style={{
                            color: 'var(--text-secondary)',
                            fontSize: '13px',
                            fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-sans)'
                          }}>
                            {isUrdu ? 'جواب تیار ہو رہا ہے...' : 'Jawab tayyar ho raha hai...'}
                          </span>
                        ) : (
                          <>
                            <p style={{
                              fontSize: isUrdu ? '19px' : '15px',
                              fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-sans)',
                              lineHeight: isUrdu ? '1.8' : '1.45',
                              color: 'var(--text)',
                              direction: isUrdu ? 'rtl' : 'ltr'
                            }}>
                              {entry.a}
                            </p>
                            {entry.audioText && (
                              <div style={{ alignSelf: 'flex-start' }}>
                                <VoiceButton text={entry.audioText} autoPlay={false} />
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Question Input Footer */}
        <div style={{
          padding: '12px 16px',
          borderTop: '1px solid var(--border)',
          backgroundColor: 'var(--surface)',
          display: 'flex',
          gap: '8px',
          alignItems: 'center'
        }}>
          <input
            type="text"
            value={userQuestion}
            onChange={e => setUserQuestion(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAskQuestion();
              }
            }}
            placeholder={isUrdu ? 'کوئی سوال پوچھیں...' : 'Apna sawal yahan likhein...'}
            disabled={submitting}
            style={{
              flex: 1,
              minHeight: '48px',
              padding: '0 14px',
              borderRadius: 'var(--radius-md)',
              border: '1.5px solid var(--border)',
              backgroundColor: 'var(--surface-muted)',
              color: 'var(--text)',
              fontSize: isUrdu ? '18px' : '15px',
              fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-sans)',
              outline: 'none'
            }}
          />

          <button
            type="button"
            onClick={() => handleAskQuestion()}
            disabled={submitting || !userQuestion.trim()}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              backgroundColor: userQuestion.trim() ? 'var(--primary)' : 'var(--border)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: userQuestion.trim() ? 'pointer' : 'not-allowed',
              flexShrink: 0
            }}
          >
            <IconSend size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
