import { RECEPTION_HAND_OVER_CHANNEL } from '@shared/constants/vscode-message'
import { receptionService } from '../service/ReceptionService'
import VsCodeMessageController from './VsCodeMessageController'

// Another VS Code window asks this one for the reception.
class ReceptionMessageController extends VsCodeMessageController {
  protected override onInit(): undefined {
    this.addMessageHandler(RECEPTION_HAND_OVER_CHANNEL, async () => {
      receptionService.handOver()
    })
  }
}

export const receptionMessageController = new ReceptionMessageController()
