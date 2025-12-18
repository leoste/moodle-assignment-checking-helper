import serviceRegistry from "../service/service-registry.js";
import BaseController from "./BaseController.js";

export default class GradePartController extends BaseController {

  static #getGradePartsMessageType = "grade-parts/get"

  init() {
    super.init()
    this.addMessageHandler(
      GradePartController.#getGradePartsMessageType,
      this.#getGradePartsHandler)
  }

  #getGradePartsHandler = async (content) => {
    const response = await serviceRegistry.gradePartService.getAll(content.assignmentId)
    return response
  }
}