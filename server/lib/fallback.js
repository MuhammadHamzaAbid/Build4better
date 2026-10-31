import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', 'data');

export function getLessonsList() {
  const lessonsDir = path.join(DATA_DIR, 'lessons');
  if (!fs.existsSync(lessonsDir)) return [];
  const files = fs.readdirSync(lessonsDir).filter(f => f.endsWith('.json'));
  return files.map(file => {
    try {
      const content = JSON.parse(fs.readFileSync(path.join(lessonsDir, file), 'utf8'));
      return { id: content.id, title: content.title };
    } catch {
      return null;
    }
  }).filter(Boolean);
}

export function getLessonById(id) {
  const filePath = path.join(DATA_DIR, 'lessons', `${id}.json`);
  if (!fs.existsSync(filePath)) {
    // Return the hero lesson as default fallback
    const fallbackPath = path.join(DATA_DIR, 'lessons', 'bijli-bill-01.json');
    if (fs.existsSync(fallbackPath)) {
      return JSON.parse(fs.readFileSync(fallbackPath, 'utf8'));
    }
    return null;
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

export function getScamsList() {
  const filePath = path.join(DATA_DIR, 'scams.json');
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

export function getExplainFallback(lang = 'roman', stage = 'start') {
  if (stage === 'start') {
    return lang === 'urdu' ? {
      summary: "یہ ایک محفوظ بینکنگ ایپ اسکرین ہے جہاں بل کی ادائیگی دکھائی گئی ہے۔",
      risk: "none",
      question: "آپ بل ادا کرنے کے لیے کیا کریں گی؟"
    } : {
      summary: "Yeh ek mehfooz banking app screen hai jahan bill ki adaigi dikhai gayi hai.",
      risk: "none",
      question: "Aap bill ada karne ke liye kya karengi?"
    };
  } else {
    return lang === 'urdu' ? {
      feedback: "بہت اچھے! آپ نے بالکل درست انتخاب کیا۔ ہمیشہ رقم اور نام کی تصدیق کر کے آگے بڑھیں۔",
      good_choice: true
    } : {
      feedback: "Bohat achay! Aap ne bilkul theek intikhab kiya. Hamesha raqam aur naam tasdeeq kar ke aage barhein.",
      good_choice: true
    };
  }
}
