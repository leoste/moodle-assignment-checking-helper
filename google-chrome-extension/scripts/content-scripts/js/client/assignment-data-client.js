function getEmptyMessage(type) {
  return {
    type: type,
    content: {}
  }
}

class GradePartsClient {
  
  static #messageType = "assignment/grade-parts/get"

  async getData(assignmentId) {
    const message = getEmptyMessage(GradePartsClient.#messageType)
    message.content.assignmentId = assignmentId
    const data = await chrome.runtime.sendMessage(message)
    return data
  }
}
