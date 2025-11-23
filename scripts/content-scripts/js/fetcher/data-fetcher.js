function getEmptyMessage(type) {
  return {
    type: type,
    content: {}
  }
}

class CommonAnswersFetcher {

  static #getCommonAnswersMessageType = "common-answers/get"

  async getData(assignmentId) {
    const message = getEmptyMessage(CommonAnswersFetcher.#getCommonAnswersMessageType)
    message.content.assignmentId = assignmentId
    const data = await chrome.runtime.sendMessage(message)
    return data
  }
}


"common-answers/get"