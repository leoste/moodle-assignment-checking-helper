import WebviewMessageClient from './WebviewMessageClient'
import { statusWebviewMessageGenerator } from '../shared/generator/StatusWebviewMessageGenerator'
import type { Status } from '@shared/types/Status'

class StatusClient extends WebviewMessageClient {
  async showStatuses(statuses: readonly Status[]): Promise<void> {
    await this.send(statusWebviewMessageGenerator.getShowStatusesMessage(statuses))
  }
}

export const statusClient = new StatusClient()
