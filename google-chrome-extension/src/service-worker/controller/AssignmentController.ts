import ChromeBaseController from './ChromeBaseController'
import { assignmentService } from '../service/AssignmentService'
import { COMMON_ANSWERS_GET, GRADE_PARTS_GET } from '../../shared/constants/messages'

class AssignmentController extends ChromeBaseController {
  protected override async onInit(): Promise<void> {
    
    this.addMessageHandler(COMMON_ANSWERS_GET, async (content) => {
      return assignmentService.getCommonAnswers(content.assignmentId as string)
    })

    this.addMessageHandler(GRADE_PARTS_GET, async (content) => {
      return assignmentService.getGradeParts(content.assignmentId as string)
    })
  }
}

export const assignmentController = new AssignmentController()
