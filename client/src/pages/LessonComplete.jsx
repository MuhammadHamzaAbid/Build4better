import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLanguage } from '../lib/i18n';
import LanguageToggle from '../components/LanguageToggle';
import ConfidenceMeter from '../components/ConfidenceMeter';
import { postConfidence } from '../lib/api';

export default function LessonComplete() {
  const { id = 'bijli-bill-01' } = useParams();
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const isUrdu = lang === 'urdu';

  const handleConfidence = (val) => {
    postConfidence({ familyCode: 'AMMI-2026', lessonId: id, phase: 'after', value: val });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <LanguageToggle />

      <div style={{
        padding: '32px 20px',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: '20px'
      }}>
        <div style={{
          width: '90px',
          height: '90px',
          borderRadius: '50%',
          backgroundColor: 'var(--primary-soft)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '48px',
          animation: 'popIn 0.3s ease'
        }}>
          🏆
        </div>

        <h1 style={{
          fontSize: isUrdu ? '34px' : '28px',
          fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-roman)',
          color: 'var(--primary)',
          fontWeight: 'bold'
        }}>
          {isUrdu ? 'بہت خوب! آپ نے مکمل کر لیا' : 'Bohat Khoob! Mukammal Kar Liya'}
        </h1>

        <p style={{
          fontSize: isUrdu ? '22px' : '18px',
          fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-roman)',
          color: 'var(--muted)',
          lineHeight: isUrdu ? '1.8' : '1.5'
        }}>
          {isUrdu
            ? 'آپ نے بجلی کا بل ادا کرنے اور او ٹی پی فراڈ سے بچنے کی کامیاب مشق کی۔'
            : 'Aap ne bijli ka bill bharne aur OTP fraud se bachne ki kamyab mashq ki.'}
        </p>

        {/* Post-lesson Confidence Meter */}
        <div style={{ width: '100%' }}>
          <ConfidenceMeter phase="after" initialValue={4} onSelect={handleConfidence} />
        </div>

        {/* Action Buttons */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            type="button"
            onClick={() => navigate(`/lesson/${id}`)}
            style={{
              width: '100%',
              minHeight: '56px',
              borderRadius: '16px',
              border: '2px solid var(--primary)',
              backgroundColor: 'var(--surface)',
              color: 'var(--primary)',
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
            onClick={() => navigate('/scams')}
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
            🛡️ {isUrdu ? 'فراڈ سے بچنے کی مشق کریں ➔' : 'Fraud Se Bachne Ki Mashq ➔'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/')}
            style={{
              padding: '12px',
              border: 'none',
              backgroundColor: 'transparent',
              color: 'var(--muted)',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            🏠 {isUrdu ? 'مرکزی صفحہ' : 'Home'}
          </button>
        </div>
      </div>
    </div>
  );
}
