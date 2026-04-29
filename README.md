# Moodle Assignment Checking Helper

The helper consists of two extensions that interact to significantly speed up assignment checking in Moodle.
Automatically open necessary files in VSCode, run custom scripts, easily compose typical grades and responses.

- **`chrome-extension/`** — Vite + crxjs + TypeScript, injects UI into Moodle pages
- **`vscode-extension/`** — esbuild + TypeScript, receives signals from Chrome and opens student files

## Setup — Chrome Extension

### Prerequisites

- Node.js 18 or later
- npm 9 or later

### Steps

**1. Install dependencies**

```bash
cd chrome-extension
npm install
```

**2. Build for development (watch mode)**

```bash
npm run dev
```

Vite builds the extension into `dist/` and then watches for file changes, rebuilding instantly on every save. Leave this terminal running while you work.

**3. Load into Chrome**

1. Open Chrome and go to `chrome://extensions`
2. Enable **Developer mode** (toggle, top right)
3. Click **Load unpacked**
4. Select the `chrome-extension/dist/` folder

The extension is now active. After code changes, reload the extension in `chrome://extensions` (click the reload icon on the card) to apply changes.

**4. Production build**

```bash
npm run build
```

Outputs a minified, optimised extension to `dist/`.

## Setup — VS Code Extension

### Prerequisites

- Node.js 18 or later
- npm 9 or later
- VS Code

### Steps

**1. Install the recommended VS Code extension**

Open the `vscode-extension/` folder in VS Code. You will be prompted to install the recommended extensions from `.vscode/extensions.json`. Accept — **connor4312.esbuild-problem-matchers** is needed for build errors to appear inline in the Problems panel.

**2. Install dependencies**

```bash
cd vscode-extension
npm install
```

**3. Compile and run**

Press **F5** in VS Code (with the `vscode-extension/` folder open). This triggers the default build task (`npm run watch`), which calls `node esbuild.js --watch` and keeps rebuilding on save. Then it opens a new VS Code **Extension Development Host** window with your extension active.

You will see `Moodle Checking Helper: VS Code extension active.` in the Debug Console when it starts correctly.

**4. Production build**

```bash
npm run vscode:prepublish
```

Produces a minified `dist/extension.js` ready for packaging with `vsce`.

[UNCHECKED AI BABBLE BEYOND THIS POINT]

## How the two extensions communicate

```
Moodle page (Chrome)
  └── content script
        └── chrome.runtime.sendMessage()
              └── service worker (background)
                    └── WebSocketService.post()
                          └── ws://127.0.0.1:54321
                                └── VS Code extension (WebSocketServer)
                                      └── opens student files
```

The Chrome extension connects to `ws://127.0.0.1:54321` lazily on first use. If VS Code is not running, the send fails gracefully with a console warning — the grading UI still works, just without the file-opening feature.

---

## Project structure

```
chrome-extension/
  manifest.json              ← crxjs reads this as the build entry point
  vite.config.ts
  tsconfig.json
  package.json
  src/
    types/
      index.ts               ← shared TypeScript interfaces
    background/
      service-worker.ts      ← entry point for the service worker
      collection/
        MessageHandlerMap.ts
      controller/
        BaseController.ts    ← registers chrome.runtime.onMessage once
        CommonAnswerController.ts
        GradePartController.ts
        PageInfoController.ts
        QuizController.ts
        init-controllers.ts
      provider/
        WebSocketProvider.ts ← raw WebSocket connection management
      repository/
        LocalStorageRepository.ts
        CommonAnswerRepository.ts  ← TODO: move data to chrome.storage + options UI
        GradePartRepository.ts     ← TODO: move data to chrome.storage + options UI
        QuizRepository.ts
        repository-registry.ts
      service/
        WebSocketService.ts  ← request/response correlation over WebSocket
        CommonAnswerService.ts
        GradePartService.ts
        PageInfoService.ts
        QuizService.ts
        service-registry.ts
    content-scripts/
      assign-grader/
        index.ts             ← entry point, matches assign grader page
        assign-grader.css
        client/clients.ts
        component/CheckingHelperPanelRenderer.ts
        helper/
          element-helper.ts
          moodle-helper.ts
      quiz-review/
        index.ts             ← entry point, matches quiz review page
        quiz-review.css
        client/quiz-client.ts
        helper/moodle-helper.ts
      quiz-comment/
        index.ts             ← entry point, matches quiz comment page
        helper/moodle-helper.ts

vscode-extension/
  package.json
  tsconfig.json
  esbuild.js                 ← build script (not a config file)
  .vscodeignore
  .vscode/
    launch.json              ← F5 debug config
    tasks.json               ← default build task (npm watch)
    extensions.json          ← recommended extensions
  src/
    extension.ts             ← entire extension in one file (appropriate for this size)
  dist/                      ← generated, not committed
    extension.js
```

---

## Key design decisions

**Why crxjs for Chrome, esbuild for VS Code?**
crxjs understands `manifest.json` as a build graph — it finds all entry points automatically, handles web-accessible resources, and provides HMR for content scripts. The VS Code extension has none of these concerns; it's a single Node.js entry point, so esbuild's minimal config (`entryPoints`, `external: ['vscode']`, done) is exactly right.

**Why `"type": "module"` in the Chrome extension but not the VS Code extension?**
Chrome's service worker runs in an ES module context. VS Code extensions must be CommonJS — the extension host does not support ESM. esbuild handles the conversion (`format: 'cjs'`), so the source can still use `import`/`export`.

**Why are repositories still hard-coded?**
The data layer is intentionally a stub. The TODO comments in `CommonAnswerRepository.ts` and `GradePartRepository.ts` mark exactly where to add `chrome.storage` reads and an options page once you're ready.

**Why is the VS Code extension's entire logic in one file?**
At its current size, splitting it serves no purpose. When you add more channels (beyond `page-info`), extract each handler into its own file in `src/handlers/` and import them into `extension.ts`.
