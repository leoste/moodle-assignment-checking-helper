const esbuild = require('esbuild')
const path = require('path')

const production = process.argv.includes('--production')
const watch      = process.argv.includes('--watch')

/** @type {import('esbuild').Plugin} */
const problemMatcherPlugin = {
  name: 'problem-matcher',
  setup(build) {
    build.onStart(() => console.log('[watch] build started'))
    build.onEnd((result) => {
      result.errors.forEach(({ text, location }) => {
        console.error(`✘ [ERROR] ${text}`)
        if (location) console.error(`    ${location.file}:${location.line}:${location.column}:`)
      })
      console.log('[watch] build finished')
    })
  },
}

async function main() {
  const ctx = await esbuild.context({
    entryPoints: ['src/extension.ts'],
    bundle: true,
    format: 'cjs',
    platform: 'node',
    outfile: 'dist/extension.js',
    external: ['vscode'],   // provided by the VS Code runtime — never bundle it
    // Readable builds: class names are used in logs and the code stays debuggable.
    minify: false,
    keepNames: true,
    sourcemap: !production,
    sourcesContent: false,
    logLevel: 'warning',
    alias: {
      '@shared': path.resolve(__dirname, '../shared'),
    },
    plugins: [problemMatcherPlugin],
  })

  if (watch) {
    await ctx.watch()
  } else {
    await ctx.rebuild()
    await ctx.dispose()
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
