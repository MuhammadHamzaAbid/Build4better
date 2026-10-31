import express from 'express';
import { getScamsList } from '../lib/fallback.js';

const router = express.Router();

// GET /api/scams
router.get('/', (req, res) => {
  try {
    const list = getScamsList();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
