import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts'],
    reporters: ['verbose', 'json'],
    outputFile: {
      json: './reports/vitest-report.json'
    },
    testTimeout: 30000,
    hookTimeout: 30000
  }
})
