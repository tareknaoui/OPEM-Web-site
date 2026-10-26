/// <reference types="vite/client" />

// Déclarer ici chaque variable VITE_* pour avoir l'autocomplétion et le typage.
interface ImportMetaEnv {
  readonly VITE_APP_NAME?: string;
  readonly VITE_API_URL?: string;
  readonly VITE_WP_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
