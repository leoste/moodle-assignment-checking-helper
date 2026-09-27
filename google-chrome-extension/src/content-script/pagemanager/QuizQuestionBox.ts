import type { AutoGradeId } from '../../shared/types/AutoGradeId'

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
    return this.#element.querySelector<HTMLElement>(COMMENT_SELECTOR)!
  }

  openCommentPage(): void {
    this.getCommentElement().querySelector<HTMLAnchorElement>(COMMENT_ACTION_LINK_SELECTOR)!.click()
  }
}
