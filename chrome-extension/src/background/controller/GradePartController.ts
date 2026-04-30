import { gradePartService } from '../service/GradePartService'
import BaseController from './BaseController'

export default class GradePartController extends BaseController {
  static readonly #GET = 'assignment/grade-parts/get'

  override init(): void {
    super.init()
    this.addMessageHandler(GradePartController.#GET, async (content) => {
      return gradePartService.getAll(content.assignmentId as string)
    })
  }
}
