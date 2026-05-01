import { gradePartService } from '../service/GradePartService'
import BaseController from './BaseController'
import { GRADE_PARTS_GET } from '../../shared/constants/messages'

class GradePartController extends BaseController {
  override init(): void {
    super.init()
    this.addMessageHandler(GRADE_PARTS_GET, async (content) => {
      return gradePartService.getAll(content.assignmentId as string)
    })
  }
}

export const gradePartController = new GradePartController()
