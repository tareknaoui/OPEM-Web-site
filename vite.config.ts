/// <reference types="vitest/config" />
import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { liveEdit } from './vite.liveEdit.ts';
import { seo } from './vite.seo.ts';

// En-têtes de sécurité communs (dev + preview).
const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

// CSP stricte : seulement pour `npm run preview` (le serveur de dev de Vite
// injecte des scripts inline pour le rechargement à chaud, ce qui la casserait).
// Garder synchronisé avec public/_headers (utilisé en production).
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  // Carte de la page Contact (Google Maps intégré).
  'frame-src https://www.google.com https://maps.google.com',
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join('; ');

export default defineConfig({
  // liveEdit : modifier textes, tailles et emplacements depuis la page (développement seulement).
  // seo : robots.txt, sitemap.xml et adresse absolue de l'image d'aperçu (vite.seo.ts).
  plugins: [react(), liveEdit(), seo()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    headers: securityHeaders,
  },
  preview: {
    headers: { ...securityHeaders, 'Content-Security-Policy': contentSecurityPolicy },
  },
  build: {
    sourcemap: false, // ne pas exposer le code source en production
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
});
