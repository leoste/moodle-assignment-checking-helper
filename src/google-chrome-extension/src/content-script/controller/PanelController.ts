import ChromeMessageController from '../../shared/controller/ChromeMessageController'
import { assignmentGraderListener } from '../pagelistener/AssignmentGraderListener'
import { PANEL_RELOAD } from '../../shared/constants/messages'

class PanelController extends ChromeMessageController {
  protected override onInit(): undefined {
    // Not awaited: the popup gets its answer at once instead of waiting for the whole panel to load.
    this.addMessageHandler(PANEL_RELOAD, async () => {
      void assignmentGraderListener.loadPage()
    })
  }
}

export const panelController = new PanelController()
