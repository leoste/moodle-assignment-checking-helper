import BaseController from "./BaseController.js";

export default class JuhhuuController extends BaseController {
  init() {
    super.init()
    this.addMessageHandler(JuhhuuController.#messageName, this.#messageHandler)
  }

  static #messageName = "test"

  async #messageHandler() {
    return "test"
  }
}