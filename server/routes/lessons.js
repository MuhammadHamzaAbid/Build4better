import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getLessonsList, getLessonById } from '../lib/fallback.js';
import { callOpenAI, isAiAvailable } from '../lib/openai.js';
import { SYSTEM_PROMPT_LESSON_GENERATOR } from '../lib/prompts.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LESSONS_DIR = path.join(__dirname, '..', 'data', 'lessons');

const router = express.Router();

// GET /api/lessons
router.get('/', (req, res) => {
  try {
    const list = getLessonsList();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/lessons/:id
router.get('/:id', (req, res) => {
  try {
    const lesson = getLessonById(req.params.id);
    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }
    res.json(lesson);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/lessons/generate
router.post('/generate', async (req, res) => {
  const { task, images = [], level = 'beginner' } = req.body;

  if (!isAiAvailable()) {
    res.setHeader('X-Source', 'fallback');
    const fallback = getLessonById('bijli-bill-01');
    return res.json({
      ...fallback,
      id: 'custom-' + Date.now(),
      title: {
        roman: task || fallback.title.roman,
        urdu: fallback.title.urdu
      }
    });
  }

  try {
    const content = [
      { type: "text", text: `Task: ${task || 'Pay electricity bill'}. Level: ${level}. Generate a 4 to 8 step lesson.` }
    ];

    // Add screenshots if provided (base64)
    if (Array.isArray(images)) {
      for (const img of images.slice(0, 5)) {
        content.push({
          type: "image_url",
          image_url: { url: img.startsWith('data:') ? img : `data:image/png;base64,${img}` }
        });
      }
    }

    const messages = [
      { role: "system", content: SYSTEM_PROMPT_LESSON_GENERATOR },
      { role: "user", content }
    ];

    const raw = await callOpenAI(messages);
    const parsed = JSON.parse(raw);
    res.json(parsed);
  } catch (err) {
    console.warn('AI generation error, falling back:', err.message);
    res.setHeader('X-Source', 'fallback');
    const fallback = getLessonById('bijli-bill-01');
    res.json({
      ...fallback,
      id: 'custom-' + Date.now(),
      title: {
        roman: task || fallback.title.roman,
        urdu: fallback.title.urdu
      }
    });
  }
});

// POST /api/lessons/save
router.post('/save', (req, res) => {
  try {
    const lesson = req.body;
    if (!lesson || !lesson.id || typeof lesson.id !== 'string') {
      return res.status(400).json({ error: 'Invalid lesson data: id is required' });
    }

    // Strictly sanitize lesson.id to prevent arbitrary file write / path traversal
    const safeId = path.basename(lesson.id).replace(/[^a-zA-Z0-9_-]/g, '');
    if (!safeId) {
      return res.status(400).json({ error: 'Invalid lesson id characters' });
    }

    const resolvedDir = path.resolve(LESSONS_DIR);
    const savePath = path.resolve(resolvedDir, `${safeId}.json`);
    if (!savePath.startsWith(resolvedDir)) {
      return res.status(403).json({ error: 'Access denied: path traversal detected' });
    }

    fs.writeFileSync(savePath, JSON.stringify({ ...lesson, id: safeId }, null, 2), 'utf8');
    res.json({ ok: true, id: safeId });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save lesson safely', details: err.message });
  }
});

export default router;
