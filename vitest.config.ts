import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['tests/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', '.next'],
    transformMode: { normalize: ['resolve-as-entry', 'legacy-head'] },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './')
    }
  }
})