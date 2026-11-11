import { defineConfig } from 'vite'
import { crx } from '@crxjs/vite-plugin'
import manifest from './manifest.config'

export default defineConfig({
  plugins: [crx({ manifest })],
  resolve: {
    alias: {
      '@shared': new URL('../shared', import.meta.url).pathname,
    },
  },
  // Readable builds: class names are used in logs and the code stays debuggable in the browser.
  build: {
    minify: false,
  },
  esbuild: {
    keepNames: true,
  },
})
