import WebviewMessageGenerator from './WebviewMessageGenerator'
import { STATUSES_SHOW } from '../constants/webview-messages'
import type { WebviewMessage } from '../types/WebviewMessage'
import type { StatusesPayload } from '../types/payload/StatusesPayload'
import type { Status } from '@shared/types/Status'

class StatusWebviewMessageGenerator extends WebviewMessageGenerator {
  getShowStatusesMessage(statuses: readonly Status[]): WebviewMessage<StatusesPayload> {
    return this.makeMessage(STATUSES_SHOW, { statuses: [...statuses] })
  }
}

export const statusWebviewMessageGenerator = new StatusWebviewMessageGenerator()
