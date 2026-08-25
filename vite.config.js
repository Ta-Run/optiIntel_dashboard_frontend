import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: false,
    proxy: {
      '/api': {
        target: process.env.VITE_API_PROXY || 'http://13.48.114.84:4566',
        changeOrigin: true,
      },
    },
  },
});
