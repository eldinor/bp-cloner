import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom', // or 'happy-dom' if you prefer
    globals: true,
  //  setupFiles: './test/setup.js' // optional setup file
  },
  coverage: {
    exclude: [
      'src/main.ts',
      'src/index.ts',
    ]
  }
})