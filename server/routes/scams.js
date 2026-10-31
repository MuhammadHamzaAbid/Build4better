import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getScamsList } from '../lib/fallback.js';
import { isAiAvailable, callOpenAI } from '../lib/openai.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROGRESS_FILE = path.join(__dirname, '..', 'data', 'progress.json');

const router = express.Router();

function recordSosAlert(familyCode, alertData) {
  try {
    let data = {};
    if (fs.existsSync(PROGRESS_FILE)) {
      data = JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));
    }
    if (!data[familyCode]) {
      data[familyCode] = { familyCode, confidence: { before: 2, after: 4 }, sessions: [], sosAlerts: [] };
    }
    if (!data[familyCode].sosAlerts) {
      data[familyCode].sosAlerts = [];
    }
    data[familyCode].sosAlerts.unshift(alertData);
    // Keep last 10 alerts
    data[familyCode].sosAlerts = data[familyCode].sosAlerts.slice(0, 10);
    fs.writeFileSync(PROGRESS_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.warn('Could not record SOS alert:', err.message);
  }
}

// GET /api/scams
router.get('/', (req, res) => {
  try {
    const list = getScamsList();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/scams/sos-check
router.post('/sos-check', async (req, res) => {
  const {
    checks = [],
    query = '',
    callerNumber = '',
    lang = 'roman',
    familyCode = 'AMMI-2026'
  } = req.body;

  const isUrdu = lang === 'urdu';
  const cleanQuery = (query || '').toLowerCase();
  const cleanNumber = (callerNumber || '').trim();

  // Red flags detection
  const hasCheckedRedFlag = checks.length > 0;
  const isPersonalPakistaniMobile = /^(03\d{2}|(\+923\d{2}))[\s-]?\d{7}$/.test(cleanNumber.replace(/[\s-]/g, ''));
  const hasScamKeywords = ['otp', 'pin', 'code', 'bisp', 'inam', 'inaam', 'lottery', 'block', 'band', 'suspend', 'anydesk', 'teamviewer', 'state bank', 'fia', 'police', 'benazir'].some(kw => cleanQuery.includes(kw));

  const isHighDanger = hasCheckedRedFlag || hasScamKeywords || (cleanNumber.length > 0 && isPersonalPakistaniMobile);

  let verdict = {
    isScam: isHighDanger,
    dangerLevel: isHighDanger ? 'high' : 'low',
    headline: isUrdu
      ? (isHighDanger ? '🚨 خبردار! یہ ۱۰۰ فیصد فراڈ کال یا پیغام ہے' : 'محفوظ یا عام پیغام')
      : (isHighDanger ? '🚨 KHABARDAR! Yeh 100% Fraud Call ya SMS Hai' : 'Bazahir Mehfooz Lagta Hai'),
    explanation: isUrdu
      ? (isHighDanger
          ? 'اصلی بینک یا ادارہ کبھی بھی فون یا واٹس ایپ پر او ٹی پی، پن کوڈ یا خفیہ معلومات نہیں مانگتا۔ آپ کے پیسے محفوظ ہیں، بالکل نہ ڈریں۔ فوراً کال کاٹ دیں!'
          : 'اس پیغام میں فوری خطرہ نہیں ملا، لیکن یاد رکھیں کہ اپنا خفیہ پن کوڈ یا او ٹی پی کبھی کسی کو نہ بتائیں۔')
      : (isHighDanger
          ? 'Asli bank ya idara KABHI bhi phone ya WhatsApp par OTP, PIN ya password nahi maangta! Aap ke account se koi paise nahi katengay. Foran call kaat dein aur number block karein.'
          : 'Is message mein foran koi khatra nahi mila, lekin yaad rakhein apna khufiya PIN ya OTP kisi ko na dein.'),
    audioText: isUrdu
      ? (isHighDanger
          ? 'فوراً فون کاٹ دیں! یہ سو فیصد فراڈ ہے۔ اصلی بینک کبھی بھی فون پر کوڈ نہیں مانگتا۔ آپ کے پیسے محفوظ ہیں، بالکل نہ گھبرائیں۔'
          : 'بظاہر یہ محفوظ لگتا ہے، لیکن یاد رکھیں کہ اپنا خفیہ پن کوڈ کبھی کسی کو نہ بتائیں۔')
      : (isHighDanger
          ? 'Foran call kaat dein! Yeh 100 percent fraud hai. Asli bank kabhi phone par code nahi maangta. Aap ke paise mehfooz hain, ghabrayein nahi.'
          : 'Bazahir yeh theek lagta hai, lekin yaad rakhein apna khufiya PIN ya OTP kabhi kisi ko na dein.'),
    actionList: isHighDanger
      ? [
          { text: isUrdu ? 'فوراً کال کاٹ دیں' : 'Foran call kaat dein (Disconnect)', done: false },
          { text: isUrdu ? 'یہ نمبر اپنے فون میں بلاک کریں' : 'Yeh number block karein', done: false },
          { text: isUrdu ? 'کوئی بھی او ٹی پی یا کوڈ مت بتائیں' : 'Koi code ya OTP na batayein', done: false },
          { text: isUrdu ? 'بچوں کو واٹس ایپ پر الرٹ بھیجیں' : 'Bachon ko WhatsApp alert bhejein', done: false }
        ]
      : [
          { text: isUrdu ? 'او ٹی پی اور پن کوڈ ہمیشہ خفیہ رکھیں' : 'PIN aur OTP hamesha khufiya rakhein', done: true },
          { text: isUrdu ? 'شک کی صورت میں بینک کی ہیلپ لائن ملائیں' : 'Bank helpline (111-...) par call karein', done: false }
        ]
  };

  // If AI available and user entered custom detailed text, enrich explanation
  if (isAiAvailable() && cleanQuery.length > 5) {
    try {
      const aiPrompt = `A Pakistani elder received a call or SMS: "${query}". Caller number: "${callerNumber}".
Is this a scam? Give a decisive, reassuring answer in ${isUrdu ? 'Urdu script' : 'simple Roman Urdu'}.
Never blame. If scam, explicitly tell them to hang up and reassure them their money is safe.
Output JSON: {"isScam": boolean, "headline": "", "explanation": "", "audioText": ""}`;

      const aiRes = await callOpenAI([
        { role: 'system', content: 'You are an emergency scam responder for Pakistani elders. Keep answers under 3 sentences.' },
        { role: 'user', content: aiPrompt }
      ]);
      const parsed = JSON.parse(aiRes);
      if (parsed.headline && parsed.explanation) {
        verdict.isScam = Boolean(parsed.isScam);
        verdict.dangerLevel = verdict.isScam ? 'high' : 'low';
        verdict.headline = parsed.headline;
        verdict.explanation = parsed.explanation;
        verdict.audioText = parsed.audioText || parsed.explanation;
      }
    } catch (err) {
      console.warn('AI SOS check failed, using robust rule verdict:', err.message);
    }
  }

  // Record incident to family progress if danger was detected
  if (verdict.isScam) {
    recordSosAlert(familyCode, {
      timestamp: new Date().toISOString(),
      callerNumber: callerNumber || 'Unknown Number',
      querySummary: query.slice(0, 60) || checks.join(', '),
      verdict: 'Fraud Attempt Defeated',
      resolved: true
    });
  }

  res.json(verdict);
});

export default router;
