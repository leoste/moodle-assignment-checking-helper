import WebviewMessageClient from './WebviewMessageClient'
import { receptionWebviewMessageGenerator } from '../../../shared/communication/generator/ReceptionWebviewMessageGenerator'

class ReceptionClient extends WebviewMessageClient {
  async takeOver(): Promise<void> {
    await this.send(receptionWebviewMessageGenerator.getTakeOverMessage())
  }
}

export const receptionClient = new ReceptionClient()
