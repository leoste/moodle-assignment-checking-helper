# Moodle Assignment Checking Helper

TODO: the main readme needs to document project structure: what are services, repositories, controllers, clients etc.
what is the structure and talking between different services. maybe even add docs folder to add schemes and images.

The Moodle ASsignment Checking Helper consists of two extensions that interact to significantly speed up assignment checking in Moodle.
Automatically open necessary files in VSCode, run custom scripts, easily compose typical grades and responses.

## Future concerns

Known issues that are consciously left unsolved for now.

### WebSocket origin check

The VS Code extension's WebSocket server (`VsCodeWebSocketController`, `ws://127.0.0.1:54321`) accepts connections from anywhere. Browsers allow any web page to open a WebSocket to localhost, so any page could connect and send a `page-info` message, which closes all editors and terminals in VS Code and opens files. The server should check that the connection's `Origin` header is `chrome-extension://<extension id>`.

### Opening sub-directories is a compile-time setting

`OPEN_SUB_DIRECTORIES` in the VS Code extension's `config.ts` is a compile-time constant. When `true` (current value), files are collected recursively from the student's folder (except blacklisted folders like `.idea` and `.venv`); when `false`, only the top-level files are opened. Since the value is hard-coded, the `false` branch never runs and changing the behaviour requires rebuilding the extension. It could become a VS Code setting (`contributes.configuration` + `vscode.workspace.getConfiguration()`), and the same applies to `MAX_AUTO_OPENED_FILES` and `BLACKLISTED_FOLDER_NAMES`.
