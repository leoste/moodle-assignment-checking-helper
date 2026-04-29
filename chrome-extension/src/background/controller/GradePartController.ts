import BaseController from './BaseController'
import serviceRegistry from '../service/service-registry'

export default class GradePartController extends BaseController {
  static readonly #GET = 'assignment/grade-parts/get'

  override init(): void {
    super.init()
    this.addMessageHandler(GradePartController.#GET, async (content) => {
      return serviceRegistry.gradePartService.getAll(content.assignmentId as string)
    })
  }
}
