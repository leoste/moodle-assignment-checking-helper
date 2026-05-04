import BaseService from '@shared/service/BaseService'
import { chromeVsCodeClient } from '../client/ChromeVsCodeClient'

class PageInfoService extends BaseService {
  static readonly #CHANNEL = 'page-info'

  async postStudentName(studentName: string): Promise<unknown> {
    return chromeVsCodeClient.postMessage(PageInfoService.#CHANNEL, studentName)
  }
}

export const pageInfoService = new PageInfoService()
