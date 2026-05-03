import BaseService from '@shared/service/BaseService'
import { webSocketService } from './WebSocketService'

class PageInfoService extends BaseService {
  static readonly #CHANNEL = 'page-info'

  async postStudentName(studentName: string): Promise<unknown> {
    return webSocketService.post(PageInfoService.#CHANNEL, studentName)
  }
}

export const pageInfoService = new PageInfoService()
