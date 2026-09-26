import type { RESPONSE_STATUS_ERROR, RESPONSE_STATUS_OK, RESPONSE_STATUS_UNHANDLED } from '../constants/websocket'
import type { BasePayload } from './payload/BasePayload'

export type WebSocketResponseStatus =
  | typeof RESPONSE_STATUS_OK
  | typeof RESPONSE_STATUS_ERROR
  | typeof RESPONSE_STATUS_UNHANDLED

export interface WebSocketMessage<TPayload extends BasePayload = BasePayload> {
  id: string
  channel: string
  content: TPayload
}

export interface WebSocketResponse {
  id: string
  content: WebSocketResponseStatus
}
