import { defineConfig } from 'vite'
import { crx } from '@crxjs/vite-plugin'
import manifest from './manifest.json'

export default defineConfig({
  plugins: [crx({ manifest })],
  resolve: {
    alias: {
      '@shared': new URL('../shared', import.meta.url).pathname,
    },
  },
})
