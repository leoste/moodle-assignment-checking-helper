# Google Chrome Extension

The Google Chrome Extension is the main extension and can operate as a stand-alone to speed up the process of providing feedback to assignments. It renders a control panel to the right of the submission being viewed, where using simple buttons, the grade and feedback comment can automatically be constructed and filled in to Moodle.

It can be paired with the Visual Studio Code extension to automatically open the assignment files as well.

## 1. Prerequisites

- Node.js 18 or later
- npm 9 or later

## 2. Local Dev

This section is AI-generated.

**1. Install dependencies**

```bash
cd src/google-chrome-extension
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
4. Select the `src/google-chrome-extension/dist/` folder

The extension is now active. After code changes, reload the extension in `chrome://extensions` (click the reload icon on the card) to apply changes.

**4. Production build**

```bash
npm run build
```

Builds the extension into `dist/` once, without watching. Builds are not minified: the log shows the real class names and the code stays debuggable in the browser. Releases are built with `build-release.mjs` in the project root (see "Building release" in [src/README.md](../README.md)).

## 3. Release

See main `/src/README.md`: [`src/README.md`](/src/README.md)