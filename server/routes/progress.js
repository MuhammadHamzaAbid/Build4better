import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROGRESS_FILE = path.join(__dirname, '..', 'data', 'progress.json');

const router = express.Router();

function readProgress() {
  if (!fs.existsSync(PROGRESS_FILE)) return {};
  try {
    return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));
  } catch {
    return {};
  }
}

function writeProgress(data) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// POST /api/progress
router.post('/', (req, res) => {
  const { familyCode = 'AMMI-2026', lessonId, stepId, attempts = 1, hintsUsed = 0, correct = true } = req.body;
  const data = readProgress();
  if (!data[familyCode]) {
    data[familyCode] = { familyCode, confidence: { before: 2, after: 4 }, sessions: [] };
  }
  data[familyCode].sessions.push({
    lessonId,
    stepId,
    attempts,
    hintsUsed,
    correct,
    timestamp: new Date().toISOString()
  });
  writeProgress(data);
  res.json({ ok: true });
});

// POST /api/confidence
router.post('/confidence', (req, res) => {
  const { familyCode = 'AMMI-2026', phase = 'after', value = 4 } = req.body;
  const data = readProgress();
  if (!data[familyCode]) {
    data[familyCode] = { familyCode, confidence: { before: 2, after: 4 }, sessions: [] };
  }
  if (!data[familyCode].confidence) {
    data[familyCode].confidence = { before: 2, after: 4 };
  }
  data[familyCode].confidence[phase] = Number(value);
  writeProgress(data);
  res.json({ ok: true });
});

// GET /api/progress/:familyCode
router.get('/:familyCode', (req, res) => {
  const { familyCode } = req.params;
  const data = readProgress();
  const fam = data[familyCode] || data['AMMI-2026'] || {
    familyCode,
    confidence: { before: 2, after: 4 },
    sessions: []
  };

  const sessions = fam.sessions || [];
  // Hesitations: attempts >= 2 OR hintsUsed >= 1
  const hesitations = sessions.filter(s => s.attempts >= 2 || s.hintsUsed >= 1);

  // Mistakes by attempt count
  const mistakesByAttempt = { 1: 0, 2: 0, 3: 0 };
  sessions.forEach(s => {
    if (s.attempts === 1) mistakesByAttempt[1]++;
    else if (s.attempts === 2) mistakesByAttempt[2]++;
    else mistakesByAttempt[3]++;
  });

  res.json({
    familyCode,
    confidence: fam.confidence || { before: 2, after: 4 },
    hesitations,
    mistakesByAttempt,
    totalCompletedSteps: sessions.length
  });
});

export default router;
