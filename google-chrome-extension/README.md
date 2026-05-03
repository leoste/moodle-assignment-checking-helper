# Google Chrome Extension

The Google Chrome Extension is the main extension and can operate as a stand-alone to speed up the process of providing feedback to assignments. It renders a control panel to the right of the submission being viewed, where using simple buttons, the grade and feedback comment can automatically be constructed and filled in to Moodle.

It can be paired with the Visual Studio Code extension to automatically open the assignment files as well.

## Setup

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
