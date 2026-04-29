import serviceRegistry from './service-registry'

export default class PageInfoService {
  static readonly #CHANNEL = 'page-info'

  async postStudentName(studentName: string): Promise<unknown> {
    return serviceRegistry.webSocketService.post(PageInfoService.#CHANNEL, studentName)
  }
}
