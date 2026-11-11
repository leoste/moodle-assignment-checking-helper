import WebviewMessageClient from './WebviewMessageClient'
import { statusWebviewMessageGenerator } from '../shared/generator/StatusWebviewMessageGenerator'
import type { Status } from '@shared/types/Status'

class StatusClient extends WebviewMessageClient {
  showStatuses(statuses: readonly Status[]): void {
    this.send(statusWebviewMessageGenerator.getShowStatusesMessage(statuses))
  }
}

export const statusClient = new StatusClient()
