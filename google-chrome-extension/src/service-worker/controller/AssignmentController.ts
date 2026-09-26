import ChromeMessageController from './ChromeMessageController'
import { assignmentService } from '../service/AssignmentService'
import { FEEDBACK_GET } from '../../shared/constants/messages'
import type { AssignmentIdPayload } from '../../shared/types/payload/AssignmentIdPayload'

class AssignmentController extends ChromeMessageController {
  protected override async onInit(): Promise<void> {
    this.addMessageHandler<AssignmentIdPayload>(FEEDBACK_GET, async ({ assignmentId }) => {
      return assignmentService.getFeedback(assignmentId)
    })
  }
}

export const assignmentController = new AssignmentController()
