import WebviewMessageController from './WebviewMessageController'
import { sidebarListener } from '../pagelistener/SidebarListener'
import { SETTINGS_SHOW, STATUSES_SHOW } from '../../shared/constants/webview-messages'

// In the sidebar's page, messages are passed on to the page listener, which holds the page's presenter.
class SidebarController extends WebviewMessageController {
  protected override onInit(): undefined {
    this.addMessageHandler(SETTINGS_SHOW, async ({ settings }) => {
      sidebarListener.showSettings(settings)
    })

    this.addMessageHandler(STATUSES_SHOW, async ({ statuses }) => {
      sidebarListener.showStatuses(statuses)
    })
  }
}

export const sidebarController = new SidebarController()
