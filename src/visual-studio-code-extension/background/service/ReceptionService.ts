import BaseService from '@shared/service/BaseService'
import { logAnnouncer } from '@shared/communication/announcer/LogAnnouncer'
import { connectionAnnouncer } from '@shared/communication/announcer/ConnectionAnnouncer'
import { receptionAnnouncer } from '@shared/communication/announcer/ReceptionAnnouncer'
import { getPortInUseStatus, getTakeOverFailedStatus } from '@shared/business/rules/status-rules'
import { REQUEST_STATUS_UNREACHABLE, RESPONSE_STATUS_OK } from '@shared/foundation/constants/vscode-message'
import { WEBSOCKET_PORT } from '@shared/business/config/connection'
import { vsCodeMessageReceiver } from '../foundation/infrastructure/VsCodeMessageReceiver'
import { handOverClient } from '../communication/client/HandOverClient'

// How long a window taking the reception over keeps trying to start its server while the other window frees the port.
const LISTEN_ATTEMPTS = 25
const LISTEN_RETRY_DELAY_MS = 200

// Only the window whose server has the port receives the students. Another window can take the reception over:
// the receiving window hands it over and shows the take-over button itself.
class ReceptionService extends BaseService {
  #receiving = false
  #takingOver = false

  protected override onInit(): undefined {
    void this.#listen()
  }

  async takeOver(): Promise<void> {
    if (this.#receiving || this.#takingOver) return
    this.#takingOver = true
    const status = await handOverClient.requestHandOver()
    logAnnouncer.announceLog(this, `hand-over answered: ${status}`)
    // Unreachable: no window has the port any more, so this one can simply take it.
    if (status === RESPONSE_STATUS_OK || status === REQUEST_STATUS_UNREACHABLE) await this.#listenUntilPortFree()
    if (!this.#receiving) connectionAnnouncer.announceStatus(getTakeOverFailedStatus())
    this.#takingOver = false
  }

  // Runs in the receiving window when another window asks for the reception.
  handOver(): void {
    // The receiver sends the answer once the handler returns, and setImmediate runs only after that.
    setImmediate(() => {
      vsCodeMessageReceiver.stop()
      logAnnouncer.announceLog(this, 'handed the reception over to another window')
      connectionAnnouncer.announceStatus(getPortInUseStatus(WEBSOCKET_PORT))
      this.#setReceiving(false)
    })
  }

  async #listen(): Promise<void> {
    this.#setReceiving(await vsCodeMessageReceiver.listen())
  }

  async #listenUntilPortFree(): Promise<void> {
    for (let attempt = 1; attempt <= LISTEN_ATTEMPTS; attempt++) {
      if (await vsCodeMessageReceiver.listen()) {
        logAnnouncer.announceLog(this, 'took the reception over')
        this.#setReceiving(true)
        return
      }
      await new Promise(resolve => setTimeout(resolve, LISTEN_RETRY_DELAY_MS))
    }
  }

  #setReceiving(receiving: boolean): void {
    this.#receiving = receiving
    receptionAnnouncer.announceReception(receiving)
  }
}

export const receptionService = new ReceptionService()
