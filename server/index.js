import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import lessonsRouter from './routes/lessons.js';
import scamsRouter from './routes/scams.js';
import explainRouter from './routes/explain.js';
import ttsRouter from './routes/tts.js';
import progressRouter from './routes/progress.js';
import assistantRouter from './routes/assistant.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// 1. Security Headers via Helmet
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

// 2. Controlled CORS
app.use(cors());

// 3. Global Rate Limiter: 200 requests per 5 minutes per IP
const globalLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 200,
  message: { error: 'Too many requests, please try again in a few minutes.' },
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api', globalLimiter);

// 4. Stricter Rate Limiter for AI Generation & Audio Endpoints (60 per 5 min)
const aiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 60,
  message: { error: 'Request rate limit reached for AI services. Please slow down.' },
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api/lessons/generate', aiLimiter);
app.use('/api/explain', aiLimiter);
app.use('/api/assistant', aiLimiter);

// 5. Body Parsing with bounds
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    product: 'Abbu Ka Tutor API',
    time: new Date().toISOString(),
    fallback: process.env.USE_FALLBACK === 'true'
  });
});

// Routes
app.use('/api/lessons', lessonsRouter);
app.use('/api/scams', scamsRouter);
app.use('/api/explain', explainRouter);
app.use('/api/tts', ttsRouter);
app.use('/api/progress', progressRouter);
app.use('/api/confidence', progressRouter);
app.use('/api/assistant', assistantRouter);

// Centralized Safe Error Handling Middleware (No Stack Leakage)
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err.message);
  res.status(err.status || 500).json({
    error: 'A server error occurred. Please try again.',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`Server listening securely on port ${PORT}`);
});
