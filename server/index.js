import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import lessonsRouter from './routes/lessons.js';
import scamsRouter from './routes/scams.js';
import explainRouter from './routes/explain.js';
import ttsRouter from './routes/tts.js';
import progressRouter from './routes/progress.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
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

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
