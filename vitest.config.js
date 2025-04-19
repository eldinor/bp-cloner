import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom', // or 'happy-dom' if you prefer
    globals: true,
  //  setupFiles: './test/setup.js' // optional setup file
  },
  coverage: {
    exclude: [
      '**/*.{js,ts}',          // Exclude all JS/TS files outside /src
      '!src/**/*.{js,ts}',     // Include only /src files
    ]
  }
})