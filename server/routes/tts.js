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

// POST /api/tts
router.post('/', async (req, res) => {
  const { text, lang = 'ur' } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  const hash = crypto.createHash('md5').update(text).digest('hex');
  const cachedFile = path.join(CACHE_DIR, `${hash}.mp3`);

  if (fs.existsSync(cachedFile)) {
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('X-Cache', 'HIT');
    return fs.createReadStream(cachedFile).pipe(res);
  }

  if (!isAiAvailable()) {
    // Return 502 so client cleanly uses local mp3 or browser SpeechSynthesis
    return res.status(502).json({ error: 'TTS API unavailable, use local audio or browser speech' });
  }

  try {
    const audioBuffer = await generateSpeech(text);
    fs.writeFileSync(cachedFile, audioBuffer);
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('X-Cache', 'MISS');
    res.send(audioBuffer);
  } catch (err) {
    console.warn('TTS generation failed:', err.message);
    res.status(502).json({ error: 'TTS generation failed', details: err.message });
  }
});

export default router;
