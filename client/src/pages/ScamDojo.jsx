import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../lib/i18n';
import LanguageToggle from '../components/LanguageToggle';
import ScamCard from '../components/ScamCard';
import { IconShield, IconRotate, IconHome, IconCheckCircle, IconShieldAlert } from '../components/Icons';
import { fetchScams } from '../lib/api';

import fallbackScams from '../../../server/data/scams.json';

export default function ScamDojo() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const isUrdu = lang === 'urdu';

  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await fetchScams();
      if (data && data.length > 0) {
        setCards(data);
      } else {
        setCards(fallbackScams);
      }
    }
    load();
  }, []);

  if (cards.length === 0) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>
          {isUrdu ? 'لوڈ ہو رہا ہے...' : 'Load ho raha hai...'}
        </p>
      </div>
    );
  }

  const handleAnswer = (isCorrect) => {
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < cards.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setScore(0);
    setIsFinished(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--bg)' }}>
      <LanguageToggle />

      <div style={{ padding: '20px 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            padding: '4px 10px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--danger-soft)',
            color: 'var(--danger-text)',
            fontWeight: '700'
          }}>
            <IconShield size={16} />
            <span>{isUrdu ? 'فراڈ سے بچاؤ ڈوجو' : 'SCAM DOJO'}</span>
          </div>

          {!isFinished && (
            <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
              {isUrdu ? `پیغام ${currentIndex + 1} از ${cards.length}` : `${currentIndex + 1} / ${cards.length}`}
            </span>
          )}
        </div>

        {/* Live Call Emergency SOS Link */}
        <button
          type="button"
          onClick={() => navigate('/sos')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            border: '1.5px solid var(--danger)',
            backgroundColor: 'var(--danger-soft)',
            color: 'var(--danger-text)',
            fontSize: isUrdu ? '17px' : '14px',
            fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-sans)',
            fontWeight: '700',
            cursor: 'pointer',
            marginBottom: '14px',
            direction: isUrdu ? 'rtl' : 'ltr'
          }}
        >
          <IconShieldAlert size={18} />
          <span>{isUrdu ? 'ابھی کسی کال یا میسج پر شک ہے؟ ہنگامی چیک کریں' : 'Abhi call/SMS par shak hai? Emergency SOS Check'}</span>
        </button>

        {/* Dojo Content */}
        {!isFinished ? (
          <ScamCard
            key={cards[currentIndex].id}
            card={cards[currentIndex]}
            onAnswer={handleAnswer}
            onNext={handleNext}
            isLast={currentIndex + 1 === cards.length}
          />
        ) : (
          /* Finished Score Card */
          <div style={{
            backgroundColor: 'var(--surface)',
            borderRadius: 'var(--radius-lg)',
            padding: '32px 20px',
            border: '1px solid var(--border)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
            boxShadow: 'var(--shadow-md)',
            animation: 'fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            <div style={{ color: 'var(--primary)', marginBottom: '4px' }}>
              <IconCheckCircle size={52} />
            </div>

            <h2 style={{
              fontSize: isUrdu ? '28px' : '24px',
              fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-sans)',
              color: 'var(--primary)',
              fontWeight: '800'
            }}>
              {isUrdu ? 'مشق کا نتیجہ' : 'Mashq Ka Nateeja'}
            </h2>

            <div style={{
              fontSize: '44px',
              fontWeight: '800',
              fontFamily: 'var(--font-mono)',
              color: 'var(--primary)',
              backgroundColor: 'var(--primary-soft)',
              padding: '12px 36px',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border)'
            }}>
              {score} / {cards.length}
            </div>

            <p style={{
              fontSize: isUrdu ? '21px' : '17px',
              fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-sans)',
              color: 'var(--text)',
              lineHeight: isUrdu ? '1.9' : '1.45'
            }}>
              {score >= 10
                ? (isUrdu ? 'شاندار! آپ جعلی اور اصلی پیغامات میں فرق بخوبی پہچانتے ہیں۔' : 'Shandar! Aap jaali aur asli messages mein farq samajhte hain.')
                : (isUrdu ? 'بہت اچھا! دوبارہ مشق کریں تاکہ کوئی دھوکہ باز آپ کو الجھا نہ سکے۔' : 'Bohat acha! Dobara koshish karein taake koi dhoka na de sake.')}
            </p>

            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
              <button
                type="button"
                onClick={handleRestart}
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
                <IconRotate size={18} />
                <span>{isUrdu ? 'دوبارہ مشق کریں' : 'Dobara Mashq Karein'}</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/')}
                style={{
                  width: '100%',
                  minHeight: '50px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--surface)',
                  color: 'var(--text-secondary)',
                  fontSize: isUrdu ? '19px' : '16px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <IconHome size={16} />
                <span>{isUrdu ? 'مرکزی صفحہ پر جائیں' : 'Home'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
