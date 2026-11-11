import type { Status } from '../types/Status'

export interface StatusSink {
  show(statuses: readonly Status[]): void
}
