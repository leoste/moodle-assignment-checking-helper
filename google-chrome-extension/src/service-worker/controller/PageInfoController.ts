import { pageInfoService } from '../service/PageInfoService'
import ChromeBaseController from './ChromeBaseController'
import { PAGE_INFO_POST_STUDENT_NAME } from '../../shared/constants/messages'

class PageInfoController extends ChromeBaseController {
  protected override async onInit(): Promise<void> {
    this.addMessageHandler(PAGE_INFO_POST_STUDENT_NAME, async (content) => {
      return pageInfoService.postStudentName(content.studentName as string)
    })
  }
}

export const pageInfoController = new PageInfoController()
