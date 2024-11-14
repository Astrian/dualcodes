import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage',
      include: ['src/interface/**/*.ts'],
      exclude: ['node_modules/', 'test/', 'src/interface/**/*.test.ts'],
    },
    include: ['test/**/*.test.ts'],
    testTimeout: 999_999_999,
  },
})
