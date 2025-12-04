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

class PageInfoClient {

  static #postStudentNameMessageType = "page-info/student-name/post"

  async postStudentName(studentName) {
    const message = getEmptyMessage(PageInfoClient.#postStudentNameMessageType)
    message.content.studentName = studentName
    const data = await chrome.runtime.sendMessage(message)
    return data
  }
}
