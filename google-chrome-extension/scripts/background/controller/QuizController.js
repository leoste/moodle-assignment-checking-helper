import serviceRegistry from "../service/service-registry.js";
import BaseController from "./BaseController.js";

export default class QuizController extends BaseController {

  static #beginMessage = "quiz/auto-grade/begin"
  static #endMessage = "quiz/auto-grade/end"
  static #isActiveMessage = "quiz/auto-grade/is-active"

  init() {
    super.init()
    this.addMessageHandler(
      QuizController.#beginMessage,
      this.#beginHandler)

    this.addMessageHandler(
      QuizController.#endMessage,
      this.#endHandler)

    this.addMessageHandler(
      QuizController.#isActiveMessage,
      this.#isActiveHandler)
  }

  #beginHandler = async (content) => {
    await serviceRegistry.quizService.beginAutoGrade(content.autoGradeId)
  }

  #endHandler = async (content) => {
    await serviceRegistry.quizService.endAutoGrade(content.autoGradeId)
  }

  #isActiveHandler = async (content) => {
    return await serviceRegistry.quizService.isAutoGradeActive(content.autoGradeId)
  }
}