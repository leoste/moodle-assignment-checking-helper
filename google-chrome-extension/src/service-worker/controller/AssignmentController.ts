import ChromeBaseController from './ChromeBaseController'
import { assignmentService } from '../service/AssignmentService'
import { FEEDBACK_GET } from '../../shared/constants/messages'

class AssignmentController extends ChromeBaseController {
  protected override async onInit(): Promise<void> {
    this.addMessageHandler(FEEDBACK_GET, async (content) => {
      return assignmentService.getFeedback(content.assignmentId as string)
    })
  }
}

export const assignmentController = new AssignmentController()
