import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    // Unit tests live next to the code; Playwright owns e2e/.
    include: ['src/**/*.test.ts'],
  },
});
