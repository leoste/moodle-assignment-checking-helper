import BaseInfrastructure from '@shared/foundation/infrastructure/BaseInfrastructure'
import { WebSocket } from 'ws'
import VsCodeRequestTracker from '@shared/foundation/object/VsCodeRequestTracker'
import type { VsCodeMessage, VsCodeRequestStatus } from '@shared/business/types/VsCodeMessage'
import { WEBSOCKET_URL } from '@shared/business/config/connection'
import { announcer } from '@shared/communication/announcer/Announcer'

// Connects to the window that receives the students, as a client of its server.
// A connection is opened for one request and closed once it's answered.
class VsCodeWindowConnectionProvider extends BaseInfrastructure {
  async post(message: VsCodeMessage): Promise<VsCodeRequestStatus> {
    const socket = new WebSocket(WEBSOCKET_URL)
    const requests = new VsCodeRequestTracker()
    socket.on('message', (raw) => requests.handleMessage(raw.toString()))
    socket.on('close', () => requests.cancelAll())
    socket.on('error', (err) => announcer.announceLogError(this, 'connection to the receiving window failed', err))

    const status = await requests.post(message, (rawString) => this.#send(socket, rawString))
    socket.close()
    return status
  }

  #send(socket: WebSocket, rawString: string): Promise<void> {
    return new Promise((resolve, reject) => {
      socket.once('open', () => {
        socket.send(rawString)
        resolve()
      })
      socket.once('error', reject)
    })
  }
}

export const vsCodeWindowConnectionProvider = new VsCodeWindowConnectionProvider()
