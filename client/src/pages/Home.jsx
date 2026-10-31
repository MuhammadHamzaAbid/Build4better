import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../lib/i18n';
import LanguageToggle from '../components/LanguageToggle';
import { IconBook, IconShield, IconSearch, IconPencil, IconUsers, IconArrowRight, IconShieldAlert } from '../components/Icons';

export default function Home() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const isUrdu = lang === 'urdu';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--bg)' }}>
      <LanguageToggle />

      <main style={{ padding: '24px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: '22px' }}>
        {/* App Title & Editorial Tagline */}
        <section style={{ textAlign: isUrdu ? 'right' : 'left', direction: isUrdu ? 'rtl' : 'ltr' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 12px',
            backgroundColor: 'var(--primary-soft)',
            color: 'var(--primary)',
            borderRadius: 'var(--radius-full)',
            fontSize: '13px',
            fontWeight: '700',
            letterSpacing: '0.4px',
            marginBottom: '12px'
          }}>
            <span>{isUrdu ? 'خاندانی ڈیجیٹل اتالیق' : 'FAMILY DIGITAL TUTOR'}</span>
          </div>

          <h1 style={{
            fontSize: isUrdu ? '38px' : '32px',
            fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-sans)',
            fontWeight: '800',
            color: 'var(--text)',
            lineHeight: isUrdu ? '1.8' : '1.2',
            letterSpacing: isUrdu ? 'normal' : '-0.5px',
            marginBottom: '8px'
          }}>
            {isUrdu ? 'ابو کا ٹیوٹر' : 'Abbu Ka Tutor'}
          </h1>

          <p style={{
            fontSize: isUrdu ? '23px' : '18px',
            fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-sans)',
            color: 'var(--text-secondary)',
            lineHeight: isUrdu ? '2.0' : '1.45'
          }}>
            {isUrdu
              ? 'پہلے سیکھو، پھر کرو، بنا ڈر کے۔'
              : 'Pehle seekho, phir karo, bina dar ke.'}
          </p>
        </section>

        {/* Safety Guarantee Strip */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          padding: '14px 16px',
          backgroundColor: 'var(--gentle-soft)',
          border: '1px solid var(--gentle-border)',
          borderRadius: 'var(--radius-md)',
          direction: isUrdu ? 'rtl' : 'ltr'
        }}>
          <div style={{ color: 'var(--gentle-text)', marginTop: '2px', flexShrink: 0 }}>
            <IconShieldAlert size={20} />
          </div>
          <div style={{
            fontSize: isUrdu ? '20px' : '15px',
            fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-sans)',
            color: 'var(--gentle-text)',
            lineHeight: isUrdu ? '1.9' : '1.4'
          }}>
            <strong>{isUrdu ? 'محفوظ مشق:' : 'Mehfooz Mashq:'}</strong>{' '}
            {isUrdu
              ? 'یہاں غلط دبانے سے کوئی نقصان نہیں ہوتا۔ پرسکون ہو کر خود کوشش کریں۔'
              : 'Yahan koi galti nuqsan deh nahi hoti. Be-khauf ho kar khud koshish karein.'}
          </div>
        </div>

        {/* Primary Tiles (Bento / High-Touch) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Tile 1: Seekhein (Lessons) */}
          <button
            type="button"
            onClick={() => navigate('/lesson/bijli-bill-01')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '20px 18px',
              borderRadius: 'var(--radius-lg)',
              border: '1.5px solid var(--primary)',
              backgroundColor: 'var(--surface)',
              cursor: 'pointer',
              textAlign: isUrdu ? 'right' : 'left',
              direction: isUrdu ? 'rtl' : 'ltr',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary-soft)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <IconBook size={26} />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: isUrdu ? '24px' : '19px',
                fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-sans)',
                fontWeight: '700',
                color: 'var(--primary)',
                marginBottom: '2px'
              }}>
                {isUrdu ? 'سیکھیں (Lessons)' : 'Seekhein (Lessons)'}
              </div>
              <div style={{
                fontSize: isUrdu ? '19px' : '15px',
                fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-sans)',
                color: 'var(--text-secondary)'
              }}>
                {isUrdu
                  ? 'بجلی کا بل بھرنا قدم بہ قدم سیکھیں'
                  : 'Bijli ka bill bharna qadam-ba-qadam seekhein'}
              </div>
            </div>

            <div style={{ color: 'var(--primary)' }}>
              <IconArrowRight size={20} />
            </div>
          </button>

          {/* Tile 2: Fraud Se Bachein (Scam Dojo) */}
          <button
            type="button"
            onClick={() => navigate('/scams')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '20px 18px',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--surface)',
              cursor: 'pointer',
              textAlign: isUrdu ? 'right' : 'left',
              direction: isUrdu ? 'rtl' : 'ltr',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--danger-soft)',
              color: 'var(--danger-text)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <IconShield size={26} />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: isUrdu ? '24px' : '19px',
                fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-sans)',
                fontWeight: '700',
                color: 'var(--text)',
                marginBottom: '2px'
              }}>
                {isUrdu ? 'فراڈ سے بچیں (Scam Dojo)' : 'Fraud Se Bachein (Scam Dojo)'}
              </div>
              <div style={{
                fontSize: isUrdu ? '19px' : '15px',
                fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-sans)',
                color: 'var(--text-secondary)'
              }}>
                {isUrdu
                  ? 'جعلی پیغامات اور فریب دہی کی پہچان'
                  : 'Jaali messages aur calls pehchanna seekhein'}
              </div>
            </div>

            <div style={{ color: 'var(--text-secondary)' }}>
              <IconArrowRight size={20} />
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
              padding: '20px 18px',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--surface)',
              cursor: 'pointer',
              textAlign: isUrdu ? 'right' : 'left',
              direction: isUrdu ? 'rtl' : 'ltr',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--gentle-soft)',
              color: 'var(--gentle-text)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <IconSearch size={26} />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: isUrdu ? '24px' : '19px',
                fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-sans)',
                fontWeight: '700',
                color: 'var(--text)',
                marginBottom: '2px'
              }}>
                {isUrdu ? 'یہ کیا ہے؟ (Screenshot Coach)' : 'Yeh Kya Hai? (Screenshot Coach)'}
              </div>
              <div style={{
                fontSize: isUrdu ? '19px' : '15px',
                fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-sans)',
                color: 'var(--text-secondary)'
              }}>
                {isUrdu
                  ? 'مشکل اسکرین کی رہنمائی حاصل کریں'
                  : 'Mushkil screen upload kar ke samjhein'}
              </div>
            </div>

            <div style={{ color: 'var(--text-secondary)' }}>
              <IconArrowRight size={20} />
            </div>
          </button>
        </div>

        {/* Footer Navigation: Builder & Family View */}
        <div style={{
          marginTop: 'auto',
          paddingTop: '16px',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          gap: '10px'
        }}>
          <button
            type="button"
            onClick={() => navigate('/builder')}
            style={{
              flex: 1,
              minHeight: '46px',
              padding: '8px 14px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--surface)',
              color: 'var(--text-secondary)',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <IconPencil size={16} />
            <span>Builder (Child)</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/family')}
            style={{
              flex: 1,
              minHeight: '46px',
              padding: '8px 14px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--surface)',
              color: 'var(--text-secondary)',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <IconUsers size={16} />
            <span>Family Progress</span>
          </button>
        </div>
      </main>
    </div>
  );
}
