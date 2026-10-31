import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLanguage } from '../lib/i18n';
import LanguageToggle from '../components/LanguageToggle';
import ConfidenceMeter from '../components/ConfidenceMeter';
import { IconCheckCircle, IconRotate, IconShield, IconHome } from '../components/Icons';
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
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--bg)' }}>
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
          width: '76px',
          height: '76px',
          borderRadius: 'var(--radius-full)',
          backgroundColor: 'var(--primary-soft)',
          color: 'var(--primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <IconCheckCircle size={44} />
        </div>

        <h1 style={{
          fontSize: isUrdu ? '32px' : '26px',
          fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-sans)',
          color: 'var(--primary)',
          fontWeight: '800'
        }}>
          {isUrdu ? 'بہت خوب! آپ نے مکمل کر لیا' : 'Bohat Khoob! Mukammal Kar Liya'}
        </h1>

        <p style={{
          fontSize: isUrdu ? '22px' : '17px',
          fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-sans)',
          color: 'var(--text-secondary)',
          lineHeight: isUrdu ? '1.9' : '1.5'
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
              minHeight: '54px',
              borderRadius: 'var(--radius-md)',
              border: '1.5px solid var(--primary)',
              backgroundColor: 'var(--surface)',
              color: 'var(--primary)',
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
            onClick={() => navigate('/scams')}
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
              gap: '8px',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <IconShield size={18} />
            <span>{isUrdu ? 'فراڈ سے بچاؤ کی مشق ➔' : 'Fraud Se Bachne Ki Mashq ➔'}</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/')}
            style={{
              padding: '12px',
              border: 'none',
              backgroundColor: 'transparent',
              color: 'var(--text-secondary)',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <IconHome size={16} />
            <span>{isUrdu ? 'مرکزی صفحہ' : 'Home'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
