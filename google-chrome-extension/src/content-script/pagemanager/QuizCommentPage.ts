import QuizPage from './QuizPage'
import type QuizQuestionBox from './QuizQuestionBox'

const GRADE_INPUT_SELECTOR = 'input[id^="q"][id$="_-mark"]'
const MAX_MARK_INPUT_SELECTOR = 'input[name^="q"][name$="_-maxmark"]'
const SUBMIT_BUTTON_SELECTOR = 'input#id_submitbutton'

export default class QuizCommentPage extends QuizPage {
  getQuestion(): QuizQuestionBox {
    return this.getManualGradedBoxes()[0]
  }

  getMaxMark(): string {
    return document.querySelector<HTMLInputElement>(MAX_MARK_INPUT_SELECTOR)!.value
  }

  setGrade(grade: string): void {
    document.querySelector<HTMLInputElement>(GRADE_INPUT_SELECTOR)!.value = grade
  }

  submit(): void {
    document.querySelector<HTMLInputElement>(SUBMIT_BUTTON_SELECTOR)!.click()
  }
}
