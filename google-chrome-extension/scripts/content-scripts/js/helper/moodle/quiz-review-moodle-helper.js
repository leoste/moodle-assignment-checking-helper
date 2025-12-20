function getManualGradedBoxes() {
  return document.querySelectorAll("div.manualgraded.complete")
}

function getCommentFromManualGradedBox(box) {
  return box.querySelector("div.comment")
}

function getQuizIdAndQuestionNumberFromManualGradedBox(box) {
  const id = box.id
  const parts = id.split('-')
  return {
    quizId: parts[1],
    questionNumber: parts[2]
  }
}

function getCommentActionLink(comment) {
  return comment.querySelector("div.commentlink a")
}

function getAttemptId() {
  const urlParams = new URLSearchParams(window.location.search)
  const id = urlParams.get('attempt')
  return id
}