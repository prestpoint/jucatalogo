import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        catalog: resolve(projectRoot, 'index.html'),
        mobilePreview: resolve(projectRoot, 'mobile-preview.html'),
      },
    },
  },
});
