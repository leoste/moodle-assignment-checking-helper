import type { StatusSink } from '@shared/reporting/StatusSink'
import type { Status } from '@shared/types/Status'
import { STATUS_PORT_NAME } from '../../shared/constants/messages'

// Sends the service worker's statuses to every open panel and popup. A port that connects gets the current statuses at once.
// Listens from construction on, because the connecting port may be the event that woke the service worker up.
export default class PortStatusSink implements StatusSink {
  readonly #ports = new Set<chrome.runtime.Port>()
  #statuses: readonly Status[] = []

  constructor() {
    chrome.runtime.onConnect.addListener(port => {
      if (port.name !== STATUS_PORT_NAME) return
      this.#ports.add(port)
      port.onDisconnect.addListener(() => this.#ports.delete(port))
      port.postMessage(this.#statuses)
    })
  }

  show(statuses: readonly Status[]): void {
    this.#statuses = statuses
    this.#ports.forEach(port => port.postMessage(statuses))
  }
}
