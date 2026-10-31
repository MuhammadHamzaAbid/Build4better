import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../lib/i18n';
import LanguageToggle from '../components/LanguageToggle';
import VoiceButton from '../components/VoiceButton';
import { explainScreen } from '../lib/api';

export default function Explain() {
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  const isUrdu = lang === 'urdu';

  const [selectedImage, setSelectedImage] = useState('/lessons/bijli/step6.svg');
  const [stage, setStage] = useState('idle'); // 'idle' | 'start' | 'check'
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
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <LanguageToggle />

      <div style={{ padding: '20px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{
              fontSize: '13px',
              padding: '4px 10px',
              borderRadius: '10px',
              backgroundColor: 'var(--gentle-soft)',
              color: '#8A5200',
              fontWeight: 'bold'
            }}>
              🔍 {isUrdu ? 'یہ کیا ہے؟ رہنمائی' : 'Yeh Kya Hai? Coach'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => navigate('/')}
            style={{
              border: 'none',
              background: 'transparent',
              color: 'var(--muted)',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            🏠 Home
          </button>
        </div>

        <p style={{
          fontSize: isUrdu ? '22px' : '17px',
          fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-roman)',
          color: 'var(--text)',
          direction: isUrdu ? 'rtl' : 'ltr'
        }}>
          {isUrdu
            ? 'اگر موبائل کی کوئی اسکرین سمجھ نہ آئے تو یہاں دیکھیں۔ ہم آسان الفاظ میں سمجھائیں گے۔'
            : 'Agar phone ki koi screen samajh na aaye to yahan dekhein. Hum asan alfaaz mein samjhayenge.'}
        </p>

        {/* Sample Screen Picker */}
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
                padding: '8px 12px',
                borderRadius: '12px',
                border: selectedImage === s.path ? '2px solid var(--primary)' : '1px solid var(--border)',
                backgroundColor: selectedImage === s.path ? 'var(--primary-soft)' : 'var(--surface)',
                color: selectedImage === s.path ? 'var(--primary)' : 'var(--text)',
                fontSize: '14px',
                fontWeight: 'bold',
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
          borderRadius: '18px',
          overflow: 'hidden',
          border: '2px solid var(--border)',
          backgroundColor: '#FFFFFF',
          maxHeight: '320px'
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
              minHeight: '58px',
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
            {loading ? (isUrdu ? 'جائزہ لیا جا رہا ہے...' : 'Jaiza liya ja raha hai...') : (isUrdu ? 'اس اسکرین کو سمجھائیں ➔' : 'Yeh Screen Samjhein ➔')}
          </button>
        )}

        {/* Stage Start: Summary & "Aap kya karengi?" Question */}
        {(stage === 'start' || stage === 'check') && startResult && (
          <div style={{
            backgroundColor: 'var(--surface)',
            borderRadius: '18px',
            padding: '20px',
            border: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            animation: 'slideUp 0.3s ease'
          }}>
            {/* Risk badge */}
            <div>
              {startResult.risk === 'scam' && (
                <span style={{
                  padding: '4px 10px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--danger-soft)',
                  color: 'var(--danger)',
                  fontSize: '13px',
                  fontWeight: 'bold'
                }}>
                  🚨 {isUrdu ? 'ہوشیار! یہ مشکوک یا فراڈ ہو سکتا ہے' : 'Hoshiyar! Yeh mushkook ho sakta hai'}
                </span>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <p style={{
                fontSize: isUrdu ? '22px' : '18px',
                fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-roman)',
                lineHeight: isUrdu ? '1.8' : '1.5',
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
              borderRadius: '12px',
              direction: isUrdu ? 'rtl' : 'ltr'
            }}>
              <p style={{
                fontSize: isUrdu ? '22px' : '18px',
                fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-roman)',
                fontWeight: 'bold',
                color: 'var(--primary)'
              }}>
                ❓ {startResult.question}
              </p>
            </div>

            {/* Answer Input and Quick Choices */}
            {stage === 'start' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => setUserAnswer(isUrdu ? 'میں کبھی او ٹی پی نہیں بتاؤں گی' : 'Main kabhi OTP nahi bataoongi')}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '10px',
                      border: '1px solid var(--primary)',
                      backgroundColor: '#FFFFFF',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    🛡️ {isUrdu ? 'او ٹی پی نہیں بتاؤں گی' : 'OTP nahi bataoongi'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setUserAnswer(isUrdu ? 'میں رقم چیک کر کے بل ادا کروں گی' : 'Main raqam check kar ke ada karoongi')}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '10px',
                      border: '1px solid var(--primary)',
                      backgroundColor: '#FFFFFF',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    💳 {isUrdu ? 'رقم چیک کر کے ادا کروں گی' : 'Raqam check kar ke pay'}
                  </button>
                </div>

                <textarea
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder={isUrdu ? 'آپ کا جواب یہاں لکھیں...' : 'Apna jawab yahan likhein...'}
                  rows={2}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '12px',
                    border: '1px solid var(--border)',
                    fontSize: '16px',
                    fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-roman)',
                    direction: isUrdu ? 'rtl' : 'ltr'
                  }}
                />

                <button
                  type="button"
                  onClick={handleCheckAnswer}
                  disabled={loading || !userAnswer.trim()}
                  style={{
                    minHeight: '52px',
                    borderRadius: '14px',
                    border: 'none',
                    backgroundColor: 'var(--primary)',
                    color: '#FFFFFF',
                    fontSize: isUrdu ? '20px' : '17px',
                    fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-roman)',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  {loading ? (isUrdu ? 'رہنمائی لائی جا رہی ہے...' : 'Jawab check ho raha hai...') : (isUrdu ? 'جواب چیک کریں ➔' : 'Jawab Check Karein ➔')}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Stage Check: Feedback Reveal */}
        {stage === 'check' && checkResult && (
          <div style={{
            backgroundColor: 'var(--surface)',
            borderRadius: '18px',
            padding: '20px',
            border: '2px solid var(--primary)',
            animation: 'slideUp 0.3s ease',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '26px' }}>{checkResult.good_choice ? '🌟' : '💡'}</span>
              <h3 style={{
                fontSize: isUrdu ? '24px' : '20px',
                fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-roman)',
                color: 'var(--primary)',
                fontWeight: 'bold'
              }}>
                {checkResult.good_choice
                  ? (isUrdu ? 'بہت دانشمندانہ فیصلہ!' : 'Bohat Daneshmandana Faisla!')
                  : (isUrdu ? 'اہم رہنمائی:' : 'Ahem Rahnumai:')}
              </h3>
            </div>

            <p style={{
              fontSize: isUrdu ? '22px' : '18px',
              fontFamily: isUrdu ? 'var(--font-urdu)' : 'var(--font-roman)',
              color: 'var(--text)',
              lineHeight: isUrdu ? '1.8' : '1.5',
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
                marginTop: '10px',
                minHeight: '48px',
                borderRadius: '12px',
                border: '1px solid var(--border)',
                backgroundColor: '#FFFFFF',
                color: 'var(--muted)',
                fontSize: '15px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              🔄 {isUrdu ? 'ایک اور اسکرین دیکھیں' : 'Ek Aur Screen Dekhein'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
