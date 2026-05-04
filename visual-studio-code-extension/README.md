# Visual Studio Code Extension

The Visual Studio Code Extension runs as a companion to the Google Chrome Extension. It receives messages from the Chrome Extension about which student is being graded and automatically opens files related to this student.

The files must already be downloaded from Moodle all at once into separate folders and this folder must be already opened in Visual Studio Code.

Also adds a right-click menu shortcut to run python files in terminal.

## Setup

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
