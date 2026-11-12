import WebviewMessageController from './WebviewMessageController'
import { receptionService } from '../service/ReceptionService'
import { RECEPTION_TAKE_OVER } from '../shared/constants/webview-messages'

// The sidebar's button.
class ReceptionWebviewController extends WebviewMessageController {
  protected override onInit(): undefined {
    // Not awaited: taking over can take longer than the sidebar waits for its answer.
    this.addMessageHandler(RECEPTION_TAKE_OVER, async () => {
      void receptionService.takeOver()
    })
  }
}

export const receptionWebviewController = new ReceptionWebviewController()
