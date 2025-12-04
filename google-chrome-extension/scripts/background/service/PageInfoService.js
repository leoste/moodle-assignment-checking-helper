import serviceRegistry from "./service-registry.js"

export default class PageInfoService {

  static #webSocketChannelName = "page-info"
  
  async postStudentName(studentName) {
    const response = await serviceRegistry.webSocketService.post(PageInfoService.#webSocketChannelName, studentName)
    return response
  }
}