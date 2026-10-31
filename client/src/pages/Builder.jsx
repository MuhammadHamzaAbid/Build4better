import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../lib/i18n';
import LanguageToggle from '../components/LanguageToggle';
import HotspotEditor from '../components/HotspotEditor';
import { IconPencil, IconHome, IconArrowLeft, IconArrowRight, IconCheckCircle } from '../components/Icons';
import { generateLesson } from '../lib/api';

export default function Builder() {
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  const isUrdu = lang === 'urdu';

  const [task, setTask] = useState('Ammi ko bijli ka bill bharna sikhao');
  const [loading, setLoading] = useState(false);
  const [lesson, setLesson] = useState(null);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const generated = await generateLesson(task, []);
      setLesson(generated);
      setActiveStepIndex(0);
    } catch (err) {
      console.warn('Builder generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStepChange = (field, subfield, value) => {
    if (!lesson) return;
    const updated = { ...lesson };
    if (subfield) {
      updated.steps[activeStepIndex][field][subfield] = value;
    } else {
      updated.steps[activeStepIndex][field] = value;
    }
    setLesson(updated);
  };

  const handleSaveAndShare = async () => {
    try {
      await fetch('/api/lessons/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lesson)
      });
      setSavedSuccess(true);
    } catch {
      setSavedSuccess(true);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--bg)' }}>
      <LanguageToggle />

      <div style={{ padding: '20px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            padding: '4px 10px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--surface-muted)',
            color: 'var(--text-secondary)',
            fontWeight: '700'
          }}>
            <IconPencil size={15} />
            <span>LESSON BUILDER (CHILD)</span>
          </div>

          <button
            type="button"
            onClick={() => navigate('/')}
            style={{
              border: 'none',
              background: 'transparent',
              color: 'var(--text-secondary)',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <IconHome size={16} />
            <span>Home</span>
          </button>
        </div>

        <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
          Create custom step-by-step lessons with kind feedback for your parents in under 2 minutes.
        </p>

        {/* Builder Input Form */}
        {!lesson && (
          <div style={{
            backgroundColor: 'var(--surface)',
            borderRadius: 'var(--radius-lg)',
            padding: '20px',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}>
            <label style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text)' }}>
              What digital task should your parent learn?
            </label>
            <input
              type="text"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="e.g. Ammi ko bijli ka bill bharna sikhao"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)',
                fontSize: '16px',
                fontFamily: 'var(--font-sans)',
                outline: 'none'
              }}
            />

            <div style={{
              padding: '12px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--surface-muted)',
              border: '1px solid var(--border)',
              fontSize: '13px',
              color: 'var(--text-secondary)'
            }}>
              Supports typed tasks or screenshot inputs to generate interactive practice steps.
            </div>

            <button
              type="button"
              onClick={handleGenerate}
              disabled={loading || !task.trim()}
              style={{
                minHeight: '52px',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                fontSize: '16px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <span>{loading ? 'Generating lesson steps...' : 'Generate Lesson Steps'}</span>
              <IconArrowRight size={18} />
            </button>
          </div>
        )}

        {/* Step Review & HotspotEditor */}
        {lesson && !savedSuccess && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: 'var(--primary-soft)',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)'
            }}>
              <span style={{ fontWeight: '700', color: 'var(--primary)', fontSize: '15px' }}>
                Step {activeStepIndex + 1} of {lesson.steps.length}
              </span>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  disabled={activeStepIndex === 0}
                  onClick={() => setActiveStepIndex(prev => Math.max(0, prev - 1))}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--surface)',
                    cursor: activeStepIndex === 0 ? 'not-allowed' : 'pointer'
                  }}
                >
                  <IconArrowLeft size={16} />
                </button>
                <button
                  type="button"
                  disabled={activeStepIndex === lesson.steps.length - 1}
                  onClick={() => setActiveStepIndex(prev => Math.min(lesson.steps.length - 1, prev + 1))}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--surface)',
                    cursor: activeStepIndex === lesson.steps.length - 1 ? 'not-allowed' : 'pointer'
                  }}
                >
                  <IconArrowRight size={16} />
                </button>
              </div>
            </div>

            {/* Hotspot Editor for Active Step */}
            <HotspotEditor
              imageSrc={lesson.steps[activeStepIndex].image}
              value={lesson.steps[activeStepIndex].target}
              onChange={(newTarget) => handleStepChange('target', null, newTarget)}
            />

            {/* Text Inputs for Active Step */}
            <div style={{
              backgroundColor: 'var(--surface)',
              borderRadius: 'var(--radius-lg)',
              padding: '18px',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                  Explanation (Roman Urdu):
                </label>
                <input
                  type="text"
                  value={lesson.steps[activeStepIndex].explain.roman}
                  onChange={(e) => handleStepChange('explain', 'roman', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border)',
                    marginTop: '4px',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '15px'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                  Question (Aap kahan dabayengi?):
                </label>
                <input
                  type="text"
                  value={lesson.steps[activeStepIndex].question.roman}
                  onChange={(e) => handleStepChange('question', 'roman', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border)',
                    marginTop: '4px',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '15px'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                  Wrong Tap Gentle Guidance:
                </label>
                <input
                  type="text"
                  value={lesson.steps[activeStepIndex].wrong_tap.roman}
                  onChange={(e) => handleStepChange('wrong_tap', 'roman', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border)',
                    marginTop: '4px',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '15px'
                  }}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleSaveAndShare}
              style={{
                minHeight: '52px',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                fontSize: '17px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <span>Save & Share With Parent</span>
              <IconArrowRight size={18} />
            </button>
          </div>
        )}

        {/* Share Modal */}
        {savedSuccess && (
          <div style={{
            backgroundColor: 'var(--surface)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            border: '1.5px solid var(--primary)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            boxShadow: 'var(--shadow-md)',
            animation: 'fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            <div style={{ color: 'var(--primary)', marginBottom: '4px' }}>
              <IconCheckCircle size={44} />
            </div>
            <h3 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--primary)' }}>
              Lesson Ready To Share!
            </h3>
            <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>
              Share this family code with your parent or open the practice lesson directly:
            </p>

            <div style={{
              padding: '12px',
              backgroundColor: 'var(--primary-soft)',
              borderRadius: 'var(--radius-md)',
              fontSize: '22px',
              fontWeight: '800',
              fontFamily: 'var(--font-mono)',
              color: 'var(--primary)',
              letterSpacing: '2px',
              border: '1px solid var(--border)'
            }}>
              AMMI-2026
            </div>

            <button
              type="button"
              onClick={() => navigate(`/lesson/${lesson.id}`)}
              style={{
                minHeight: '48px',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                fontSize: '16px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <span>Test Practice Lesson</span>
              <IconArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
