import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../lib/i18n';
import LanguageToggle from '../components/LanguageToggle';
import VoiceButton from '../components/VoiceButton';
import { IconSearch, IconShieldAlert, IconCheckCircle, IconLightbulb, IconRotate, IconHome } from '../components/Icons';
import { explainScreen } from '../lib/api';

export default function Explain() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const isUrdu = lang === 'urdu';

  const [selectedImage, setSelectedImage] = useState('/lessons/bijli/step6.svg');
  const [stage, setStage] = useState('idle');
  const [loading, setLoading] = useState(false);
  const [startResult, setStartResult] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [checkResult, setCheckResult] = useState(null);

  const sampleScreens = [
    { label: isUrdu ? 'مشکوک کال اسکرین' : 'Mushkook Call Screen', path: '/lessons/bijli/step6.svg' },
    { label: isUrdu ? 'بل سمری اسکرین' : 'Bill Summary Screen', path: '/lessons/bijli/step3.svg' },
    { label: isUrdu ? 'والٹ ادائیگی' : 'Wallet Adaigi', path: '/lessons/bijli/step4.svg' }
  ];

  const handleStartAnalysis = async (imgPath = selectedImage) => {
    setLoading(true);
    setCheckResult(null);
    setUserAnswer('');
    try {
      const res = await explainScreen('start', {
        image: imgPath,
        lang
      });
      setStartResult(res);
      setStage('start');
    } catch {
      setStartResult({
        summary: isUrdu ? 'یہ ایک اسکرین ہے جہاں کالر آپ سے خفیہ کوڈ مانگ رہا ہے۔' : 'Yeh screen par ek caller aap se khufiya code maang raha hai.',
        risk: 'scam',
        question: isUrdu ? 'ایسی صورت میں آپ کیا کریں گی؟' : 'Aap aisi soorat mein kya karengi?'
      });
      setStage('start');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckAnswer = async () => {
    if (!userAnswer.trim()) return;
    setLoading(true);
    try {
      const res = await explainScreen('check', {
        image: selectedImage,
        lang,
        answer: userAnswer,
        context: startResult
      });
      setCheckResult(res);
      setStage('check');
    } catch {
      setCheckResult({
        feedback: isUrdu
          ? 'بہت عمدہ! او ٹی پی یا پاس ورڈ فون پر کبھی نہ بتائیں۔ آپ نے بالکل محفوظ فیصلہ کیا۔'
          : 'Bohat umdah! OTP ya password phone par kisi ko na batayein. Aap ka faisla mehfooz tha.',
        good_choice: true
      });
      setStage('check');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--bg)' }}>
      <LanguageToggle />

      <div style={{ padding: '20px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            padding: '4px 10px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--gentle-soft)',
            color: 'var(--gentle-text)',
            fontWeight: '700'
          }}>
            <IconSearch size={16} />
            <span>{isUrdu ? 'یہ کیا ہے؟ رہنمائی' : 'SCREENSHOT COACH'}</span>
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

        <p style={{
          fontSize: isUrdu ? '21px' : '16px',
          fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-sans)',
          color: 'var(--text)',
          direction: isUrdu ? 'rtl' : 'ltr',
          lineHeight: isUrdu ? '1.9' : '1.4'
        }}>
          {isUrdu
            ? 'اگر موبائل کی کوئی اسکرین سمجھ نہ آئے تو یہاں دیکھیں۔ ہم آسان الفاظ میں رہنمائی کریں گے۔'
            : 'Agar phone ki koi screen samajh na aaye to yahan dekhein. Hum asan alfaaz mein samjhayenge.'}
        </p>

        {/* Sample Screen Selector */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {sampleScreens.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setSelectedImage(s.path);
                setStage('idle');
                setStartResult(null);
                setCheckResult(null);
              }}
              style={{
                flexShrink: 0,
                padding: '8px 14px',
                borderRadius: 'var(--radius-sm)',
                border: selectedImage === s.path ? '1.5px solid var(--primary)' : '1px solid var(--border)',
                backgroundColor: selectedImage === s.path ? 'var(--primary-soft)' : 'var(--surface)',
                color: selectedImage === s.path ? 'var(--primary)' : 'var(--text)',
                fontSize: '14px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Selected Screen Preview */}
        <div style={{
          position: 'relative',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          border: '1px solid var(--border)',
          backgroundColor: '#FFFFFF',
          boxShadow: 'var(--shadow-sm)',
          maxHeight: '300px'
        }}>
          <img
            src={selectedImage}
            alt="Screen to explain"
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </div>

        {/* Stage Idle: Trigger Analysis */}
        {stage === 'idle' && (
          <button
            type="button"
            onClick={() => handleStartAnalysis(selectedImage)}
            disabled={loading}
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
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            {loading ? (isUrdu ? 'جائزہ لیا جا رہا ہے...' : 'Jaiza liya ja raha hai...') : (isUrdu ? 'اس اسکرین کو سمجھائیں ➔' : 'Yeh Screen Samjhein ➔')}
          </button>
        )}

        {/* Stage Start: Explanation & Inactive Question */}
        {(stage === 'start' || stage === 'check') && startResult && (
          <div style={{
            backgroundColor: 'var(--surface)',
            borderRadius: 'var(--radius-lg)',
            padding: '20px',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            animation: 'fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            {startResult.risk === 'scam' && (
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--danger-soft)',
                color: 'var(--danger-text)',
                fontSize: '13px',
                fontWeight: '700',
                alignSelf: 'flex-start'
              }}>
                <IconShieldAlert size={16} />
                <span>{isUrdu ? 'ہوشیار! یہ مشکوک کال یا پیغام ہے' : 'Hoshiyar! Yeh mushkook ho sakta hai'}</span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <p style={{
                fontSize: isUrdu ? '21px' : '17px',
                fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-sans)',
                lineHeight: isUrdu ? '1.9' : '1.5',
                color: 'var(--text)',
                direction: isUrdu ? 'rtl' : 'ltr',
                flex: 1
              }}>
                {startResult.summary}
              </p>
              <VoiceButton text={startResult.summary} />
            </div>

            <div style={{
              padding: '12px 14px',
              backgroundColor: 'var(--primary-soft)',
              borderRadius: 'var(--radius-md)',
              borderLeft: isUrdu ? 'none' : '3px solid var(--primary)',
              borderRight: isUrdu ? '3px solid var(--primary)' : 'none',
              direction: isUrdu ? 'rtl' : 'ltr'
            }}>
              <p style={{
                fontSize: isUrdu ? '21px' : '16px',
                fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-sans)',
                fontWeight: '700',
                color: 'var(--primary)'
              }}>
                {startResult.question}
              </p>
            </div>

            {/* Answer Input */}
            {stage === 'start' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => setUserAnswer(isUrdu ? 'میں کبھی او ٹی پی نہیں بتاؤں گی' : 'Main kabhi OTP nahi bataoongi')}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border)',
                      backgroundColor: 'var(--surface-muted)',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    {isUrdu ? 'او ٹی پی نہیں بتاؤں گی' : 'OTP nahi bataoongi'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setUserAnswer(isUrdu ? 'میں رقم چیک کر کے بل ادا کروں گی' : 'Main raqam check kar ke ada karoongi')}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border)',
                      backgroundColor: 'var(--surface-muted)',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    {isUrdu ? 'رقم چیک کر کے ادا کروں گی' : 'Raqam check kar ke pay'}
                  </button>
                </div>

                <textarea
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder={isUrdu ? 'آپ کا ارادہ یہاں لکھیں...' : 'Apna jawab yahan likhein...'}
                  rows={2}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border)',
                    fontSize: '16px',
                    fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-sans)',
                    direction: isUrdu ? 'rtl' : 'ltr',
                    resize: 'none'
                  }}
                />

                <button
                  type="button"
                  onClick={handleCheckAnswer}
                  disabled={loading || !userAnswer.trim()}
                  style={{
                    minHeight: '50px',
                    borderRadius: 'var(--radius-md)',
                    border: 'none',
                    backgroundColor: 'var(--primary)',
                    color: '#FFFFFF',
                    fontSize: isUrdu ? '19px' : '16px',
                    fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-sans)',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  {loading ? (isUrdu ? 'رہنمائی لائی جا رہی ہے...' : 'Jawab check ho raha hai...') : (isUrdu ? 'جواب چیک کریں ➔' : 'Jawab Check Karein ➔')}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Stage Check: Feedback */}
        {stage === 'check' && checkResult && (
          <div style={{
            backgroundColor: 'var(--surface)',
            borderRadius: 'var(--radius-lg)',
            padding: '20px',
            border: '1.5px solid var(--primary)',
            boxShadow: 'var(--shadow-sm)',
            animation: 'fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)' }}>
              <IconCheckCircle size={22} />
              <h3 style={{
                fontSize: isUrdu ? '22px' : '18px',
                fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-sans)',
                fontWeight: '800'
              }}>
                {checkResult.good_choice
                  ? (isUrdu ? 'بہت دانشمندانہ فیصلہ!' : 'Bohat Daneshmandana Faisla!')
                  : (isUrdu ? 'اہم رہنمائی:' : 'Ahem Rahnumai:')}
              </h3>
            </div>

            <p style={{
              fontSize: isUrdu ? '21px' : '16px',
              fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-sans)',
              color: 'var(--text)',
              lineHeight: isUrdu ? '1.9' : '1.5',
              direction: isUrdu ? 'rtl' : 'ltr'
            }}>
              {checkResult.feedback}
            </p>

            <button
              type="button"
              onClick={() => {
                setStage('idle');
                setStartResult(null);
                setCheckResult(null);
                setUserAnswer('');
              }}
              style={{
                marginTop: '8px',
                minHeight: '46px',
                borderRadius: 'var(--radius-sm)',
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
              <IconRotate size={16} />
              <span>{isUrdu ? 'ایک اور اسکرین دیکھیں' : 'Ek Aur Screen Dekhein'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
