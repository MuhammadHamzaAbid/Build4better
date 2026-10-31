import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../lib/i18n';
import LanguageToggle from '../components/LanguageToggle';

export default function Home() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const isUrdu = lang === 'urdu';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <LanguageToggle />

      <div style={{ padding: '24px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* App Title & Tagline */}
        <div style={{ textAlign: isUrdu ? 'right' : 'left', direction: isUrdu ? 'rtl' : 'ltr' }}>
          <div style={{
            display: 'inline-block',
            padding: '4px 12px',
            backgroundColor: 'var(--primary-soft)',
            color: 'var(--primary)',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: 'bold',
            marginBottom: '8px'
          }}>
            🌟 {isUrdu ? 'آسان خاندانی اتالیق' : 'Asan Khandani Tutor'}
          </div>

          <h1 style={{
            fontSize: isUrdu ? '36px' : '30px',
            fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-roman)',
            fontWeight: 'bold',
            color: 'var(--text)',
            marginBottom: '6px'
          }}>
            {isUrdu ? 'ابو کا ٹیوٹر' : 'Abbu Ka Tutor'}
          </h1>

          <p style={{
            fontSize: isUrdu ? '22px' : '18px',
            fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-roman)',
            color: 'var(--muted)',
            lineHeight: isUrdu ? '1.8' : '1.4'
          }}>
            {isUrdu
              ? 'پہلے سیکھو، پھر کرو، بنا ڈر کے۔'
              : 'Pehle seekho, phir karo, bina dar ke.'}
          </p>
        </div>

        {/* Practice Ribbon Notice */}
        <div style={{
          padding: '12px 16px',
          backgroundColor: '#FFF1D9',
          border: '1px solid #F4A93D',
          borderRadius: '16px',
          fontSize: isUrdu ? '18px' : '15px',
          fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-roman)',
          color: '#8A5200',
          direction: isUrdu ? 'rtl' : 'ltr'
        }}>
          🛡️ <strong>{isUrdu ? 'محفوظ ماحول:' : 'Mehfooz Mahol:'}</strong>{' '}
          {isUrdu
            ? 'یہاں کوئی بھی غلطی نقصان دہ نہیں ہے۔ بے خوف ہو کر مشق کریں۔'
            : 'Yahan koi galti nuqsan deh nahi. Be-khauf ho kar mashq karein.'}
        </div>

        {/* 3 Main Action Tiles */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Tile 1: Seekhein (Lessons) */}
          <button
            type="button"
            onClick={() => navigate('/lesson/bijli-bill-01')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '22px 18px',
              borderRadius: '20px',
              border: '2px solid var(--primary)',
              backgroundColor: 'var(--surface)',
              cursor: 'pointer',
              textAlign: isUrdu ? 'right' : 'left',
              direction: isUrdu ? 'rtl' : 'ltr',
              boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
              transition: 'transform 0.15s ease'
            }}
          >
            <div style={{
              width: '58px',
              height: '58px',
              borderRadius: '16px',
              backgroundColor: 'var(--primary-soft)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '30px',
              flexShrink: 0
            }}>
              💡
            </div>

            <div style={{ flex: 1 }}>
              <h2 style={{
                fontSize: isUrdu ? '26px' : '22px',
                fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-roman)',
                fontWeight: 'bold',
                color: 'var(--primary)',
                marginBottom: '4px'
              }}>
                {isUrdu ? 'سیکھیں (Lessons)' : 'Seekhein (Lessons)'}
              </h2>
              <p style={{
                fontSize: isUrdu ? '20px' : '16px',
                fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-roman)',
                color: 'var(--muted)'
              }}>
                {isUrdu
                  ? 'بجلی کا بل بھرنا قدم بہ قدم سیکھیں'
                  : 'Bijli ka bill bharna qadam-ba-qadam seekhein'}
              </p>
            </div>
          </button>

          {/* Tile 2: Fraud se Bachein (Scam Dojo) */}
          <button
            type="button"
            onClick={() => navigate('/scams')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '22px 18px',
              borderRadius: '20px',
              border: '2px solid #5B6770',
              backgroundColor: 'var(--surface)',
              cursor: 'pointer',
              textAlign: isUrdu ? 'right' : 'left',
              direction: isUrdu ? 'rtl' : 'ltr',
              boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
              transition: 'transform 0.15s ease'
            }}
          >
            <div style={{
              width: '58px',
              height: '58px',
              borderRadius: '16px',
              backgroundColor: '#FBE4E1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '30px',
              flexShrink: 0
            }}>
              🛡️
            </div>

            <div style={{ flex: 1 }}>
              <h2 style={{
                fontSize: isUrdu ? '26px' : '22px',
                fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-roman)',
                fontWeight: 'bold',
                color: '#1F2933',
                marginBottom: '4px'
              }}>
                {isUrdu ? 'فراڈ سے بچیں (Scam Dojo)' : 'Fraud Se Bachein (Scam Dojo)'}
              </h2>
              <p style={{
                fontSize: isUrdu ? '20px' : '16px',
                fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-roman)',
                color: 'var(--muted)'
              }}>
                {isUrdu
                  ? 'جعلی پیغامات اور کالز کی پہچان کی مشق'
                  : 'Jaali messages aur calls pehchanna seekhein'}
              </p>
            </div>
          </button>

          {/* Tile 3: Yeh Kya Hai? (Screenshot Coach) */}
          <button
            type="button"
            onClick={() => navigate('/explain')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '22px 18px',
              borderRadius: '20px',
              border: '2px solid #8A5200',
              backgroundColor: 'var(--surface)',
              cursor: 'pointer',
              textAlign: isUrdu ? 'right' : 'left',
              direction: isUrdu ? 'rtl' : 'ltr',
              boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
              transition: 'transform 0.15s ease'
            }}
          >
            <div style={{
              width: '58px',
              height: '58px',
              borderRadius: '16px',
              backgroundColor: 'var(--gentle-soft)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '30px',
              flexShrink: 0
            }}>
              🔍
            </div>

            <div style={{ flex: 1 }}>
              <h2 style={{
                fontSize: isUrdu ? '26px' : '22px',
                fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-roman)',
                fontWeight: 'bold',
                color: '#8A5200',
                marginBottom: '4px'
              }}>
                {isUrdu ? 'یہ کیا ہے؟ (Screenshot Coach)' : 'Yeh Kya Hai? (Screenshot Coach)'}
              </h2>
              <p style={{
                fontSize: isUrdu ? '20px' : '16px',
                fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-roman)',
                color: 'var(--muted)'
              }}>
                {isUrdu
                  ? 'مشکل اسکرین بھیجیں اور رہنمائی پائیں'
                  : 'Mushkil screen upload kar ke samjhein'}
              </p>
            </div>
          </button>
        </div>

        {/* Footer Links: Family View & Lesson Builder */}
        <div style={{
          marginTop: 'auto',
          paddingTop: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          gap: '10px'
        }}>
          <button
            type="button"
            onClick={() => navigate('/builder')}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '14px',
              border: '1px solid var(--border)',
              backgroundColor: '#FFFFFF',
              color: 'var(--muted)',
              fontSize: '15px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            ✏️ Builder (Child)
          </button>

          <button
            type="button"
            onClick={() => navigate('/family')}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '14px',
              border: '1px solid var(--border)',
              backgroundColor: '#FFFFFF',
              color: 'var(--muted)',
              fontSize: '15px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            👨‍👩‍👧 Family Progress
          </button>
        </div>
      </div>
    </div>
  );
}
