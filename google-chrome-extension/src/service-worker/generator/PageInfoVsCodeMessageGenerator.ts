import VsCodeMessageGenerator from './VsCodeMessageGenerator'
import { PAGE_INFO_CHANNEL } from '@shared/constants/vscode-message'
import type { VsCodeMessage } from '@shared/types/VsCodeMessage'
import type { StudentNamePayload } from '@shared/types/payload/StudentNamePayload'

class PageInfoVsCodeMessageGenerator extends VsCodeMessageGenerator {
  getStudentNameMessage(studentName: string): VsCodeMessage<StudentNamePayload> {
    return this.makeMessage(PAGE_INFO_CHANNEL, { studentName })
  }
}

export const pageInfoVsCodeMessageGenerator = new PageInfoVsCodeMessageGenerator()
