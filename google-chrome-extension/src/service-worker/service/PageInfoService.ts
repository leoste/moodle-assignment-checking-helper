import BaseService from '@shared/service/BaseService'
import type { VsCodeResponseStatus } from '@shared/types/VsCodeMessage'
import { pageInfoClient } from '../client/PageInfoClient'

class PageInfoService extends BaseService {
  async postStudentName(studentName: string): Promise<VsCodeResponseStatus> {
    return pageInfoClient.postStudentName(studentName)
  }
}

export const pageInfoService = new PageInfoService()
