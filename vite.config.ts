import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

const API_KEY = process.env.VITE_TMDB_API_KEY;

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.VITE_TMDB_API_KEY': JSON.stringify(env.VITE_TMDB_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      css: {
        postcss: './postcss.config.js',
      },
      server: {
        proxy: {
          '/proxy_vo': {
            target: 'https://vo-live-media.cdb.cdn.orange.com',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/proxy_vo/, ''),
          },
        },
      }
    };
});
