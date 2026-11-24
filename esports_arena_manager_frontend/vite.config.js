import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'ARENA_');
  const target = env.ARENA_BACKEND_URL || 'http://localhost:8080';
  const proxy = { '/api': { target } };

  return {
    plugins: [react()],
    server: { proxy },
    preview: { proxy },
    test: {
      environment: 'jsdom',
      globals: true,
    },
  };
});
