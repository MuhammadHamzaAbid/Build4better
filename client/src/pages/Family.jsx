import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../lib/i18n';
import LanguageToggle from '../components/LanguageToggle';
import { IconUsers, IconHome, IconAlertTriangle, IconCheckCircle, IconArrowRight } from '../components/Icons';
import { fetchFamilyProgress } from '../lib/api';

export default function Family() {
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  const isUrdu = lang === 'urdu';

  const [data, setData] = useState(null);
  const [useDemo, setUseDemo] = useState(true);

  const demoData = {
    familyCode: 'AMMI-2026',
    confidence: { before: 2, after: 4 },
    hesitations: [
      { stepId: 's2', attempts: 3, hintsUsed: 2, name: 'Reference Number Entry' },
      { stepId: 's4', attempts: 2, hintsUsed: 1, name: 'Wallet Selection' },
      { stepId: 's6', attempts: 2, hintsUsed: 1, name: 'OTP Scam Trap' }
    ],
    mistakesByAttempt: { 1: 4, 2: 2, 3: 1 },
    totalCompletedSteps: 7
  };

  useEffect(() => {
    async function load() {
      const real = await fetchFamilyProgress('AMMI-2026');
      if (real && real.hesitations && real.hesitations.length > 0) {
        setData(real);
        setUseDemo(false);
      } else {
        setData(demoData);
        setUseDemo(true);
      }
    }
    load();
  }, []);

  const activeData = useDemo ? demoData : (data || demoData);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--bg)' }}>
      <LanguageToggle />

      <div style={{ padding: '20px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            padding: '4px 10px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--primary-soft)',
            color: 'var(--primary)',
            fontWeight: '700'
          }}>
            <IconUsers size={16} />
            <span>FAMILY PROGRESS DASHBOARD</span>
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

        {/* Family Code & Simulation Tag */}
        <div style={{
          backgroundColor: 'var(--surface)',
          padding: '16px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase' }}>
              Family Code:
            </div>
            <div style={{ fontSize: '20px', fontWeight: '800', fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>
              AMMI-2026
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontSize: '11px',
              padding: '4px 8px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: useDemo ? 'var(--gentle-soft)' : 'var(--primary-soft)',
              color: useDemo ? 'var(--gentle-text)' : 'var(--primary)',
              fontWeight: '700',
              border: '1px solid',
              borderColor: useDemo ? 'var(--gentle-border)' : 'var(--border)'
            }}>
              {useDemo ? 'SIMULATED DATA' : 'LIVE SESSION'}
            </span>

            <button
              type="button"
              onClick={() => setUseDemo(prev => !prev)}
              style={{
                fontSize: '12px',
                padding: '4px 10px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--surface)',
                color: 'var(--text-secondary)',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Toggle
            </button>
          </div>
        </div>

        {/* Card 1: Confidence Growth */}
        <div style={{
          backgroundColor: 'var(--surface)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h3 style={{ fontSize: '17px', fontWeight: '800', marginBottom: '14px', color: 'var(--text)' }}>
            Confidence Growth (Aetmad Mein Izafa)
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '10px 0' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: '600' }}>
                Pre-Lesson
              </div>
              <div style={{
                fontSize: '28px',
                fontWeight: '800',
                fontFamily: 'var(--font-mono)',
                color: 'var(--gentle-text)',
                backgroundColor: 'var(--gentle-soft)',
                padding: '8px 18px',
                borderRadius: 'var(--radius-md)'
              }}>
                {activeData.confidence.before}/5
              </div>
            </div>

            <div style={{ color: 'var(--primary)' }}>
              <IconArrowRight size={24} />
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: '600' }}>
                Post-Practice
              </div>
              <div style={{
                fontSize: '28px',
                fontWeight: '800',
                fontFamily: 'var(--font-mono)',
                color: 'var(--primary)',
                backgroundColor: 'var(--primary-soft)',
                padding: '8px 18px',
                borderRadius: 'var(--radius-md)'
              }}>
                {activeData.confidence.after}/5
              </div>
            </div>
          </div>

          <div style={{
            fontSize: '14px',
            color: 'var(--primary)',
            backgroundColor: 'var(--primary-soft)',
            padding: '10px',
            borderRadius: 'var(--radius-sm)',
            marginTop: '12px',
            textAlign: 'center',
            fontWeight: '700'
          }}>
            Confidence rating improved by +{activeData.confidence.after - activeData.confidence.before} points with safe practice!
          </div>
        </div>

        {/* Card 2: Hesitation Points */}
        <div style={{
          backgroundColor: 'var(--surface)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <IconAlertTriangle size={18} color="var(--gentle)" />
            <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text)' }}>
              Kahan Ruk Gayeen? (Hesitation Points)
            </h3>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
            Steps where the parent took 2+ attempts or requested hints:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {activeData.hesitations.map((h, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 14px',
                  backgroundColor: 'var(--surface-muted)',
                  borderRadius: 'var(--radius-sm)',
                  borderLeft: '3px solid var(--gentle)'
                }}
              >
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text)' }}>
                    {h.name || `Step ${h.stepId}`}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {h.attempts} attempts recorded
                  </div>
                </div>

                <span style={{
                  fontSize: '11px',
                  padding: '4px 8px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--gentle-soft)',
                  color: 'var(--gentle-text)',
                  fontWeight: '700'
                }}>
                  {h.hintsUsed} Hints Used
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Card 3: Mistakes-by-Attempt Chart */}
        <div style={{
          backgroundColor: 'var(--surface)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h3 style={{ fontSize: '17px', fontWeight: '800', marginBottom: '6px', color: 'var(--text)' }}>
            Learning Curve (Attempts Distribution)
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
            Mistakes drop significantly across repeated attempts:
          </p>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: '140px', paddingTop: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
                {activeData.mistakesByAttempt[1]}
              </div>
              <div style={{
                width: '48px',
                height: `${Math.max(25, activeData.mistakesByAttempt[1] * 22)}px`,
                backgroundColor: 'var(--primary)',
                borderRadius: '6px 6px 0 0'
              }} />
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>1st Try</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--gentle-text)', fontFamily: 'var(--font-mono)' }}>
                {activeData.mistakesByAttempt[2]}
              </div>
              <div style={{
                width: '48px',
                height: `${Math.max(25, activeData.mistakesByAttempt[2] * 22)}px`,
                backgroundColor: 'var(--gentle)',
                borderRadius: '6px 6px 0 0'
              }} />
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>2nd Try</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                {activeData.mistakesByAttempt[3]}
              </div>
              <div style={{
                width: '48px',
                height: `${Math.max(25, activeData.mistakesByAttempt[3] * 22)}px`,
                backgroundColor: 'var(--border-strong)',
                borderRadius: '6px 6px 0 0'
              }} />
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>3rd Try</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
