import type { Status } from '@shared/types/Status'
import { statusReporter } from '@shared/reporting/statusReporter'
import { getWaitingStatus } from '@shared/rules/status-rules'
import { STATUS_PORT_NAME } from '../constants/messages'

// Receives the service worker's statuses into this context's status reporter.
// When Chrome stops the idle service worker, its WebSocket to VS Code closes together with the port, so a closed port means the connection is waiting.
// The port is opened again only by the next connect(), otherwise it would keep waking the service worker up.
class PortStatusReceiver {
  #port: chrome.runtime.Port | undefined

  connect(): void {
    this.#port?.disconnect()
    const port = chrome.runtime.connect({ name: STATUS_PORT_NAME })
    port.onMessage.addListener((statuses: Status[]) => statuses.forEach(status => statusReporter.report(status)))
    port.onDisconnect.addListener(() => {
      if (this.#port === port) this.#port = undefined
      statusReporter.report(getWaitingStatus())
    })
    this.#port = port
  }

  // A port's own disconnect() doesn't fire its onDisconnect, so no waiting status is reported.
  disconnect(): void {
    this.#port?.disconnect()
    this.#port = undefined
  }
}

export const portStatusReceiver = new PortStatusReceiver()
