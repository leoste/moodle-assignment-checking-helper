import type { StatusSink } from '@shared/reporting/StatusSink'
import type { Status } from '@shared/types/Status'
import { statusClient } from '../client/StatusClient'

export default class SidebarStatusSink implements StatusSink {
  show(statuses: readonly Status[]): void {
    statusClient.showStatuses(statuses)
  }
}
