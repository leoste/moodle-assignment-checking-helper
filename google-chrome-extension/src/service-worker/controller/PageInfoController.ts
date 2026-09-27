import { pageInfoService } from '../service/PageInfoService'
import ChromeMessageController from './ChromeMessageController'
import { PAGE_INFO_POST_STUDENT_NAME } from '../../shared/constants/messages'
import type { StudentNamePayload } from '@shared/types/payload/StudentNamePayload'

class PageInfoController extends ChromeMessageController {
  protected override onInit(): undefined {
    this.addMessageHandler<StudentNamePayload>(PAGE_INFO_POST_STUDENT_NAME, async ({ studentName }) => {
      return pageInfoService.postStudentName(studentName)
    })
  }
}

export const pageInfoController = new PageInfoController()
