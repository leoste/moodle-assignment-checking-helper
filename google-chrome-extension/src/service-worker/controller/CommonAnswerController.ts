import BaseController from './BaseController'
import { commonAnswerService } from '../service/CommonAnswerService'
import { COMMON_ANSWERS_GET } from '../../shared/constants/messages'

class CommonAnswerController extends BaseController {
  override init(): void {
    super.init()
    this.addMessageHandler(COMMON_ANSWERS_GET, async (content) => {
      return commonAnswerService.getAll(content.assignmentId as string)
    })
  }
}

export const commonAnswerController = new CommonAnswerController()
