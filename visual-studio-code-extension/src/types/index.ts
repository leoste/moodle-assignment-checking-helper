import type { WebSocket } from 'ws'
import type { WebSocketMessage } from '@shared/types/WebSocketProtocol'

export type ChannelHandler = (data: WebSocketMessage, ws: WebSocket) => Promise<void>
