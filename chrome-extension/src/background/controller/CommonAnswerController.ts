import BaseController from './BaseController'
import serviceRegistry from '../service/service-registry'

export default class CommonAnswerController extends BaseController {
  static readonly #GET = 'common-answers/get'

  override init(): void {
    super.init()
    this.addMessageHandler(CommonAnswerController.#GET, async (content) => {
      return serviceRegistry.commonAnswerService.getAll(content.assignmentId as string)
    })
  }
}
