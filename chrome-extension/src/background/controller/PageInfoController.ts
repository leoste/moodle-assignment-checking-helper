import { pageInfoService } from '../service/PageInfoService'
import BaseController from './BaseController'

export default class PageInfoController extends BaseController {
  static readonly #POST_STUDENT_NAME = 'page-info/student-name/post'

  override init(): void {
    super.init()
    this.addMessageHandler(PageInfoController.#POST_STUDENT_NAME, async (content) => {
      return pageInfoService.postStudentName(content.studentName as string)
    })
  }
}
