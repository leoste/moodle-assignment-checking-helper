import { QuizDataClient } from './client/quiz-client'
import { executeOnPageLoad, getManualGradedBoxes, getCommentFromManualGradedBox, getAutoGradeId, getCommentActionLink, getQuizId } from './helper/moodle-helper'
import { createAndAddChildElement } from './helper/element-helper'

setup()

function setup() {
  executeOnPageLoad(onLoad)
}

function onLoad() {
  createAutoGradeButtons()
}

function createAutoGradeButtons() {
  void getQuizId()
  // TODO: use quizid and questionid to fetch common answers
  // implement sidepanel similar like on assignments with my custom controls
  // print question number + common answers as buttons into sidepanel
  // when pressed, automatically assign answer and points.
  // this probably doesnt need the combination of multiple common answers into one
  // split commonanswers into assignment and quiz separately as theyre different

  const graderBoxes = getManualGradedBoxes()

  graderBoxes.forEach(box => {
    const comment = getCommentFromManualGradedBox(box)
    const button = createAndAddChildElement(comment, 'button', 'auto-max-button', 'Assign max points with no comment')
    button.addEventListener('click', () => onClickCallback(box, comment))
  })
}

const onClickCallback = async (box: HTMLElement, comment: HTMLElement): Promise<void> => {
  const autoGradeId = getAutoGradeId(box)

  console.log(autoGradeId)

  const client = new QuizDataClient()
  await client.beginAutoGrade(autoGradeId)

  console.log("meh")

  getCommentActionLink(comment).click()
}
