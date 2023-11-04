/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_GOOGLE_OAUTH_CLIENT_ID: string;
  VITE_GOOGLE_OAUTH_CLIENT_SECRET: string;
  VITE_BACKEND_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
