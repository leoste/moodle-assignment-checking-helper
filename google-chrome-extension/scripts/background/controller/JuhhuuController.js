import serviceRegistry from "../service/service-registry.js";
import BaseController from "./BaseController.js";

export default class JuhhuuController extends BaseController {

  static #messageType = "test"

  init() {
    super.init()
    this.addMessageHandler(JuhhuuController.#messageType, this.#messageHandler)
  }

  #messageHandler = async (content) => {
    await serviceRegistry.juhhuuService.setTest(content.text)
    const response = await serviceRegistry.juhhuuService.getTest()
    return response
  }
}