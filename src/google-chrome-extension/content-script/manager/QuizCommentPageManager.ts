import { announcer } from '@shared/announcer/Announcer'
import QuizPageManager from './QuizPageManager'
import type QuizQuestionBox from './QuizQuestionBox'

const GRADE_INPUT_SELECTOR = 'input[id^="q"][id$="_-mark"]'
const MAX_MARK_INPUT_SELECTOR = 'input[name^="q"][name$="_-maxmark"]'
const SUBMIT_BUTTON_SELECTOR = 'input#id_submitbutton'

export default class QuizCommentPageManager extends QuizPageManager {
  getQuestion(): QuizQuestionBox {
    const question = this.getManualGradedBoxes()[0]
    if (!question) announcer.announceLogError(this, 'no manual graded question on the page')
    return question
  }

  getMaxMark(): string {
    return this.query<HTMLInputElement>(MAX_MARK_INPUT_SELECTOR).value
  }

  setGrade(grade: string): void {
    this.query<HTMLInputElement>(GRADE_INPUT_SELECTOR).value = grade
  }

  submit(): void {
    this.query<HTMLInputElement>(SUBMIT_BUTTON_SELECTOR).click()
  }
}
