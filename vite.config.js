import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Dev-only: proxy /api to the local backend so the app works at localhost:5173
  // without CORS. This has no effect on the production build (`vite build`),
  // where the frontend and API are served from the same domain.
  server: {
    proxy: {
      // Dev proxy target. Point at the local backend (http://localhost:4000)
      // or at the live API as below. changeOrigin rewrites the Host header so
      // the live vhost/CDN accepts the request; secure verifies its TLS cert.
      '/api': {
         //target: 'https://ltsicon2026chennai.com',
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
