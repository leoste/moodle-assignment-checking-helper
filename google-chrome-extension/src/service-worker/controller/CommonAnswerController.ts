import ChromeBaseController from './ChromeBaseController'
import { commonAnswerService } from '../service/CommonAnswerService'
import { COMMON_ANSWERS_GET } from '../../shared/constants/messages'

class CommonAnswerController extends ChromeBaseController {
  protected override async onInit(): Promise<void> {
    this.addMessageHandler(COMMON_ANSWERS_GET, async (content) => {
      return commonAnswerService.getAll(content.assignmentId as string)
    })
  }
}

export const commonAnswerController = new CommonAnswerController()
