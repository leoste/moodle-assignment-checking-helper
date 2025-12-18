setup()

function setup() {
  executeOnPageLoad(onLoad)
}

function onLoad() {
  setupCheckingHelperPanel()
  sendStudentName()
}

async function setupCheckingHelperPanel() {
  const mainDiv = getMainDiv()
  const gradePanel = getGradePanel()
  const element = createElementWithClasses("div", ["checking-helper-panel"])
  mainDiv.insertBefore(element, gradePanel.nextSibling)
  
  const leftDiv = createAndAddChildElement(element, "div", ["grade-subpanel"])
  const rightDiv = createAndAddChildElement(element, "div", ["common-answer-subpanel"])

  setupGradeSection(leftDiv)
  setupCommentSection(rightDiv)
}

async function setupGradeSection(parentDiv) {
  autofillGrade100()

  // TODO: move fetching into component probably
  const assignmentId = getAssignmentId()
  const fetcher = new GradePartsFetcher()
  const data = await fetcher.getData(assignmentId)
  const creator = new GradeSectionCreator(parentDiv)
  creator.setGradeParts(data)
  creator.create()
}

async function setupCommentSection(parentDiv) {
  // TODO: move fetching into component probably
  const assignmentId = getAssignmentId()
  const fetcher = new CommonAnswersFetcher()
  const data = await fetcher.getData(assignmentId)
  const creator = new CommentSectionCreator(parentDiv)
  creator.setCommonAnswers(data)
  creator.create()
}

async function autofillGrade100() {
  const input = getGradeInput()
  input.value = 100
}

async function sendStudentName() {
  const studentName = getStudentName()
  const client = new PageInfoClient()
  const response = await client.postStudentName(studentName)
  console.log(response)
}



/* seda pole otseselt vaja tegelikult */
/*async function setupQuickSubmit() {
  const commentLink = getCommentLink()
  const myDiv = createAndAddChildElement(commentLink.parentNode, "div", ["quick-submit-section"])
  const img = createAndAddChildImage(myDiv, "images/double-thumbs-up-emoji.png")
  img.addEventListener('click', () => {
    // this also automatically submits the comment
    getSaveGradeAndShowNextButton().click()
  }, {
    once: true
  })
}*/