import { execFileSync, execSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { createInterface } from 'node:readline/promises'
import { fileURLToPath } from 'node:url'

const ROOT = dirname(fileURLToPath(import.meta.url))
const CHROME_DIR = join(ROOT, 'google-chrome-extension')
const VSCODE_DIR = join(ROOT, 'visual-studio-code-extension')
const RELEASES_DIR = join(ROOT, 'releases')

function readVersion(extensionDir) {
  return JSON.parse(readFileSync(join(extensionDir, 'package.json'), 'utf8')).version
}

function run(command, cwd) {
  console.log(`\n> ${command}   (${cwd})`)
  execSync(command, { cwd, stdio: 'inherit' })
}

async function confirm(question) {
  const readline = createInterface({ input: process.stdin, output: process.stdout })
  const answer = await readline.question(`${question} (y/n) `)
  readline.close()
  return answer.trim().toLowerCase() === 'y'
}

function zipFolderContents(folder, zipPath) {
  const entries = readdirSync(folder)
  if (process.platform === 'win32') {
    // Windows' own tar, because Git Bash's GNU tar can come first in PATH and can't create zip files.
    const tar = join(process.env.SystemRoot ?? 'C:\\Windows', 'System32', 'tar.exe')
    execFileSync(tar, ['-a', '-c', '-f', zipPath, ...entries], { cwd: folder, stdio: 'inherit' })
  } else {
    execFileSync('zip', ['-r', '-q', zipPath, ...entries], { cwd: folder, stdio: 'inherit' })
  }
}

async function main() {
  const chromeVersion = readVersion(CHROME_DIR)
  const vsCodeVersion = readVersion(VSCODE_DIR)
  if (chromeVersion !== vsCodeVersion) {
    throw new Error(`the versions differ: Chrome extension ${chromeVersion}, VS Code extension ${vsCodeVersion}. Set the same version in both package.json files.`)
  }
  const version = chromeVersion
  const releaseDir = join(RELEASES_DIR, version)

  if (existsSync(releaseDir) && !await confirm(`Release ${version} already exists. Overwrite it?`)) {
    console.log('Cancelled, nothing was changed.')
    return
  }

  run('npm install', CHROME_DIR)
  run('npm run build', CHROME_DIR)
  run('npm install', VSCODE_DIR)

  rmSync(releaseDir, { recursive: true, force: true })
  mkdirSync(releaseDir, { recursive: true })

  const chromeZip = join(releaseDir, `moodle-assignment-checking-helper-chrome-${version}.zip`)
  zipFolderContents(join(CHROME_DIR, 'dist'), chromeZip)

  const vsCodeVsix = join(releaseDir, `moodle-assignment-checking-helper-${version}.vsix`)
  run(`npm run package -- --out "${vsCodeVsix}"`, VSCODE_DIR)

  console.log(`\nRelease ${version} is ready:\n  ${chromeZip}\n  ${vsCodeVsix}`)
}

main().catch(err => {
  console.error(`\nRelease failed: ${err.message}`)
  process.exit(1)
})
