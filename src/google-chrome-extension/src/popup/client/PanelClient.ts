import ChromeMessageClient from '../../shared/client/ChromeMessageClient'
import { panelChromeMessageGenerator } from '../../shared/generator/PanelChromeMessageGenerator'

class PanelClient extends ChromeMessageClient {
  // False when the active tab has no panel's content script to reload it.
  async reloadPanel(): Promise<boolean> {
    return this.sendToActiveTab(panelChromeMessageGenerator.getReloadPanelMessage())
  }
}

export const panelClient = new PanelClient()
