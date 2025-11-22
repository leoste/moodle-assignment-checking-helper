import juhhuuConstants from "../constants/juhhuuConstants.js";
import serviceRegistry from "../service/service-registry.js";
import BaseController from "./BaseController.js";

export default class JuhhuuController extends BaseController {

  init() {
    super.init()
    this.addMessageHandler(juhhuuConstants.messageName, this.#messageHandler)
  }

  async #messageHandler() {
    let response = serviceRegistry.juhhuuService.getTest()
    return response
  }
}