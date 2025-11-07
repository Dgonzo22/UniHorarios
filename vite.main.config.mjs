import { defineConfig } from "vite";
export default defineConfig({
  build: {
    rollupOptions: {
      external: ["electron/main"], // Add electron/main to external dependencies
    },
  },
});
