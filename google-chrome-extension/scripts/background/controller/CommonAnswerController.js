import serviceRegistry from "../service/service-registry.js";
import BaseController from "./BaseController.js";

export default class CommonAnswerController extends BaseController {

  static #getCommonAnswersMessageType = "common-answers/get"

  init() {
    super.init()
    this.addMessageHandler(
      CommonAnswerController.#getCommonAnswersMessageType,
      this.#getCommonAnswersHandler)
  }

  #getCommonAnswersHandler = async (content) => {
    const response = await serviceRegistry.commonAnswerService.getAll(content.assignmentId)
    return response
  }
}