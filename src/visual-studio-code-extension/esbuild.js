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

/** @type {import('esbuild').BuildOptions} */
const commonOptions = {
  bundle: true,
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
}

/** @type {import('esbuild').BuildOptions} */
const extensionOptions = {
  ...commonOptions,
  entryPoints: ['background/extension.ts'],
  format: 'cjs',
  platform: 'node',
  outfile: 'dist/extension.js',
  external: ['vscode'],   // provided by the VS Code runtime — never bundle it
}

// The sidebar's page: a browser context of its own. Its imported CSS ends up in dist/webview/sidebar.css.
/** @type {import('esbuild').BuildOptions} */
const webviewOptions = {
  ...commonOptions,
  entryPoints: ['webview/sidebar.ts'],
  format: 'iife',
  platform: 'browser',
  outdir: 'dist/webview',
}

async function main() {
  const contexts = await Promise.all([
    esbuild.context(extensionOptions),
    esbuild.context(webviewOptions),
  ])

  if (watch) {
    await Promise.all(contexts.map(ctx => ctx.watch()))
  } else {
    await Promise.all(contexts.map(ctx => ctx.rebuild()))
    await Promise.all(contexts.map(ctx => ctx.dispose()))
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
