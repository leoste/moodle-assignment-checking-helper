import WebviewMessageClient from './WebviewMessageClient'
import { receptionWebviewMessageGenerator } from '../shared/generator/ReceptionWebviewMessageGenerator'

class ReceptionClient extends WebviewMessageClient {
  showReception(receiving: boolean): void {
    this.send(receptionWebviewMessageGenerator.getShowReceptionMessage(receiving))
  }
}

export const receptionClient = new ReceptionClient()
