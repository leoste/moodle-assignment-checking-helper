function getEmptyMessage(type) {
  return {
    type: type
  }
}

class CommonAnswersFetcher {

  static #getCommonAnswersMessageType = "common-answers/get"

  async getData() {
    const message = getEmptyMessage(CommonAnswersFetcher.#getCommonAnswersMessageType)
    const data = await chrome.runtime.sendMessage(message)
    return data
  }
}


"common-answers/get"