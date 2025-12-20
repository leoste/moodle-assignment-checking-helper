setup()

function setup() {
  executeOnPageLoad(onLoad)  
}

function onLoad() {
  createAutoGradeButtons()
}

function createAutoGradeButtons() {
  const graderBoxes = getManualGradedBoxes()

  graderBoxes.forEach(box => {
    const comment = getCommentFromManualGradedBox(box)
    const button = createAndAddChildElement(comment, "button", "auto-max-button", "Assign max points with no comment")    
    button.addEventListener('click', () => onClickCallback(box, comment))
  })
}

onClickCallback = (box, comment) => {
  const autoGradeId = getAutoGradeId(box)

  const client = new QuizDataClient()
  client.beginAutoGrade(autoGradeId)

  getCommentActionLink(comment).click()
}