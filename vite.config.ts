import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  test: {
    // Only the app's own tests. `.claude/hooks/tests/*.test.cjs` are standalone
    // Node scripts with their own runner (`node .claude/hooks/tests/run-all.cjs`).
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    css: true,
  },
})
