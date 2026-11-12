import WebviewMessageClient from './WebviewMessageClient'
import { receptionWebviewMessageGenerator } from '../shared/generator/ReceptionWebviewMessageGenerator'

class ReceptionClient extends WebviewMessageClient {
  async showReception(receiving: boolean): Promise<void> {
    await this.send(receptionWebviewMessageGenerator.getShowReceptionMessage(receiving))
  }
}

export const receptionClient = new ReceptionClient()
