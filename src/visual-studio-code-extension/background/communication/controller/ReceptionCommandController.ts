import VsCodeCommandController from './VsCodeCommandController'
import { receptionService } from '../../service/ReceptionService'
import { TAKE_OVER_COMMAND } from '../../config'

// The status bar button.
class ReceptionCommandController extends VsCodeCommandController {
  protected override onInit(): undefined {
    this.addCommandHandler(TAKE_OVER_COMMAND, async () => {
      void receptionService.takeOver()
    })
  }
}

export const receptionCommandController = new ReceptionCommandController()
