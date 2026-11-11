import ChromeMessageController from '../../shared/controller/ChromeMessageController'
import { assignmentGraderListener } from '../pagelistener/AssignmentGraderListener'
import { ASSIGNMENTS_UPDATED } from '../../shared/constants/messages'

// In the content script, messages are passed on to the page listener, which holds the current page's presenter.
class AssignmentController extends ChromeMessageController {
  protected override onInit(): undefined {
    this.addMessageHandler(ASSIGNMENTS_UPDATED, async () => {
      await assignmentGraderListener.refreshDefinition()
    })
  }
}

export const assignmentController = new AssignmentController()
