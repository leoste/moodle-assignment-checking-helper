export interface WebSocketMessage {
  id: string
  channel: string
  content: unknown
}

export interface WebSocketResponse {
  id: string
  content: unknown
}
