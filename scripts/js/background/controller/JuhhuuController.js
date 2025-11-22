import JuhhuuConstants from "../constants/juhhuuConstants.js";
import JuhhuuService from "../service/JuhhuuService.js";
import BaseController from "./BaseController.js";

export default class JuhhuuController extends BaseController {

  init() {
    super.init()
    this.addMessageHandler(JuhhuuConstants.messageName, this.#messageHandler)
  }

  static #juhhuuService = new JuhhuuService()

  async #messageHandler() {
    let response = JuhhuuController.#juhhuuService.getTest()
    return response
  }
}