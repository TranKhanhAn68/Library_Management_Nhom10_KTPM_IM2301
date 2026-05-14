import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/SetupTest.js',

    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: [
        "src/services/**",
        "src/utils/**"
      ]
    },
  }
})
