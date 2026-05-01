import { pageInfoService } from '../service/PageInfoService'
import BaseController from './BaseController'
import { PAGE_INFO_POST_STUDENT_NAME } from '../../shared/constants/messages'

class PageInfoController extends BaseController {
  override init(): void {
    super.init()
    this.addMessageHandler(PAGE_INFO_POST_STUDENT_NAME, async (content) => {
      return pageInfoService.postStudentName(content.studentName as string)
    })
  }
}

export const pageInfoController = new PageInfoController()
