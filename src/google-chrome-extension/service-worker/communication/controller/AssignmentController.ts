import ChromeMessageController from '../../../shared/communication/controller/ChromeMessageController'
import { assignmentService } from '../../service/AssignmentService'
import { ASSIGNMENTS_GET_ALL, FEEDBACK_GET } from '../../../shared/foundation/constants/messages'

class AssignmentController extends ChromeMessageController {
  protected override onInit(): undefined {
    this.addMessageHandler(ASSIGNMENTS_GET_ALL, async () =>
      assignmentService.getAllAssignments()
    )

    this.addMessageHandler(FEEDBACK_GET, async ({ assignmentId }) => {
      return assignmentService.lookUpDefinition(assignmentId)
    })
  }
}

export const assignmentController = new AssignmentController()
