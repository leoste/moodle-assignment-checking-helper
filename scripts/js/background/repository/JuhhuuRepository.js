import LocalStorageRepository from "./LocalStorageRepository.js"

export default class JuhhuuRepository extends LocalStorageRepository {

  static #testKey = "test"

  async getTest() {    
    const { test } = await this.getValue(JuhhuuRepository.#testKey)
    return test
  }

  async setTest(value) {
    await this.setValue(JuhhuuRepository.#testKey, value)
  }
}