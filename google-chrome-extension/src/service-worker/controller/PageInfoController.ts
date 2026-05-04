import { pageInfoService } from '../service/PageInfoService'
import ChromeExtensionMessageController from './ChromeWebSocketController'
import { PAGE_INFO_POST_STUDENT_NAME } from '../../shared/constants/messages'

class PageInfoController extends ChromeExtensionMessageController {
  protected override async onInit(): Promise<void> {
    this.addMessageHandler(PAGE_INFO_POST_STUDENT_NAME, async (content) => {
      return pageInfoService.postStudentName(content.studentName as string)
    })
  }
}

export const pageInfoController = new PageInfoController()
