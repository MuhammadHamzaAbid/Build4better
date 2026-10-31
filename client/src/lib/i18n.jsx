import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('abbu_lang') || 'roman');
  const [voiceEnabled, setVoiceEnabled] = useState(() => localStorage.getItem('abbu_voice') === 'true');

  useEffect(() => {
    localStorage.setItem('abbu_lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('abbu_voice', voiceEnabled);
  }, [voiceEnabled]);

  const toggleLanguage = (selectedLang) => {
    setLang(selectedLang);
  };

  const toggleVoice = () => {
    setVoiceEnabled(prev => !prev);
  };

  const t = (obj, fallback = '') => {
    if (!obj) return fallback;
    if (typeof obj === 'string') return obj;
    return obj[lang] || obj.roman || obj.urdu || fallback;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang: toggleLanguage, voiceEnabled, toggleVoice, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
