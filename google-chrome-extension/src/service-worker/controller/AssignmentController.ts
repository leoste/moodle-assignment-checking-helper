import ChromeMessageController from './ChromeMessageController'
import { assignmentService } from '../service/AssignmentService'
import { FEEDBACK_GET } from '../../shared/constants/messages'

class AssignmentController extends ChromeMessageController {
  protected override onInit(): undefined {
    this.addMessageHandler(FEEDBACK_GET, async ({ assignmentId }) => {
      return assignmentService.getFeedback(assignmentId)
    })
  }
}

export const assignmentController = new AssignmentController()
