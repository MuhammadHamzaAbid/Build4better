import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../lib/i18n';
import LanguageToggle from '../components/LanguageToggle';
import StepCard from '../components/StepCard';
import TapHotspot from '../components/TapHotspot';
import KindMessage from '../components/KindMessage';
import SuccessBurst from '../components/SuccessBurst';
import ConfidenceMeter from '../components/ConfidenceMeter';
import { fetchLessonById, postProgress, postConfidence } from '../lib/api';

// Fallback hero lesson if API offline
import fallbackHeroLesson from '../../public/lessons/bijli-bill-01.json';

export default function Lesson() {
  const { id = 'bijli-bill-01' } = useParams();
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  const isUrdu = lang === 'urdu';

  const [lesson, setLesson] = useState(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [attempts, setAttempts] = useState(1);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showKindMessage, setShowKindMessage] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [hasRatedBefore, setHasRatedBefore] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await fetchLessonById(id);
      if (data && data.steps) {
        setLesson(data);
      } else {
        // Fallback to bundled hero lesson
        setLesson(fallbackHeroLesson);
      }
    }
    load();
  }, [id]);

  if (!lesson) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <p>{isUrdu ? 'سبق لوڈ ہو رہا ہے...' : 'Lesson load ho raha hai...'}</p>
      </div>
    );
  }

  // Pre-lesson confidence check
  if (!hasRatedBefore) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <LanguageToggle />
        <div style={{ padding: '24px 20px', flex: 1 }}>
          <h2 style={{
            fontSize: isUrdu ? '28px' : '24px',
            fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-roman)',
            color: 'var(--primary)',
            marginBottom: '10px',
            direction: isUrdu ? 'rtl' : 'ltr'
          }}>
            📖 {t(lesson.title)}
          </h2>

          <ConfidenceMeter
            phase="before"
            initialValue={2}
            onSelect={(val) => {
              postConfidence({ familyCode: 'AMMI-2026', lessonId: lesson.id, phase: 'before', value: val });
            }}
          />

          <button
            type="button"
            onClick={() => setHasRatedBefore(true)}
            style={{
              width: '100%',
              minHeight: '60px',
              borderRadius: '18px',
              border: 'none',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              fontSize: isUrdu ? '24px' : '20px',
              fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-roman)',
              fontWeight: 'bold',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            {isUrdu ? 'سبق شروع کریں ➔' : 'Sabaq Shuru Karein ➔'}
          </button>
        </div>
      </div>
    );
  }

  const currentStep = lesson.steps[currentStepIndex];

  // Hint level: attempt 1 = 1 (none), attempt 2 = 2 (text hint), attempt >= 3 = 3 (pulse highlight)
  const currentHintLevel = attempts;

  const handleCorrectTap = () => {
    setShowSuccess(true);
    setShowKindMessage(false);

    // Save step progress silently
    postProgress({
      familyCode: 'AMMI-2026',
      lessonId: lesson.id,
      stepId: currentStep.id,
      attempts,
      hintsUsed,
      correct: true
    });

    setTimeout(() => {
      setShowSuccess(false);
      if (currentStepIndex + 1 < lesson.steps.length) {
        setCurrentStepIndex(prev => prev + 1);
        setAttempts(1);
        setHintsUsed(0);
      } else {
        navigate(`/lesson/${lesson.id}/done`);
      }
    }, 900);
  };

  const handleWrongTap = () => {
    setAttempts(prev => prev + 1);
    setHintsUsed(prev => Math.min(2, prev + 1));
    setShowKindMessage(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
      <LanguageToggle />

      {/* Optional plain-words text hint for attempt 2 */}
      {attempts === 2 && currentStep.hint_levels && currentStep.hint_levels[1] && (
        <div style={{
          backgroundColor: 'var(--primary-soft)',
          borderBottom: '2px solid var(--primary)',
          padding: '10px 16px',
          textAlign: 'center',
          fontSize: '16px',
          fontWeight: 'bold',
          color: 'var(--primary)',
          animation: 'slideUp 0.2s ease'
        }}>
          💡 <strong>{isUrdu ? 'اشارہ:' : 'Ishara:'}</strong> {currentStep.hint_levels[1]}
        </div>
      )}

      {/* Step View */}
      <StepCard
        step={currentStep}
        stepIndex={currentStepIndex}
        totalSteps={lesson.steps.length}
        onWrongTap={handleWrongTap}
      >
        <TapHotspot
          target={currentStep.target}
          onCorrectTap={handleCorrectTap}
          hintLevel={currentHintLevel}
        />
      </StepCard>

      {/* Gentle Kind Message after wrong tap */}
      {showKindMessage && (
        <KindMessage
          explanation={currentStep.wrong_tap}
          onUndo={() => setShowKindMessage(false)}
          onRetry={() => setShowKindMessage(false)}
        />
      )}

      {/* Gentle Success Burst */}
      {showSuccess && <SuccessBurst />}
    </div>
  );
}
