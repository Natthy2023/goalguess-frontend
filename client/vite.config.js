import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://goalguessapi-8g12q0bk.b4a.run/',
        changeOrigin: true
      }
    }
  }
});
