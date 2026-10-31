import React, { useState } from 'react';
import { useLanguage } from '../lib/i18n';

export default function ConfidenceMeter({ phase = 'after', initialValue = 3, onSelect }) {
  const { lang } = useLanguage();
  const [selected, setSelected] = useState(initialValue);
  const isUrdu = lang === 'urdu';

  const levels = [
    { value: 1, roman: 'Bohat Darr', urdu: 'بہت خوف' },
    { value: 2, roman: 'Thora Darr', urdu: 'تھوڑا خوف' },
    { value: 3, roman: 'Kamyab Koshish', urdu: 'کچھ سمجھ ہے' },
    { value: 4, roman: 'Pura Itminan', urdu: 'اطمینان ہے' },
    { value: 5, roman: 'Pura Yaqeen', urdu: 'پورا اعتماد' },
  ];

  const handleChoose = (val) => {
    setSelected(val);
    if (onSelect) onSelect(val);
  };

  return (
    <div style={{
      backgroundColor: 'var(--surface)',
      borderRadius: 'var(--radius-lg)',
      padding: '24px 18px',
      border: '1px solid var(--border)',
      textAlign: 'center',
      margin: '18px 0',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <h3 style={{
        fontSize: isUrdu ? '24px' : '20px',
        fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-sans)',
        color: 'var(--text)',
        marginBottom: '16px',
        fontWeight: '700'
      }}>
        {phase === 'before'
          ? (isUrdu ? 'مشق سے پہلے: آپ کا اعتماد کیسا ہے؟' : 'Pehle: Is kaam par kitna yaqeen hai?')
          : (isUrdu ? 'مشق کے بعد: اب آپ کو کتنا اعتماد ہے؟' : 'Mashq ke baad: Ab kitna aetmad hai?')}
      </h3>

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
        {levels.map((lvl) => {
          const isChosen = selected === lvl.value;
          return (
            <button
              key={lvl.value}
              type="button"
              onClick={() => handleChoose(lvl.value)}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '12px 4px',
                borderRadius: 'var(--radius-md)',
                border: isChosen ? '2px solid var(--primary)' : '1px solid var(--border)',
                backgroundColor: isChosen ? 'var(--primary-soft)' : 'var(--surface)',
                cursor: 'pointer'
              }}
            >
              <span style={{
                fontSize: '22px',
                fontWeight: '800',
                color: isChosen ? 'var(--primary)' : 'var(--text-secondary)',
                marginBottom: '4px'
              }}>
                {lvl.value}
              </span>
              <span style={{
                fontSize: isUrdu ? '13px' : '11px',
                fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-sans)',
                fontWeight: '600',
                color: isChosen ? 'var(--primary)' : 'var(--text-tertiary)',
                whiteSpace: 'nowrap'
              }}>
                {isUrdu ? lvl.urdu : lvl.roman}
              </span>
            </button>
          );
        })}
      </div>

      <div style={{
        marginTop: '16px',
        padding: '8px 12px',
        borderRadius: 'var(--radius-sm)',
        backgroundColor: 'var(--surface-muted)',
        display: 'inline-block'
      }}>
        <span style={{
          fontSize: isUrdu ? '18px' : '15px',
          fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-sans)',
          color: 'var(--primary)',
          fontWeight: '700'
        }}>
          {isUrdu ? levels[selected - 1].urdu : levels[selected - 1].roman} (درجہ {selected}/5)
        </span>
      </div>
    </div>
  );
}
