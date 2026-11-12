// The function VS Code gives a webview's page for talking to the extension. It can be called only once per page.
// Technically this is foundation, not business, as it declares existing platform relations instead of new business
// objects, but to keep things simple it's placed with other types inside business.
declare function acquireVsCodeApi(): {
  postMessage(message: unknown): void
}
