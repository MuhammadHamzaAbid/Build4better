import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;
let openai = null;
if (apiKey) {
  openai = new OpenAI({ apiKey });
}

export function isAiAvailable() {
  return Boolean(openai && process.env.USE_FALLBACK !== 'true');
}

export async function callOpenAI(messages, model = process.env.MODEL_TEXT || 'gpt-4o', timeoutMs = 20000) {
  if (!isAiAvailable()) {
    throw new Error('AI not configured or USE_FALLBACK is true');
  }

  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('OpenAI API timeout after ' + timeoutMs + 'ms')), timeoutMs)
  );

  const apiPromise = openai.chat.completions.create({
    model,
    messages,
    response_format: { type: "json_object" },
    temperature: 0.3,
  });

  const response = await Promise.race([apiPromise, timeoutPromise]);
  return response.choices[0].message.content;
}

export async function generateSpeech(text, voice = process.env.TTS_VOICE || 'alloy') {
  if (!isAiAvailable()) {
    throw new Error('TTS not available');
  }

  const mp3 = await openai.audio.speech.create({
    model: process.env.TTS_MODEL || 'tts-1',
    voice: voice,
    input: text,
  });

  return Buffer.from(await mp3.arrayBuffer());
}
