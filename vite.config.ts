import path from 'path';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

const DEFAULT_FUNCTIONS_BASE_URL = 'https://kijwizzgbrytvgseixme.supabase.co/functions/v1';

function contentSecurityPolicy(functionsBaseUrl: string): Plugin {
  const functionsOrigin = new URL(functionsBaseUrl).origin;
  const google = [
    'https://www.googletagmanager.com',
    'https://*.googletagmanager.com',
    'https://*.google-analytics.com',
    'https://*.analytics.google.com',
    'https://*.googleadservices.com',
    'https://*.doubleclick.net',
    'https://*.google.com',
    'https://*.google.com.br'
  ].join(' ');

  const policy = [
    "default-src 'self'",
    `script-src 'self' ${google}`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: blob: https:",
    `connect-src 'self' ${functionsOrigin} ${google}`,
    `frame-src ${google}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    'upgrade-insecure-requests'
  ].join('; ');

  return {
    name: 'green-csp',
    apply: 'build',
    transformIndexHtml() {
      return [
        { tag: 'meta', attrs: { 'http-equiv': 'Content-Security-Policy', content: policy }, injectTo: 'head-prepend' },
        { tag: 'meta', attrs: { name: 'referrer', content: 'strict-origin-when-cross-origin' }, injectTo: 'head-prepend' }
      ];
    }
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: 'localhost',
    },
    build: {
      emptyOutDir: true,
    },
    plugins: [react(), contentSecurityPolicy(env.VITE_FUNCTIONS_BASE_URL || DEFAULT_FUNCTIONS_BASE_URL)],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
