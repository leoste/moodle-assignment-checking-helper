import BaseController from './BaseController'
import { commonAnswerService } from '../service/CommonAnswerService'

export default class CommonAnswerController extends BaseController {
  static readonly #GET = 'common-answers/get'

  override init(): void {
    super.init()
    this.addMessageHandler(CommonAnswerController.#GET, async (content) => {
      return commonAnswerService.getAll(content.assignmentId as string)
    })
  }
}
