import express from 'express';
import { isAiAvailable, callOpenAI } from '../lib/openai.js';
import { SYSTEM_PROMPT_EXPLAIN } from '../lib/prompts.js';
import { getExplainFallback } from '../lib/fallback.js';

const router = express.Router();

// POST /api/explain
router.post('/', async (req, res) => {
  const { stage = 'start', image, lang = 'roman', answer, context } = req.body;

  if (!isAiAvailable()) {
    res.setHeader('X-Source', 'fallback');
    return res.json(getExplainFallback(lang, stage));
  }

  try {
    const userContent = [];
    if (stage === 'start') {
      userContent.push({
        type: "text",
        text: `Stage: start. Language: ${lang}. Explain what this screen is in 1-2 sentences, determine risk, and ask what the user would do.`
      });
      if (image) {
        userContent.push({
          type: "image_url",
          image_url: { url: image.startsWith('data:') ? image : `data:image/png;base64,${image}` }
        });
      }
    } else {
      userContent.push({
        type: "text",
        text: `Stage: check. Language: ${lang}. Context: ${JSON.stringify(context || {})}. Learner's answer: "${answer}". Evaluate if this choice is safe and explain kindly.`
      });
    }

    const messages = [
      { role: "system", content: SYSTEM_PROMPT_EXPLAIN },
      { role: "user", content: userContent }
    ];

    const raw = await callOpenAI(messages);
    const parsed = JSON.parse(raw);
    res.json(parsed);
  } catch (err) {
    console.warn('Explain endpoint error, falling back:', err.message);
    res.setHeader('X-Source', 'fallback');
    res.json(getExplainFallback(lang, stage));
  }
});

export default router;
