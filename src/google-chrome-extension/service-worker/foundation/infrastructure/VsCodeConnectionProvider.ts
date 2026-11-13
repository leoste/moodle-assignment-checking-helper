import BaseInfrastructure from '@shared/foundation/infrastructure/BaseInfrastructure'
import WebSocketConnection from '../object/WebSocketConnection'
import VsCodeRequestTracker from '@shared/foundation/object/VsCodeRequestTracker'
import type { VsCodeMessage, VsCodeRequestStatus } from '@shared/business/types/VsCodeMessage'
import { connectionAnnouncer } from '@shared/communication/announcer/ConnectionAnnouncer'
import { getConnectedStatus, getDisconnectedStatus, getReconnectingStatus, getWaitingStatus } from '@shared/business/rules/status-rules'

class VsCodeConnectionProvider extends BaseInfrastructure {
  readonly #connection = new WebSocketConnection()
  readonly #requests = new VsCodeRequestTracker()

  constructor() {
    super()
    this.#connection.onConnecting = () => connectionAnnouncer.announceStatus(getReconnectingStatus())
    this.#connection.onConnect = () => connectionAnnouncer.announceStatus(getConnectedStatus())
    this.#connection.onMessage = (raw) => this.#requests.handleMessage(raw)
    this.#connection.onDisconnect = (wasConnected) => {
      connectionAnnouncer.announceStatus(wasConnected ? getWaitingStatus() : getDisconnectedStatus())
      this.#requests.cancelAll()
    }
  }

  protected override onInit(): undefined {
    connectionAnnouncer.announceStatus(getWaitingStatus())
  }

  post(message: VsCodeMessage): Promise<VsCodeRequestStatus> {
    return this.#requests.post(message, (rawString) => this.#connection.send(rawString))
  }
}

export const vsCodeConnectionProvider = new VsCodeConnectionProvider()
