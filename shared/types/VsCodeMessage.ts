import type {
  REQUEST_STATUS_NO_ANSWER,
  REQUEST_STATUS_UNREACHABLE,
  RESPONSE_STATUS_ERROR,
  RESPONSE_STATUS_NO_WORKSPACE,
  RESPONSE_STATUS_NOT_FOUND,
  RESPONSE_STATUS_NOTHING_OPENED,
  RESPONSE_STATUS_OK,
  RESPONSE_STATUS_UNHANDLED,
} from '../constants/vscode-message'
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
  | typeof RESPONSE_STATUS_NOT_FOUND
  | typeof RESPONSE_STATUS_NO_WORKSPACE
  | typeof RESPONSE_STATUS_NOTHING_OPENED

export type VsCodeRequestStatus =
  | VsCodeResponseStatus
  | typeof REQUEST_STATUS_UNREACHABLE
  | typeof REQUEST_STATUS_NO_ANSWER

export interface VsCodeResponse {
  id: string
  content: VsCodeResponseStatus
}
