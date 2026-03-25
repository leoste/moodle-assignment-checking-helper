setup()

function setup() {
  executeOnPageLoad(onLoad)  
}

function onLoad() {
  createAutoGradeButtons()
}

function createAutoGradeButtons() {
  const quizId = getQuizId()
  // TODO: use quizid and questionid to fetch common answers
  // implement sidepanel similar like on assignments with my custom controls
  // print question number + common answers as buttons into sidepanel
  // when pressed, automatically assign answer and points.
  // this probably doesnt need the combination of multiple common answers into one
  // split commonanswers into assignment and quiz separately as theyre different

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