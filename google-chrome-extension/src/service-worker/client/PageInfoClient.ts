import type { VsCodeResponseStatus } from '@shared/types/VsCodeMessage'
import VsCodeMessageClient from './VsCodeMessageClient'
import { pageInfoVsCodeMessageGenerator } from '../generator/PageInfoVsCodeMessageGenerator'

class PageInfoClient extends VsCodeMessageClient {
  async postStudentName(studentName: string): Promise<VsCodeResponseStatus> {
    return this.send(pageInfoVsCodeMessageGenerator.getStudentNameMessage(studentName))
  }
}

export const pageInfoClient = new PageInfoClient()
