import StatusListWatcher from './StatusListWatcher'
import type StatusLineRenderer from '../../presentation/renderer/StatusLineRenderer'
import type { Status } from '../../business/types/Status'

// Shows the statuses in the status line that the presenter hands over. The panel gets a new status line on every
// page load, and it shows the current statuses at once.
class StatusLineWatcher extends StatusListWatcher {
  #statusLine: StatusLineRenderer | undefined

  setStatusLine(statusLine: StatusLineRenderer): void {
    this.#statusLine = statusLine
    this.show(this.getStatuses())
  }

  protected show(statuses: readonly Status[]): void {
    this.#statusLine?.show(statuses)
  }
}

export const statusLineWatcher = new StatusLineWatcher()
