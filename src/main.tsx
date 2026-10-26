import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '@/app/App';
import { applyLanguage, readStoredLanguage } from '@/i18n/language';
import '@/styles/global.css';

// Appliquer la langue (et le sens de lecture) avant le premier affichage :
// évite un flash de la mise en page française pour un visiteur arabophone.
applyLanguage(readStoredLanguage());

const container = document.getElementById('root');
if (!container) throw new Error('Élément #root introuvable dans index.html');

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
