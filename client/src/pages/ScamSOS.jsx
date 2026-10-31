import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../lib/i18n';
import LanguageToggle from '../components/LanguageToggle';
import VoiceButton from '../components/VoiceButton';
import {
  IconShieldAlert,
  IconShield,
  IconPhoneCall,
  IconCheck,
  IconArrowRight,
  IconHome,
  IconSparkles,
  IconAlertTriangle
} from '../components/Icons';

export default function ScamSOS() {
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  const isUrdu = lang === 'urdu';

  const [selectedChecks, setSelectedChecks] = useState([]);
  const [callerNumber, setCallerNumber] = useState('');
  const [queryText, setQueryText] = useState('');
  const [verdict, setVerdict] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checkedActions, setCheckedActions] = useState({});

  const checkOptions = [
    {
      id: 'otp',
      labelUrdu: 'مجھ سے فون یا میسج پر او ٹی پی (OTP)، پن کوڈ یا پاس ورڈ مانگ رہے ہیں',
      labelRoman: 'Phone ya SMS par OTP, PIN code ya password maang rahe hain'
    },
    {
      id: 'block_threat',
      labelUrdu: 'کہہ رہے ہیں کہ اگر فوراً کوڈ نہ دیا تو اکاؤنٹ یا سم (SIM) بند ہو جائے گی',
      labelRoman: 'Keh rahe hain ke foran code na diya to account ya SIM block ho jayegi'
    },
    {
      id: 'lottery',
      labelUrdu: 'بینظیر انکم سپورٹ، جیتو پاکستان یا کسی قرعہ اندازی کے انعام کا کہہ رہے ہیں',
      labelRoman: 'Benazir Income Support, Jeeto Pakistan ya kisi inam ka keh rahe hain'
    },
    {
      id: 'remote_app',
      labelUrdu: 'فون میں کوئی ایپ جیسے AnyDesk یا TeamViewer ڈاؤن لوڈ کرنے کو کہہ رہے ہیں',
      labelRoman: 'Phone mein AnyDesk ya QuickSupport app install karne ko bol rahe hain'
    },
    {
      id: 'money_transfer',
      labelUrdu: 'کہہ رہے ہیں کہ فوری طور پر فلاں نمبر یا اکاؤنٹ پر پیسے بھیجیں',
      labelRoman: 'Keh rahe hain ke foran kisi anjaan number par paise transfer karein'
    }
  ];

  const toggleCheck = (id) => {
    setSelectedChecks(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleRunCheck = async () => {
    setLoading(true);
    setVerdict(null);

    try {
      const res = await fetch('/api/scams/sos-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          checks: selectedChecks,
          callerNumber,
          query: queryText,
          lang: isUrdu ? 'urdu' : 'roman',
          familyCode: 'AMMI-2026'
        })
      });

      if (res.ok) {
        const data = await res.json();
        setVerdict(data);
      } else {
        throw new Error('Server returned error');
      }
    } catch {
      // Local zero-latency fallback
      const isDanger = selectedChecks.length > 0 || callerNumber.trim().startsWith('03') || queryText.toLowerCase().includes('otp');
      setVerdict({
        isScam: isDanger,
        dangerLevel: isDanger ? 'high' : 'low',
        headline: isUrdu
          ? (isDanger ? 'خبردار! یہ ۱۰۰ فیصد فراڈ کال یا پیغام ہے' : 'بظاہر محفوظ لگتا ہے')
          : (isDanger ? 'KHABARDAR! Yeh 100% Fraud Call ya SMS Hai' : 'Bazahir Mehfooz Lagta Hai'),
        explanation: isUrdu
          ? (isDanger
              ? 'اصلی بینک کا کوئی ملازم کبھی فون یا واٹس ایپ پر او ٹی پی یا پن کوڈ نہیں مانگتا۔ آپ کے پیسے محفوظ ہیں، بالکل نہ ڈریں۔ فوراً کال کاٹ دیں!'
              : 'اس پیغام میں فوری خطرہ نہیں ملا، لیکن یاد رکھیں کہ اپنا خفیہ پن کوڈ کبھی کسی کو نہ بتائیں۔')
          : (isDanger
              ? 'Asli bank ya idara KABHI bhi phone par OTP ya PIN nahi maangta! Aap ke account se koi paise nahi katengay. Foran call kaat dein aur number block karein.'
              : 'Is message mein foran koi khatra nahi mila, lekin yaad rakhein apna khufiya PIN kisi ko na dein.'),
        audioText: isUrdu
          ? (isDanger
              ? 'فوراً فون کاٹ دیں! یہ سو فیصد فراڈ ہے۔ اصلی بینک کبھی بھی فون پر کوڈ نہیں مانگتا۔ آپ کے پیسے محفوظ ہیں، بالکل نہ گھبرائیں۔'
              : 'بظاہر یہ محفوظ لگتا ہے، لیکن یاد رکھیں کہ اپنا خفیہ پن کوڈ کبھی کسی کو نہ بتائیں۔')
          : (isDanger
              ? 'Foran call kaat dein! Yeh 100 percent fraud hai. Asli bank kabhi phone par code nahi maangta. Aap ke paise mehfooz hain, ghabrayein nahi.'
              : 'Bazahir yeh theek lagta hai, lekin yaad rakhein apna khufiya PIN kisi ko na dein.'),
        actionList: isDanger
          ? [
              { text: isUrdu ? 'فوراً کال کاٹ دیں' : 'Foran call kaat dein (Disconnect)' },
              { text: isUrdu ? 'یہ نمبر اپنے فون میں بلاک کریں' : 'Yeh number block karein' },
              { text: isUrdu ? 'کوئی بھی او ٹی پی یا کوڈ مت بتائیں' : 'Koi code ya OTP na batayein' },
              { text: isUrdu ? 'بچوں کو واٹس ایپ پر الرٹ بھیجیں' : 'Bachon ko WhatsApp alert bhejein' }
            ]
          : [
              { text: isUrdu ? 'او ٹی پی اور پن کوڈ ہمیشہ خفیہ رکھیں' : 'PIN aur OTP hamesha khufiya rakhein' }
            ]
      });
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppAlert = () => {
    const defaultMsg = isUrdu
      ? `السلام علیکم بیٹا! مجھے ابھی ایک مشکوک کال یا میسج آیا تھا (${callerNumber || 'نامعلوم نمبر'}). ابو کا ٹیوٹر ایپ نے الرٹ کیا کہ یہ دھوکہ دہی ہے۔ میں نے کال کاٹ دی ہے، آپ ذرا چیک کر لیں۔`
      : `Salam Beta! Mujhe abhi ek mashkook call/SMS aayi thi (${callerNumber || 'Unknown Number'}). Abbu Ka Tutor app ne alert kiya ke yeh fraud hai. Maine call kaat di hai. Aap zara dekh lein.`;

    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(defaultMsg)}`;
    window.open(url, '_blank');
  };

  const toggleAction = (idx) => {
    setCheckedActions(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--bg)' }}>
      <LanguageToggle />

      <main style={{ padding: '20px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Top Emergency Banner */}
        <div style={{
          backgroundColor: '#991B1B',
          borderRadius: 'var(--radius-lg)',
          padding: '20px 18px',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          boxShadow: 'var(--shadow-md)',
          direction: isUrdu ? 'rtl' : 'ltr'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <IconShieldAlert size={28} />
          </div>

          <div style={{ flex: 1 }}>
            <h2 style={{
              fontSize: isUrdu ? '26px' : '20px',
              fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-sans)',
              fontWeight: '800',
              lineHeight: '1.2',
              marginBottom: '4px'
            }}>
              {isUrdu ? 'مجھے شک ہے! (فوری فراڈ چیک)' : 'Mujhe Shak Hai! (Emergency SOS)'}
            </h2>
            <p style={{
              fontSize: isUrdu ? '18px' : '14px',
              fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-sans)',
              color: '#FEE2E2',
              lineHeight: '1.4'
            }}>
              {isUrdu
                ? 'اگر ابھی کال یا میسج پر شک ہے تو نیچے بتائیں، ہم فوری رہنمائی کریں گے۔'
                : 'Agar abhi call ya SMS par shak hai to batayein, foran check karein.'}
            </p>
          </div>
        </div>

        {/* Diagnostic Checklist */}
        {!verdict && (
          <div style={{
            backgroundColor: 'var(--surface)',
            borderRadius: 'var(--radius-lg)',
            padding: '20px',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <h3 style={{
              fontSize: isUrdu ? '22px' : '17px',
              fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-sans)',
              fontWeight: '700',
              color: 'var(--text)',
              direction: isUrdu ? 'rtl' : 'ltr'
            }}>
              {isUrdu ? 'کیا آپ کے ساتھ یہ ہو رہا ہے؟ (منتخب کریں):' : 'Kya aap ke saath yeh ho raha hai? (Select):'}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {checkOptions.map(opt => {
                const isSelected = selectedChecks.includes(opt.id);
                return (
                  <div
                    key={opt.id}
                    onClick={() => toggleCheck(opt.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '14px 16px',
                      borderRadius: 'var(--radius-md)',
                      border: isSelected ? '2px solid var(--danger)' : '1px solid var(--border)',
                      backgroundColor: isSelected ? 'var(--danger-soft)' : 'var(--surface)',
                      cursor: 'pointer',
                      direction: isUrdu ? 'rtl' : 'ltr',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '4px',
                      border: isSelected ? '2px solid var(--danger)' : '2px solid var(--border)',
                      backgroundColor: isSelected ? 'var(--danger)' : '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                      flexShrink: 0
                    }}>
                      {isSelected && <IconCheck size={16} strokeWidth={3} />}
                    </div>

                    <span style={{
                      fontSize: isUrdu ? '19px' : '15px',
                      fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-sans)',
                      color: isSelected ? 'var(--danger-text)' : 'var(--text)',
                      fontWeight: isSelected ? '700' : '500',
                      lineHeight: isUrdu ? '1.8' : '1.4'
                    }}>
                      {isUrdu ? opt.labelUrdu : opt.labelRoman}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Caller Number or Message Text */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{
                fontSize: isUrdu ? '18px' : '14px',
                fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-sans)',
                fontWeight: '700',
                color: 'var(--text)',
                direction: isUrdu ? 'rtl' : 'ltr'
              }}>
                {isUrdu ? 'کال کرنے والے کا نمبر یا میسج (اختیاری):' : 'Caller number ya SMS (Optional):'}
              </label>

              <input
                type="text"
                placeholder={isUrdu ? 'مثلاً: 0300-1234567 یا میسج کا متن' : 'e.g. 0300-1234567 ya message'}
                value={callerNumber}
                onChange={e => setCallerNumber(e.target.value)}
                style={{
                  minHeight: '48px',
                  padding: '0 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1.5px solid var(--border)',
                  backgroundColor: 'var(--surface-muted)',
                  fontSize: '15px',
                  color: 'var(--text)',
                  direction: isUrdu ? 'rtl' : 'ltr'
                }}
              />
            </div>

            {/* Check Button */}
            <button
              type="button"
              onClick={handleRunCheck}
              disabled={loading}
              style={{
                width: '100%',
                minHeight: '56px',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                backgroundColor: '#DC2626',
                color: '#FFFFFF',
                fontSize: isUrdu ? '22px' : '18px',
                fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-sans)',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: 'var(--shadow-md)'
              }}
            >
              <IconShieldAlert size={22} />
              <span>{loading ? (isUrdu ? 'چیک ہو رہا ہے...' : 'Check ho raha hai...') : (isUrdu ? 'فوری چیک کریں' : 'Foran Check Karein')}</span>
            </button>
          </div>
        )}

        {/* Verdict Display */}
        {verdict && (
          <div style={{
            backgroundColor: verdict.isScam ? 'var(--danger-soft)' : 'var(--surface)',
            border: verdict.isScam ? '2px solid var(--danger)' : '1.5px solid var(--primary)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            animation: 'fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            boxShadow: 'var(--shadow-lg)'
          }}>
            {/* Verdict Header & Voice Audio */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: '12px',
              direction: isUrdu ? 'rtl' : 'ltr'
            }}>
              <div>
                <span style={{
                  display: 'inline-block',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: verdict.isScam ? 'var(--danger)' : 'var(--primary)',
                  color: '#FFFFFF',
                  fontSize: '12px',
                  fontWeight: '800',
                  letterSpacing: '0.5px',
                  marginBottom: '8px'
                }}>
                  {verdict.isScam ? 'HIGH RISK FRAUD' : 'SAFETY ADVICE'}
                </span>

                <h3 style={{
                  fontSize: isUrdu ? '26px' : '21px',
                  fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-sans)',
                  fontWeight: '800',
                  color: verdict.isScam ? 'var(--danger-text)' : 'var(--primary)',
                  lineHeight: isUrdu ? '1.8' : '1.3'
                }}>
                  {verdict.headline}
                </h3>
              </div>

              <VoiceButton text={verdict.audioText} autoPlay={true} />
            </div>

            {/* Reassurance & Explanation */}
            <p style={{
              fontSize: isUrdu ? '21px' : '17px',
              fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-sans)',
              lineHeight: isUrdu ? '2.0' : '1.5',
              color: 'var(--text)',
              direction: isUrdu ? 'rtl' : 'ltr'
            }}>
              {verdict.explanation}
            </p>

            {/* Reassurance Callout */}
            <div style={{
              padding: '14px 16px',
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              direction: isUrdu ? 'rtl' : 'ltr'
            }}>
              <IconShield size={22} style={{ color: 'var(--primary)', flexShrink: 0 }} />
              <span style={{
                fontSize: isUrdu ? '19px' : '15px',
                fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-sans)',
                color: 'var(--text)',
                fontWeight: '700'
              }}>
                {isUrdu
                  ? 'آپ کی تسلی: جب تک آپ خود کوڈ نہ بتائیں، اکاؤنٹ سے کوئی رقم نہیں جا سکتی۔'
                  : 'Tasalli: Jab tak aap khud code na batayein, account se koi raqam nahi kat sakti.'}
              </span>
            </div>

            {/* Action Checklist */}
            <div>
              <h4 style={{
                fontSize: isUrdu ? '19px' : '15px',
                fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-sans)',
                fontWeight: '700',
                color: 'var(--text)',
                marginBottom: '10px',
                direction: isUrdu ? 'rtl' : 'ltr'
              }}>
                {isUrdu ? 'ابھی یہ اقدامات کریں:' : 'Abhi yeh iqdamat karein:'}
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {verdict.actionList && verdict.actionList.map((action, idx) => {
                  const done = checkedActions[idx] || false;
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleAction(idx)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: done ? 'var(--surface-muted)' : '#FFFFFF',
                        border: '1px solid var(--border)',
                        cursor: 'pointer',
                        direction: isUrdu ? 'rtl' : 'ltr'
                      }}
                    >
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '3px',
                        border: done ? '2px solid var(--primary)' : '2px solid var(--border)',
                        backgroundColor: done ? 'var(--primary)' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#FFFFFF',
                        flexShrink: 0
                      }}>
                        {done && <IconCheck size={14} strokeWidth={3} />}
                      </div>

                      <span style={{
                        fontSize: isUrdu ? '18px' : '14px',
                        fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-sans)',
                        color: done ? 'var(--text-secondary)' : 'var(--text)',
                        textDecoration: done ? 'line-through' : 'none',
                        fontWeight: '600'
                      }}>
                        {action.text}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Primary Action: WhatsApp Family Alert */}
            {verdict.isScam && (
              <button
                type="button"
                onClick={handleWhatsAppAlert}
                style={{
                  width: '100%',
                  minHeight: '52px',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  backgroundColor: '#15803D',
                  color: '#FFFFFF',
                  fontSize: isUrdu ? '20px' : '16px',
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
                <IconPhoneCall size={18} />
                <span>{isUrdu ? 'بچوں کو واٹس ایپ پر الرٹ بھیجیں' : 'Bachon ko WhatsApp Alert Bhejein'}</span>
              </button>
            )}

            {/* Reset / Check Another Button */}
            <button
              type="button"
              onClick={() => {
                setVerdict(null);
                setSelectedChecks([]);
                setCallerNumber('');
                setQueryText('');
                setCheckedActions({});
              }}
              style={{
                width: '100%',
                minHeight: '44px',
                borderRadius: 'var(--radius-md)',
                border: '1.5px solid var(--border)',
                backgroundColor: 'var(--surface)',
                color: 'var(--text)',
                fontSize: isUrdu ? '17px' : '14px',
                fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-sans)',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              {isUrdu ? 'دوبارہ نیا چیک کریں' : 'Dobara naya check karein'}
            </button>
          </div>
        )}

        {/* Back to Home Button */}
        <button
          type="button"
          onClick={() => navigate('/')}
          style={{
            marginTop: '8px',
            width: '100%',
            minHeight: '48px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)',
            backgroundColor: 'var(--surface)',
            color: 'var(--text)',
            fontSize: isUrdu ? '18px' : '15px',
            fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-sans)',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <IconHome size={18} />
          <span>{isUrdu ? 'ہوم اسکرین پر واپس جائیں' : 'Home Screen par wapas jayein'}</span>
        </button>
      </main>
    </div>
  );
}
