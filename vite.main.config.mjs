import { defineConfig } from 'vite';

// https://vitejs.dev/config
export default defineConfig({ 
    build: {
    rollupOptions: {
      external: ['electron/main'], // Add electron/main to external dependencies
    },
  }});
