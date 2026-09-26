import ChromeMessageGenerator from './ChromeMessageGenerator'
import { PAGE_INFO_POST_STUDENT_NAME } from '../constants/messages'
import type { ChromeMessage } from '../types/ChromeMessage'
import type { StudentNamePayload } from '@shared/types/payload/StudentNamePayload'

class PageInfoChromeMessageGenerator extends ChromeMessageGenerator {
  getStudentNameMessage(studentName: string): ChromeMessage<StudentNamePayload> {
    return this.makeMessage(PAGE_INFO_POST_STUDENT_NAME, { studentName })
  }
}

export const pageInfoChromeMessageGenerator = new PageInfoChromeMessageGenerator()
