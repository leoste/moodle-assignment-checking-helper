import type { RESPONSE_STATUS_ERROR, RESPONSE_STATUS_OK, RESPONSE_STATUS_UNHANDLED } from '../constants/vscode-message'
import type { BasePayload } from './payload/BasePayload'

export interface VsCodeMessage<TPayload extends BasePayload = BasePayload> {
  channel: string
  content: TPayload
}

// The id pairs a request with its response and is added when the message is sent.
export interface VsCodeRequest<TPayload extends BasePayload = BasePayload> extends VsCodeMessage<TPayload> {
  id: string
}

export type VsCodeResponseStatus =
  | typeof RESPONSE_STATUS_OK
  | typeof RESPONSE_STATUS_ERROR
  | typeof RESPONSE_STATUS_UNHANDLED

export interface VsCodeResponse {
  id: string
  content: VsCodeResponseStatus
}
