setup()

function setup() {
  executeOnPageLoad(onLoad)  
}

function onLoad() {
  createAutoMaxButtons()
  console.log("page loaded")
}

function createAutoMaxButtons() {
  const graderBoxes = getManualGradedBoxes()

  graderBoxes.forEach(box => {
    const comment = getCommentFromManualGradedBox(box)
    const button = createAndAddChildElement(comment, "button", "auto-max-button", "Assign max points with no comment")    
    button.addEventListener('click', () => onClickCallback(box, comment))
  })
}

onClickCallback = (box, comment) => {
  const { quizId, questionNumber } = getQuizIdAndQuestionNumberFromManualGradedBox(box)
  const attemptId = getAttemptId()
  // TODO: send message with the three above to say that autosubmit popup for those has been opened
  // TODO 2: another
  getCommentActionLink(comment).click()
}