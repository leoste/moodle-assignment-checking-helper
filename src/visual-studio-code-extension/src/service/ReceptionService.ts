import BaseService from '@shared/service/BaseService'
import { logger } from '@shared/reporting/logger'
import { statusReporter } from '@shared/reporting/statusReporter'
import { getPortInUseStatus, getTakeOverFailedStatus } from '@shared/rules/status-rules'
import { REQUEST_STATUS_UNREACHABLE, RESPONSE_STATUS_OK } from '@shared/constants/vscode-message'
import { WEBSOCKET_PORT } from '@shared/config/connection'
import { translations } from '@shared/translations/translations'
import { vsCodeMessageReceiver } from '../infrastructure/VsCodeMessageReceiver'
import { statusBarButtonProvider } from '../infrastructure/StatusBarButtonProvider'
import { handOverClient } from '../client/HandOverClient'
import { receptionClient } from '../client/ReceptionClient'
import { TAKE_OVER_COMMAND } from '../config'

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
    logger.info(this, `hand-over answered: ${status}`)
    // Unreachable: no window has the port any more, so this one can simply take it.
    if (status === RESPONSE_STATUS_OK || status === REQUEST_STATUS_UNREACHABLE) await this.#listenUntilPortFree()
    if (!this.#receiving) statusReporter.report(getTakeOverFailedStatus())
    this.#takingOver = false
  }

  // Runs in the receiving window when another window asks for the reception.
  handOver(): void {
    // The receiver sends the answer once the handler returns, and setImmediate runs only after that.
    setImmediate(() => {
      vsCodeMessageReceiver.stop()
      logger.info(this, 'handed the reception over to another window')
      statusReporter.report(getPortInUseStatus(WEBSOCKET_PORT))
      this.#setReceiving(false)
    })
  }

  async #listen(): Promise<void> {
    this.#setReceiving(await vsCodeMessageReceiver.listen())
  }

  async #listenUntilPortFree(): Promise<void> {
    for (let attempt = 1; attempt <= LISTEN_ATTEMPTS; attempt++) {
      if (await vsCodeMessageReceiver.listen()) {
        logger.info(this, 'took the reception over')
        this.#setReceiving(true)
        return
      }
      await new Promise(resolve => setTimeout(resolve, LISTEN_RETRY_DELAY_MS))
    }
  }

  #setReceiving(receiving: boolean): void {
    this.#receiving = receiving
    if (receiving) statusBarButtonProvider.hide()
    else statusBarButtonProvider.show(translations.connection.takeOver, TAKE_OVER_COMMAND)
    receptionClient.showReception(receiving)
  }
}

export const receptionService = new ReceptionService()
