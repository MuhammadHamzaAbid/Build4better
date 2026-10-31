import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../lib/i18n';
import LanguageToggle from '../components/LanguageToggle';
import HotspotEditor from '../components/HotspotEditor';
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
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <LanguageToggle />

      <div style={{ padding: '20px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: 'var(--primary)' }}>
            ✏️ Lesson Builder (Child)
          </h2>
          <button
            type="button"
            onClick={() => navigate('/')}
            style={{ border: 'none', background: 'transparent', color: 'var(--muted)', cursor: 'pointer' }}
          >
            🏠 Home
          </button>
        </div>

        <p style={{ fontSize: '15px', color: 'var(--muted)' }}>
          Create custom step-by-step lessons with kind feedback for your parents in under 2 minutes.
        </p>

        {/* Builder Input Form */}
        {!lesson && (
          <div style={{
            backgroundColor: 'var(--surface)',
            borderRadius: '18px',
            padding: '20px',
            border: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}>
            <label style={{ fontSize: '15px', fontWeight: 'bold' }}>
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
                borderRadius: '12px',
                border: '1px solid var(--border)',
                fontSize: '16px'
              }}
            />

            <div style={{
              padding: '12px',
              borderRadius: '12px',
              backgroundColor: '#FAF7F2',
              border: '1px dashed var(--muted)',
              fontSize: '13px',
              color: 'var(--muted)'
            }}>
              📸 <em>Optional: upload screenshots or let the tutor generate the standard interactive practice flow.</em>
            </div>

            <button
              type="button"
              onClick={handleGenerate}
              disabled={loading || !task.trim()}
              style={{
                minHeight: '54px',
                borderRadius: '14px',
                border: 'none',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              {loading ? 'AI generating lesson steps...' : 'Generate Lesson Steps ➔'}
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
              borderRadius: '12px'
            }}>
              <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>
                Step {activeStepIndex + 1} of {lesson.steps.length}
              </span>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  disabled={activeStepIndex === 0}
                  onClick={() => setActiveStepIndex(prev => Math.max(0, prev - 1))}
                  style={{ padding: '4px 10px', borderRadius: '8px', cursor: 'pointer' }}
                >
                  ◀
                </button>
                <button
                  type="button"
                  disabled={activeStepIndex === lesson.steps.length - 1}
                  onClick={() => setActiveStepIndex(prev => Math.min(lesson.steps.length - 1, prev + 1))}
                  style={{ padding: '4px 10px', borderRadius: '8px', cursor: 'pointer' }}
                >
                  ▶
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
              borderRadius: '16px',
              padding: '16px',
              border: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--muted)' }}>
                  Explanation (Roman Urdu):
                </label>
                <input
                  type="text"
                  value={lesson.steps[activeStepIndex].explain.roman}
                  onChange={(e) => handleStepChange('explain', 'roman', e.target.value)}
                  style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--border)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--muted)' }}>
                  Question (Aap kahan dabayengi?):
                </label>
                <input
                  type="text"
                  value={lesson.steps[activeStepIndex].question.roman}
                  onChange={(e) => handleStepChange('question', 'roman', e.target.value)}
                  style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--border)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--muted)' }}>
                  Wrong tap gentle explanation:
                </label>
                <input
                  type="text"
                  value={lesson.steps[activeStepIndex].wrong_tap.roman}
                  onChange={(e) => handleStepChange('wrong_tap', 'roman', e.target.value)}
                  style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--border)' }}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleSaveAndShare}
              style={{
                minHeight: '54px',
                borderRadius: '16px',
                border: 'none',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Save & Share With Parent 🚀
            </button>
          </div>
        )}

        {/* Share Modal */}
        {savedSuccess && (
          <div style={{
            backgroundColor: 'var(--surface)',
            borderRadius: '20px',
            padding: '24px',
            border: '2px solid var(--primary)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            animation: 'popIn 0.3s ease'
          }}>
            <div style={{ fontSize: '48px' }}>🎉</div>
            <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: 'var(--primary)' }}>
              Lesson Ready To Share!
            </h3>
            <p style={{ fontSize: '15px', color: 'var(--muted)' }}>
              Give this family code to your parent or open the link directly on their phone:
            </p>

            <div style={{
              padding: '14px',
              backgroundColor: 'var(--primary-soft)',
              borderRadius: '12px',
              fontSize: '24px',
              fontWeight: 'bold',
              color: 'var(--primary)',
              letterSpacing: '2px'
            }}>
              AMMI-2026
            </div>

            <button
              type="button"
              onClick={() => navigate(`/lesson/${lesson.id}`)}
              style={{
                minHeight: '50px',
                borderRadius: '14px',
                border: 'none',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                fontSize: '17px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Test Practice Lesson Now ➔
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
