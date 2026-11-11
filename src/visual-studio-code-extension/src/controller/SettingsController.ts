import WebviewMessageController from './WebviewMessageController'
import { settingsService } from '../service/SettingsService'
import { SETTINGS_CHANGE } from '../shared/constants/webview-messages'

class SettingsController extends WebviewMessageController {
  protected override onInit(): undefined {
    this.addMessageHandler(SETTINGS_CHANGE, async ({ settings }) => {
      await settingsService.updateSettings(settings)
    })
  }
}

export const settingsController = new SettingsController()
