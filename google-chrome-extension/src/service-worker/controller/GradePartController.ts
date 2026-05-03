import { gradePartService } from '../service/GradePartService'
import ChromeBaseController from './ChromeBaseController'
import { GRADE_PARTS_GET } from '../../shared/constants/messages'

class GradePartController extends ChromeBaseController {
  protected override async onInit(): Promise<void> {
    this.addMessageHandler(GRADE_PARTS_GET, async (content) => {
      return gradePartService.getAll(content.assignmentId as string)
    })
  }
}

export const gradePartController = new GradePartController()
