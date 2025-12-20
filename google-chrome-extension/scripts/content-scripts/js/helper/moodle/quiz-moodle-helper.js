function getQuizIdAndQuestionNumberFromManualGradedBox(box) {
  const id = box.id
  const parts = id.split('-')
  return {
    quizId: parts[1],
    questionNumber: parts[2]
  }
}

function getAttemptId() {
  const urlParams = new URLSearchParams(window.location.search)
  const id = urlParams.get('attempt')
  return id
}

function getAutoGradeId(box) {
  const { quizId, questionNumber } = getQuizIdAndQuestionNumberFromManualGradedBox(box)
  const attemptId = getAttemptId()
  const autoGradeId = { quizId, questionNumber, attemptId }  
  return autoGradeId
}