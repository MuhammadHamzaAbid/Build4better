import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './lib/i18n';
import PhoneFrame from './components/PhoneFrame';

import Home from './pages/Home';
import Lesson from './pages/Lesson';
import LessonComplete from './pages/LessonComplete';
import ScamDojo from './pages/ScamDojo';
import Explain from './pages/Explain';
import Builder from './pages/Builder';
import Family from './pages/Family';
import ScamSOS from './pages/ScamSOS';

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <PhoneFrame>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/lesson/:id" element={<Lesson />} />
            <Route path="/lesson/:id/done" element={<LessonComplete />} />
            <Route path="/scams" element={<ScamDojo />} />
            <Route path="/sos" element={<ScamSOS />} />
            <Route path="/explain" element={<Explain />} />
            <Route path="/builder" element={<Builder />} />
            <Route path="/family" element={<Family />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </PhoneFrame>
      </BrowserRouter>
    </LanguageProvider>
  );
}
