import WebviewMessageClient from './WebviewMessageClient'
import { sidebarWebviewMessageGenerator } from '../../shared/generator/SidebarWebviewMessageGenerator'

class SidebarClient extends WebviewMessageClient {
  // The extension answers by sending the current settings and statuses.
  async notifyReady(): Promise<void> {
    await this.send(sidebarWebviewMessageGenerator.getReadyMessage())
  }
}

export const sidebarClient = new SidebarClient()
