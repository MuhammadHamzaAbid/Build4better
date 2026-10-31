import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../lib/i18n';
import LanguageToggle from '../components/LanguageToggle';
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
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <LanguageToggle />

      <div style={{ padding: '20px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{
              fontSize: '13px',
              padding: '3px 10px',
              borderRadius: '10px',
              backgroundColor: 'var(--primary-soft)',
              color: 'var(--primary)',
              fontWeight: 'bold'
            }}>
              👨‍👩‍👧 Family Progress View
            </span>
          </div>

          <button
            type="button"
            onClick={() => navigate('/')}
            style={{ border: 'none', background: 'transparent', color: 'var(--muted)', cursor: 'pointer' }}
          >
            🏠 Home
          </button>
        </div>

        {/* Family Code & Simulation Tag */}
        <div style={{
          backgroundColor: 'var(--surface)',
          padding: '16px',
          borderRadius: '16px',
          border: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '13px', color: 'var(--muted)' }}>Connected Family:</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--primary)' }}>AMMI-2026</div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontSize: '11px',
              padding: '4px 8px',
              borderRadius: '8px',
              backgroundColor: useDemo ? '#FFF1D9' : '#DFF2EC',
              color: useDemo ? '#8A5200' : 'var(--primary)',
              fontWeight: 'bold'
            }}>
              {useDemo ? '⚠️ SIMULATED DATA' : '✓ LIVE SESSION'}
            </span>

            <button
              type="button"
              onClick={() => setUseDemo(prev => !prev)}
              style={{
                fontSize: '12px',
                padding: '4px 8px',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                cursor: 'pointer'
              }}
            >
              Toggle
            </button>
          </div>
        </div>

        {/* Card 1: Confidence Meter (Before vs After) */}
        <div style={{
          backgroundColor: 'var(--surface)',
          borderRadius: '18px',
          padding: '20px',
          border: '1px solid var(--border)',
          boxShadow: '0 4px 10px rgba(0,0,0,0.04)'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '14px', color: 'var(--text)' }}>
            📈 Confidence Growth (Aetmad Mein Izafa)
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '10px 0' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '4px' }}>Pehle</div>
              <div style={{ fontSize: '32px' }}>😟</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#8A5200' }}>
                {activeData.confidence.before} / 5
              </div>
            </div>

            <div style={{ fontSize: '28px', color: 'var(--primary)', fontWeight: 'bold' }}>➔</div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '4px' }}>Baad Mein</div>
              <div style={{ fontSize: '32px' }}>🙂</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--primary)' }}>
                {activeData.confidence.after} / 5
              </div>
            </div>
          </div>

          <p style={{
            fontSize: '14px',
            color: 'var(--primary)',
            backgroundColor: 'var(--primary-soft)',
            padding: '10px',
            borderRadius: '10px',
            marginTop: '10px',
            textAlign: 'center',
            fontWeight: 'bold'
          }}>
            Confidence improved by +{activeData.confidence.after - activeData.confidence.before} points!
          </p>
        </div>

        {/* Card 2: Hesitation Points */}
        <div style={{
          backgroundColor: 'var(--surface)',
          borderRadius: '18px',
          padding: '20px',
          border: '1px solid var(--border)',
          boxShadow: '0 4px 10px rgba(0,0,0,0.04)'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px', color: 'var(--text)' }}>
            ⚠️ Kahan Ruk Gayeen? (Hesitation Points)
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '14px' }}>
            Steps where the parent took 2+ attempts or requested assistance hints:
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
                  backgroundColor: '#FAF7F2',
                  borderRadius: '12px',
                  borderLeft: '4px solid #F4A93D'
                }}
              >
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 'bold' }}>
                    {h.name || `Step ${h.stepId}`}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--muted)' }}>
                    {h.attempts} attempts taken
                  </div>
                </div>

                <span style={{
                  fontSize: '12px',
                  padding: '3px 8px',
                  borderRadius: '8px',
                  backgroundColor: '#FFF1D9',
                  color: '#8A5200',
                  fontWeight: 'bold'
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
          borderRadius: '18px',
          padding: '20px',
          border: '1px solid var(--border)',
          boxShadow: '0 4px 10px rgba(0,0,0,0.04)'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px', color: 'var(--text)' }}>
            📊 Learning Curve (Mistakes Drop Over Attempts)
          </h3>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: '140px', paddingTop: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--primary)' }}>
                {activeData.mistakesByAttempt[1]} steps
              </div>
              <div style={{
                width: '44px',
                height: `${Math.max(25, activeData.mistakesByAttempt[1] * 20)}px`,
                backgroundColor: 'var(--primary)',
                borderRadius: '8px 8px 0 0'
              }} />
              <div style={{ fontSize: '12px', color: 'var(--muted)' }}>1st Try</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#8A5200' }}>
                {activeData.mistakesByAttempt[2]} steps
              </div>
              <div style={{
                width: '44px',
                height: `${Math.max(25, activeData.mistakesByAttempt[2] * 20)}px`,
                backgroundColor: 'var(--gentle)',
                borderRadius: '8px 8px 0 0'
              }} />
              <div style={{ fontSize: '12px', color: 'var(--muted)' }}>2nd Try</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--muted)' }}>
                {activeData.mistakesByAttempt[3]} steps
              </div>
              <div style={{
                width: '44px',
                height: `${Math.max(25, activeData.mistakesByAttempt[3] * 20)}px`,
                backgroundColor: '#A0AEC0',
                borderRadius: '8px 8px 0 0'
              }} />
              <div style={{ fontSize: '12px', color: 'var(--muted)' }}>3rd Try</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
