// The function VS Code gives a webview's page for talking to the extension. It can be called only once per page.
declare function acquireVsCodeApi(): {
  postMessage(message: unknown): void
}
