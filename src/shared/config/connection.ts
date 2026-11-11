// Connection between the Chrome extension (client) and the VS Code extension (WebSocket server).

export const WEBSOCKET_HOST = '127.0.0.1'
export const WEBSOCKET_PORT = 54321
export const WEBSOCKET_URL = `ws://${WEBSOCKET_HOST}:${WEBSOCKET_PORT}`

// The Chrome extension's ID is fixed by the public `key` in manifest.config.ts: it's the same for every user and
// every version. It changes only if the key changes, and then this has to be updated, or VS Code refuses the extension.
export const CHROME_EXTENSION_ID = 'bhbkljcagkcajmgijfnmigphbldhidhm'
// Chrome sends it as the Origin of the extension's WebSocket, and web pages can't fake it.
export const CHROME_EXTENSION_ORIGIN = `chrome-extension://${CHROME_EXTENSION_ID}`
