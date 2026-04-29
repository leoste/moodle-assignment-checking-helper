import { QuizDataClient } from './client/quiz-client'
import { executeOnPageLoad, getManualGradedBox, getGradeInput, getMaxMark, getSubmitButton, getAutoGradeId } from './helper/moodle-helper'

setup()

function setup() {
  executeOnPageLoad(onLoad)
}

function onLoad() {
  autoGradeIfActive()
}

async function autoGradeIfActive() {
  const client = new QuizDataClient()

  const box = getManualGradedBox()
  const autoGradeId = getAutoGradeId(box)
  const isActive = await client.isAutoGradeActive(autoGradeId)

  if (isActive) {
    const grade = getMaxMark()

    const gradeInput = getGradeInput()
    gradeInput.value = grade

    client.endAutoGrade(autoGradeId)

    getSubmitButton().click()
  }
}
