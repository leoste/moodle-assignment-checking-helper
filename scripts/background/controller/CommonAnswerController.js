import serviceRegistry from "../service/service-registry.js";
import BaseController from "./BaseController.js";

export default class CommonAnswerController extends BaseController {

  static #getCommonAnswersMessageType = "common-answers/get"
  static #mockData = [
    {
      "text":"Well done",
      "enabled":false
    },
    {
      "text":"No additional comments",
      "enabled":false
    },
    {
      "text":"Superb",
      "enabled":true
    }
  ]

  init() {
    super.init()
    this.addMessageHandler(
      CommonAnswerController.#getCommonAnswersMessageType,
      this.#getCommonAnswersHandler)
  }

  #getCommonAnswersHandler = async (content) => {
    //const response = await serviceRegistry.commonAnsweService.getCommonAnswers()
    const response = CommonAnswerController.#mockData
    return response
  }
}