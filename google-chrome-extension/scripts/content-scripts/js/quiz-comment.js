setup()

function setup() {
  executeOnPageLoad(onLoad)  
}

function onLoad() {  
  console.log("page loaded")
  autoGradeIfActive()
}

function autoGradeIfActive() {
  const client = new QuizDataClient()

  const box = getManualGradedBox()
  const autoGradeId = getAutoGradeId(box)
  const isActive = client.isAutoGradeActive(autoGradeId)

  if (isActive) {
    const grade = getMaxMark()

    const gradeInput = getGradeInput()
    gradeInput.value = grade

    client.endAutoGrade()

    getSubmitButton().click()
  }
}
