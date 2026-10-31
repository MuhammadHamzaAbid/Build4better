import express from 'express';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { isAiAvailable, generateSpeech } from '../lib/openai.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CACHE_DIR = path.join(__dirname, '..', 'cache');

if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

const router = express.Router();

/**
 * Fetch free audio from Google Translate TTS as high-fidelity fallback.
 * Uses 'ur' for Urdu Nastaliq/Arabic script, 'hi' for Roman Urdu (phonetically accurate South Asian speech).
 */
async function fetchGoogleTTS(text, lang = 'ur') {
  const isUrduScript = /[\u0600-\u06FF]/.test(text);
  const tl = isUrduScript ? 'ur' : (lang === 'ur' || lang === 'urdu' || lang === 'roman' ? 'hi' : 'en');
  // Truncate to ~250 chars for Google TTS single-phrase query
  const cleanText = text.replace(/[\n\r]+/g, ' ').trim().slice(0, 250);
  const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${tl}&client=tw-ob&q=${encodeURIComponent(cleanText)}`;

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Referer': 'https://translate.google.com/'
    }
  });

  if (!response.ok) {
    throw new Error(`Google TTS returned HTTP ${response.status}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function getOrGenerateAudio(text, lang) {
  if (!text || typeof text !== 'string') {
    throw new Error('Valid text is required');
  }

  const cleanText = text.trim().slice(0, 500);
  if (!cleanText) {
    throw new Error('Text cannot be empty');
  }

  const cleanLang = (lang === 'urdu' || lang === 'ur') ? 'ur' : 'roman';
  const hash = crypto.createHash('md5').update(`${cleanText}_${cleanLang}`).digest('hex');
  const cachedFile = path.join(CACHE_DIR, `${hash}.mp3`);

  if (fs.existsSync(cachedFile)) {
    return { buffer: fs.readFileSync(cachedFile), hit: true };
  }

  // 1. Try OpenAI if configured
  if (isAiAvailable()) {
    try {
      const audioBuffer = await generateSpeech(cleanText);
      fs.writeFileSync(cachedFile, audioBuffer);
      return { buffer: audioBuffer, hit: false };
    } catch (err) {
      console.warn('OpenAI TTS failed, falling back to public engine:', err.message);
    }
  }

  // 2. High-reliability Urdu/Hindi TTS engine fallback
  const buffer = await fetchGoogleTTS(cleanText, cleanLang);
  fs.writeFileSync(cachedFile, buffer);
  return { buffer, hit: false };
}

// GET /api/tts?text=...&lang=...
router.get('/', async (req, res) => {
  const text = req.query.text;
  const lang = req.query.lang || 'ur';

  if (!text) {
    return res.status(400).json({ error: 'Text query parameter is required' });
  }

  try {
    const { buffer, hit } = await getOrGenerateAudio(text, lang);
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('X-Cache', hit ? 'HIT' : 'MISS');
    res.send(buffer);
  } catch (err) {
    console.error('TTS error:', err.message);
    res.status(500).json({ error: 'Failed to generate voice audio', details: err.message });
  }
});

// POST /api/tts
router.post('/', async (req, res) => {
  const { text, lang = 'ur' } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  try {
    const { buffer, hit } = await getOrGenerateAudio(text, lang);
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('X-Cache', hit ? 'HIT' : 'MISS');
    res.send(buffer);
  } catch (err) {
    console.error('TTS error:', err.message);
    res.status(500).json({ error: 'Failed to generate voice audio', details: err.message });
  }
});

export default router;
