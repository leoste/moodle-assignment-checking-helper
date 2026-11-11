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

Open the repository root in VS Code. You will be prompted to install the recommended extensions from `.vscode/extensions.json`. Accept — **connor4312.esbuild-problem-matchers** is needed by the build task to detect when the build has finished.

**2. Install dependencies**

```bash
cd src/visual-studio-code-extension
npm install
```

**3. Compile and run**

With the repository root open, select **Run VS Code Extension** in the Run and Debug view and press **F5**. This runs the task `vscode-extension: watch` (`npm run watch` in this folder), which calls `node esbuild.js --watch` and keeps rebuilding on save. Then it opens a new VS Code **Extension Development Host** window with the extension active.

When it starts correctly, the Output panel channel "Moodle Assignment Checking Helper" of the Extension Development Host window shows the line `activated`.

**4. Production build**

```bash
npm run vscode:prepublish
```

Builds `dist/extension.js` without source maps. Builds are not minified (see "Logging" in the root README). Releases, including the `.vsix` package, are built with `build-release.mjs` in the project root (see "Releasing" in the root README).
