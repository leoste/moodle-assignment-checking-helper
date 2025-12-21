class QuizDataClient {

  static #beginMessage = "quiz/auto-grade/begin"
  static #endMessage = "quiz/auto-grade/end"
  static #isActiveMessage = "quiz/auto-grade/is-active"
  
  async beginAutoGrade(autoGradeId) {
    const messageType = QuizDataClient.#beginMessage
    const message = this.#getAutoGradeMessage(messageType, autoGradeId)
    await chrome.runtime.sendMessage(message)
  }

  async endAutoGrade(autoGradeId) {
    const messageType = QuizDataClient.#endMessage
    const message = this.#getAutoGradeMessage(messageType, autoGradeId)
    await chrome.runtime.sendMessage(message)
  }

  async isAutoGradeActive(autoGradeId) {
    const messageType = QuizDataClient.#isActiveMessage
    const message = this.#getAutoGradeMessage(messageType, autoGradeId)
    const data = await chrome.runtime.sendMessage(message)
    return data
  }

  #getAutoGradeMessage(messageType, autoGradeId) {
    const message = getEmptyMessage(messageType)
    message.content.autoGradeId = autoGradeId
    return message
  }
}