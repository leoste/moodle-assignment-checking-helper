import serviceRegistry from "../service/service-registry.js";
import BaseController from "./BaseController.js";

export default class PageInfoController extends BaseController {

  static #postStudentNameMessageType = "page-info/student-name/post"

  init() {
    super.init()
    this.addMessageHandler(
      PageInfoController.#postStudentNameMessageType,
      this.#postStudentNameHandler)
  }

  #postStudentNameHandler = async (content) => {
    const response = await serviceRegistry.pageInfoService.postStudentName(content.studentName)
    return response
  }
}