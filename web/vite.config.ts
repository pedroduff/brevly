import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    setupFiles: ['./src/test/setup.ts'],
  },
  server: {
    port: 5173,
    proxy: process.env.VITE_BACKEND_URL
      ? undefined
      : { '/api': { target: 'http://localhost:3000', changeOrigin: true, rewrite: (p) => p.replace(/^\/api/, '') } },
  },
});
