import WebviewMessageClient from './WebviewMessageClient'
import { receptionWebviewMessageGenerator } from '../../shared/generator/ReceptionWebviewMessageGenerator'

class ReceptionClient extends WebviewMessageClient {
  takeOver(): void {
    this.send(receptionWebviewMessageGenerator.getTakeOverMessage())
  }
}

export const receptionClient = new ReceptionClient()
