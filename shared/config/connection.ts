// Connection between the Chrome extension (client) and the VS Code extension (WebSocket server).

export const WEBSOCKET_HOST = '127.0.0.1'
export const WEBSOCKET_PORT = 54321
export const WEBSOCKET_URL = `ws://${WEBSOCKET_HOST}:${WEBSOCKET_PORT}`
