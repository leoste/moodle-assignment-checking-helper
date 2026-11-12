import ChromeMessageController from '../../../shared/communication/controller/ChromeMessageController'
import { assignmentGraderPageListener } from '../../presentation/listener/AssignmentGraderPageListener'
import { ASSIGNMENTS_UPDATED } from '../../../shared/foundation/constants/messages'

// In the content script, messages are passed on to the page listener, which holds the current page's presenter.
class AssignmentController extends ChromeMessageController {
  protected override onInit(): undefined {
    this.addMessageHandler(ASSIGNMENTS_UPDATED, async () => {
      await assignmentGraderPageListener.refreshDefinition()
    })
  }
}

export const assignmentController = new AssignmentController()
