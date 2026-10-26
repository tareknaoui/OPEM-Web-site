// Accès centralisé aux variables d'environnement.
// Le reste du code importe `env` au lieu de lire import.meta.env directement :
// une seule source de vérité, typée, avec des valeurs par défaut.
//
// Rappel sécurité : tout ce qui est ici finit dans le navigateur.
// Aucun secret ne doit transiter par une variable VITE_*.

function readOptional(key: keyof ImportMetaEnv): string | null {
  const value = import.meta.env[key];
  return typeof value === 'string' && value.trim() !== '' ? value.trim() : null;
}

function read(key: keyof ImportMetaEnv, fallback: string): string {
  return readOptional(key) ?? fallback;
}

export const env = {
  appName: read('VITE_APP_NAME', 'OPEM'),
  apiUrl: read('VITE_API_URL', '/api'),
  /** URL de l'API REST WordPress, ex. https://opem.dz/wp-json. Vide = menu intégré. */
  wpApiUrl: readOptional('VITE_WP_API_URL')?.replace(/\/+$/, '') ?? null,
  isDev: import.meta.env.DEV,
} as const;
