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
  
  const leftDiv = createAndAddChildElement(element, "div", ["grade-subpanel", "checking-helper-subpanel"])
  const rightDiv = createAndAddChildElement(element, "div", ["common-answer-subpanel", "checking-helper-subpanel"])

  setupGradeSection(leftDiv)
  setupCommentSection(rightDiv)
}

async function setupGradeSection(parentDiv) {
  createAndAddChildElement(parentDiv, "h2", null, "Hinde kujunemine")

  // TODO: move fetching into component probably
  const assignmentId = getAssignmentId()
  const fetcher = new GradePartsFetcher()
  const data = await fetcher.getData(assignmentId)
  const gradeInput = getGradeInput()
  const creator = new GradeSectionCreator(parentDiv, gradeInput)
  creator.setGradeParts(data)
  creator.create()
}

async function setupCommentSection(parentDiv) {
  createAndAddChildElement(parentDiv, "h2", null, "Kommentaari koostamine")

  // TODO: move fetching into component probably
  const assignmentId = getAssignmentId()
  const fetcher = new CommonAnswersFetcher()
  const data = await fetcher.getData(assignmentId)
  const creator = new CommentSectionCreator(parentDiv)
  creator.setCommonAnswers(data)
  creator.create()
}

async function sendStudentName() {
  const studentName = getStudentName()
  const client = new PageInfoClient()
  const response = await client.postStudentName(studentName)
  console.log(response)
}
