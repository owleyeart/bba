import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        configure: (proxy, options) => {
          // Fallback: if proxy fails, fetch directly from Substack
          proxy.on('error', (err, req, res) => {
            console.log('Proxy error, will fetch directly from Substack RSS');
          });
        },
      },
    },
  },
});
