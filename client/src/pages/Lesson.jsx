import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../lib/i18n';
import LanguageToggle from '../components/LanguageToggle';
import StepCard from '../components/StepCard';
import TapHotspot from '../components/TapHotspot';
import KindMessage from '../components/KindMessage';
import SuccessBurst from '../components/SuccessBurst';
import ConfidenceMeter from '../components/ConfidenceMeter';
import { IconBook, IconLightbulb, IconArrowRight } from '../components/Icons';
import { fetchLessonById, postProgress, postConfidence } from '../lib/api';

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
        setLesson(fallbackHeroLesson);
      }
    }
    load();
  }, [id]);

  if (!lesson) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>
          {isUrdu ? 'سبق لوڈ ہو رہا ہے...' : 'Lesson load ho raha hai...'}
        </p>
      </div>
    );
  }

  // Pre-lesson confidence rating
  if (!hasRatedBefore) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--bg)' }}>
        <LanguageToggle />
        <div style={{ padding: '24px 20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--primary)',
            marginBottom: '6px',
            direction: isUrdu ? 'rtl' : 'ltr'
          }}>
            <IconBook size={24} />
            <h2 style={{
              fontSize: isUrdu ? '26px' : '22px',
              fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-sans)',
              fontWeight: '800'
            }}>
              {t(lesson.title)}
            </h2>
          </div>

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
              minHeight: '56px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              fontSize: isUrdu ? '22px' : '18px',
              fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-sans)',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <span>{isUrdu ? 'سبق شروع کریں' : 'Sabaq Shuru Karein'}</span>
            <IconArrowRight size={20} />
          </button>
        </div>
      </div>
    );
  }

  const currentStep = lesson.steps[currentStepIndex];
  const currentHintLevel = attempts;

  const handleCorrectTap = () => {
    setShowSuccess(true);
    setShowKindMessage(false);

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
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative', backgroundColor: 'var(--bg)' }}>
      <LanguageToggle />

      {/* Attempt 2 text hint */}
      {attempts === 2 && currentStep.hint_levels && currentStep.hint_levels[1] && (
        <div style={{
          backgroundColor: 'var(--gentle-soft)',
          borderBottom: '1px solid var(--gentle-border)',
          padding: '10px 16px',
          textAlign: 'center',
          fontSize: '15px',
          fontWeight: '700',
          color: 'var(--gentle-text)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}>
          <IconLightbulb size={18} />
          <span><strong>{isUrdu ? 'اشارہ:' : 'Ishara:'}</strong> {currentStep.hint_levels[1]}</span>
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

      {/* Slide-up Kind Message after wrong tap */}
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
