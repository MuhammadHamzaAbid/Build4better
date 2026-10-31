const API_URL = import.meta.env.VITE_API_URL || '';

export async function fetchLessons() {
  try {
    const res = await fetch(`${API_URL}/api/lessons`);
    if (!res.ok) throw new Error('Failed to load lessons');
    return await res.json();
  } catch (err) {
    console.warn('API error, using local fallback:', err);
    return [{ id: 'bijli-bill-01', title: { urdu: 'بجلی کا بل ادا کریں', roman: 'Bijli ka bill ada karein' } }];
  }
}

export async function fetchLessonById(id) {
  try {
    const res = await fetch(`${API_URL}/api/lessons/${id}`);
    if (!res.ok) throw new Error('Failed to load lesson');
    return await res.json();
  } catch (err) {
    console.warn('API error, using local hero lesson fallback:', err);
    // Dynamic import fallback or return null so component uses bundled data
    return null;
  }
}

export async function fetchScams() {
  try {
    const res = await fetch(`${API_URL}/api/scams`);
    if (!res.ok) throw new Error('Failed to load scams');
    return await res.json();
  } catch (err) {
    console.warn('API error fetching scams:', err);
    return [];
  }
}

export async function postProgress(progressData) {
  try {
    await fetch(`${API_URL}/api/progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(progressData),
    });
  } catch (err) {
    console.warn('Silent progress save failure:', err);
  }
}

export async function postConfidence(confidenceData) {
  try {
    await fetch(`${API_URL}/api/confidence`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(confidenceData),
    });
  } catch (err) {
    console.warn('Silent confidence save failure:', err);
  }
}

export async function fetchFamilyProgress(familyCode = 'AMMI-2026') {
  try {
    const res = await fetch(`${API_URL}/api/progress/${familyCode}`);
    if (!res.ok) throw new Error('Failed to fetch progress');
    return await res.json();
  } catch (err) {
    console.warn('Progress fetch error:', err);
    return null;
  }
}

export async function generateLesson(task, images) {
  const res = await fetch(`${API_URL}/api/lessons/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task, images }),
  });
  return await res.json();
}

export async function explainScreen(stage, { image, lang, answer, context }) {
  const res = await fetch(`${API_URL}/api/explain`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stage, image, lang, answer, context }),
  });
  return await res.json();
}
