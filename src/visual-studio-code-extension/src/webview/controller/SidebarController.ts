import WebviewMessageController from './WebviewMessageController'
import { sidebarPresenter } from '../presenter/SidebarPresenter'
import { SETTINGS_SHOW, STATUSES_SHOW } from '../../shared/constants/webview-messages'

// In the sidebar's page, messages are passed on to its presenter.
class SidebarController extends WebviewMessageController {
  protected override onInit(): undefined {
    this.addMessageHandler(SETTINGS_SHOW, async ({ settings }) => {
      sidebarPresenter.showSettings(settings)
    })

    this.addMessageHandler(STATUSES_SHOW, async ({ statuses }) => {
      sidebarPresenter.showStatuses(statuses)
    })
  }
}

export const sidebarController = new SidebarController()
