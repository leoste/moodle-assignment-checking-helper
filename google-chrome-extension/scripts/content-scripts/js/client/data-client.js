function getEmptyMessage(type) {
  return {
    type: type,
    content: {}
  }
}

class GradePartsFetcher {
  
  static #messageType = "grade-parts/get"

  async getData(assignmentId) {
    const message = getEmptyMessage(GradePartsFetcher.#messageType)
    message.content.assignmentId = assignmentId
    const data = await chrome.runtime.sendMessage(message)
    return data
  }
}

class CommonAnswersFetcher {

  static #messageType = "common-answers/get"

  async getData(assignmentId) {
    const message = getEmptyMessage(CommonAnswersFetcher.#messageType)
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
