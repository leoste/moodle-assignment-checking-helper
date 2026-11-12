import ChromeMessageController from '../../../shared/communication/controller/ChromeMessageController'
import { assignmentGraderPageListener } from '../../presentation/listener/AssignmentGraderPageListener'
import { PANEL_RELOAD } from '../../../shared/foundation/constants/messages'

class PanelController extends ChromeMessageController {
  protected override onInit(): undefined {
    // Not awaited: the popup gets its answer at once instead of waiting for the whole panel to load.
    this.addMessageHandler(PANEL_RELOAD, async () => {
      void assignmentGraderPageListener.loadPage()
    })
  }
}

export const panelController = new PanelController()
