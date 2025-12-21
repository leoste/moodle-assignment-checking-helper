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

onClickCallback = async (box, comment) => {  
  const autoGradeId = getAutoGradeId(box)

  console.log(autoGradeId)

  const client = new QuizDataClient()
  await client.beginAutoGrade(autoGradeId)

  console.log("meh")

  getCommentActionLink(comment).click()
}