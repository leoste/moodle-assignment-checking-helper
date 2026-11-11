import WebviewMessageClient from './WebviewMessageClient'
import { sidebarWebviewMessageGenerator } from '../../shared/generator/SidebarWebviewMessageGenerator'

class SidebarClient extends WebviewMessageClient {
  // The extension answers by sending the current settings and statuses.
  notifyReady(): void {
    this.send(sidebarWebviewMessageGenerator.getReadyMessage())
  }
}

export const sidebarClient = new SidebarClient()
