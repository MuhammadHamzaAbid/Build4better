import React, { useState } from 'react';
import { useLanguage } from '../lib/i18n';

export default function ConfidenceMeter({ phase = 'after', initialValue = 3, onSelect }) {
  const { lang } = useLanguage();
  const [selected, setSelected] = useState(initialValue);
  const isUrdu = lang === 'urdu';

  const faces = [
    { value: 1, emoji: '😟', roman: 'Bohat Darr Hai', urdu: 'بہت ڈر لگتا ہے' },
    { value: 2, emoji: '🙁', roman: 'Thora Darr Hai', urdu: 'تھوڑا ڈر ہے' },
    { value: 3, emoji: '😐', roman: 'Thora Thora Aata Hai', urdu: 'کچھ کچھ آتا ہے' },
    { value: 4, emoji: '🙂', roman: 'Yaqeen Hai', urdu: 'یقین ہے' },
    { value: 5, emoji: '😃', roman: 'Pura Yaqeen Hai!', urdu: 'پورا اعتماد ہے!' },
  ];

  const handleChoose = (val) => {
    setSelected(val);
    if (onSelect) onSelect(val);
  };

  return (
    <div style={{
      backgroundColor: 'var(--surface)',
      borderRadius: '20px',
      padding: '24px 16px',
      border: '1px solid var(--border)',
      textAlign: 'center',
      margin: '20px 0'
    }}>
      <h3 style={{
        fontSize: isUrdu ? '26px' : '22px',
        fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-roman)',
        color: 'var(--text)',
        marginBottom: '16px'
      }}>
        {phase === 'before'
          ? (isUrdu ? 'سبق شروع کرنے سے پہلے: کتنا یقین ہے؟' : 'Pehle: Is kaam par kitna yaqeen hai?')
          : (isUrdu ? 'مشق کے بعد: اب کتنا اعتماد ہے؟' : 'Mashq ke baad: Ab kitna aetmad hai?')}
      </h3>

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
        {faces.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => handleChoose(f.value)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '12px 4px',
              borderRadius: '16px',
              border: selected === f.value ? '3px solid var(--primary)' : '2px solid var(--border)',
              backgroundColor: selected === f.value ? 'var(--primary-soft)' : '#FAFAFA',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <span style={{ fontSize: '32px', marginBottom: '6px' }}>{f.emoji}</span>
            <span style={{
              fontSize: '14px',
              fontWeight: 'bold',
              color: selected === f.value ? 'var(--primary)' : 'var(--muted)'
            }}>
              {f.value}
            </span>
          </button>
        ))}
      </div>

      <p style={{
        marginTop: '14px',
        fontSize: isUrdu ? '20px' : '16px',
        fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-roman)',
        color: 'var(--primary)',
        fontWeight: 'bold'
      }}>
        {isUrdu ? faces[selected - 1].urdu : faces[selected - 1].roman}
      </p>
    </div>
  );
}
