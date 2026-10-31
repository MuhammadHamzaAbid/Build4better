import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../lib/i18n';
import LanguageToggle from '../components/LanguageToggle';
import ScamCard from '../components/ScamCard';
import { fetchScams } from '../lib/api';

// Fallback scam data if API unreachable
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
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <p>{isUrdu ? 'لوڈ ہو رہا ہے...' : 'Load ho raha hai...'}</p>
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
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <LanguageToggle />

      <div style={{ padding: '20px 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px'
        }}>
          <div>
            <span style={{
              fontSize: '13px',
              padding: '3px 10px',
              borderRadius: '10px',
              backgroundColor: '#FBE4E1',
              color: 'var(--danger)',
              fontWeight: 'bold'
            }}>
              🛡️ {isUrdu ? 'فراڈ سے بچاؤ ڈوجو' : 'Scam Dojo'}
            </span>
          </div>

          {!isFinished && (
            <span style={{ fontSize: '15px', fontWeight: 'bold', color: 'var(--muted)' }}>
              {isUrdu ? `پیغام ${currentIndex + 1} از ${cards.length}` : `Message ${currentIndex + 1} / ${cards.length}`}
            </span>
          )}
        </div>

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
            borderRadius: '24px',
            padding: '28px 20px',
            border: '2px solid var(--primary)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
            animation: 'popIn 0.3s ease-out'
          }}>
            <div style={{ fontSize: '54px' }}>
              {score >= 10 ? '🥇' : score >= 7 ? '🥈' : '🎖️'}
            </div>

            <h2 style={{
              fontSize: isUrdu ? '30px' : '26px',
              fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-roman)',
              color: 'var(--primary)',
              fontWeight: 'bold'
            }}>
              {isUrdu ? 'مشق کا نتیجہ' : 'Mashq Ka Nateeja'}
            </h2>

            <div style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: 'var(--primary)',
              backgroundColor: 'var(--primary-soft)',
              padding: '12px 32px',
              borderRadius: '20px'
            }}>
              {score} / {cards.length}
            </div>

            <p style={{
              fontSize: isUrdu ? '22px' : '18px',
              fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-roman)',
              color: 'var(--text)',
              lineHeight: isUrdu ? '1.8' : '1.4'
            }}>
              {score >= 10
                ? (isUrdu ? 'شاندار! آپ جعلی اور اصلی پیغامات میں فرق بخوبی پہچانتے ہیں۔' : 'Shandar! Aap jaali aur asli messages mein farq samajhte hain.')
                : (isUrdu ? 'بہت اچھا! دوبارہ مشق کریں تاکہ کوئی دھوکہ باز آپ کو الجھا نہ سکے۔' : 'Bohat acha! Dobara koshish karein taake koi dhoka na de sake.')}
            </p>

            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
              <button
                type="button"
                onClick={handleRestart}
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
                🔄 {isUrdu ? 'دوبارہ مشق کریں' : 'Dobara Mashq Karein'}
              </button>

              <button
                type="button"
                onClick={() => navigate('/')}
                style={{
                  width: '100%',
                  minHeight: '56px',
                  borderRadius: '16px',
                  border: '2px solid var(--border)',
                  backgroundColor: 'transparent',
                  color: 'var(--muted)',
                  fontSize: isUrdu ? '20px' : '17px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                🏠 {isUrdu ? 'مرکزی صفحہ پر جائیں' : 'Home'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
