import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '@/app/App';
import { applyLanguage, readStoredLanguage } from '@/i18n/language';
import '@/styles/global.css';

// Appliquer la langue (et le sens de lecture) avant le premier affichage :
// évite un flash de la mise en page française pour un visiteur arabophone.
applyLanguage(readStoredLanguage());

// Le <title> d'index.html sert aux robots qui n'exécutent pas le JavaScript. Chaque page pose
// ensuite le sien : on retire celui d'ouverture pour ne jamais en avoir deux.
document.head.querySelector('title')?.remove();

const container = document.getElementById('root');
if (!container) throw new Error('Élément #root introuvable dans index.html');

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
