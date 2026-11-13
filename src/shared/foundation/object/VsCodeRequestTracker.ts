import BaseRequestTracker from './BaseRequestTracker'
import type { VsCodeMessage, VsCodeRequestStatus, VsCodeResponse } from '../../business/types/VsCodeMessage'
import { REQUEST_STATUS_NO_ANSWER, REQUEST_STATUS_UNREACHABLE } from '../constants/vscode-message'
import { logAnnouncer } from '../../communication/announcer/LogAnnouncer'

// Pairs the requests sent over a WebSocket with their answers. Used by the Chrome extension, and by a VS Code window
// asking the receiving window to hand the reception over.
export default class VsCodeRequestTracker extends BaseRequestTracker<VsCodeMessage, VsCodeRequestStatus> {
  // `send` puts the request on the WebSocket and rejects if it can't.
  post(message: VsCodeMessage, send: (rawString: string) => Promise<void>): Promise<VsCodeRequestStatus> {
    return this.track(message, request => send(JSON.stringify(request)))
  }

  handleMessage(raw: string): void {
    let parsed: VsCodeResponse
    try {
      parsed = JSON.parse(raw) as VsCodeResponse
    } catch {
      logAnnouncer.announceLogError(this, 'failed to parse incoming message', raw)
      return
    }
    this.complete(parsed.id, parsed.content)
  }

  protected getKey(message: VsCodeMessage): string {
    return message.channel
  }

  protected getNoAnswer(): VsCodeRequestStatus {
    return REQUEST_STATUS_NO_ANSWER
  }

  protected getUnreachableAnswer(): VsCodeRequestStatus {
    return REQUEST_STATUS_UNREACHABLE
  }
}
