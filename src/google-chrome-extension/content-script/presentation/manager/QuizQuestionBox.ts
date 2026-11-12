import type { AutoGradeId } from '../../../shared/business/types/AutoGradeId'
import queryElement from './queryElement'

// Moodle's manual graded box id format: "question-<quiz id>-<question number>"
const ID_SEPARATOR = '-'
const ID_QUIZ_ID_INDEX = 1
const ID_QUESTION_NUMBER_INDEX = 2

const COMMENT_SELECTOR = 'div.comment'
const COMMENT_ACTION_LINK_SELECTOR = 'div.commentlink a'

export default class QuizQuestionBox {
  readonly #element: HTMLElement
  readonly #attemptId: string

  constructor(element: HTMLElement, attemptId: string) {
    this.#element = element
    this.#attemptId = attemptId
  }

  getAutoGradeId(): AutoGradeId {
    const parts = this.#element.id.split(ID_SEPARATOR)
    return {
      quizId: parts[ID_QUIZ_ID_INDEX] ?? '',
      questionNumber: parts[ID_QUESTION_NUMBER_INDEX] ?? '',
      attemptId: this.#attemptId,
    }
  }

  getCommentElement(): HTMLElement {
    return queryElement<HTMLElement>(this, COMMENT_SELECTOR, this.#element)
  }

  openCommentPage(): void {
    queryElement<HTMLAnchorElement>(this, COMMENT_ACTION_LINK_SELECTOR, this.getCommentElement()).click()
  }
}
