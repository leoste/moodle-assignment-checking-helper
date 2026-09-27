import BasePresenter from '../../shared/presenter/BasePresenter'
import type QuizReviewPage from '../pagemanager/QuizReviewPage'
import type QuizQuestionBox from '../pagemanager/QuizQuestionBox'
import { AutoGradeButtonRenderer } from '../renderer/AutoGradeButtonRenderer'
import { quizClient } from '../client/QuizClient'
import { logger } from '@shared/logging/logger'

export default class QuizReviewPresenter extends BasePresenter {
  readonly #page: QuizReviewPage

  #renderers: AutoGradeButtonRenderer[] = []

  constructor(page: QuizReviewPage) {
    super()
    this.#page = page
  }

  async start(): Promise<void> {
    void this.#page.getQuizId()
    // TODO: use quizid and questionid to fetch newly added QuizFeedback
    // implement sidepanel similar like on assignments with my custom controls
    // print question number + common answers as buttons into sidepanel
    // when pressed, automatically assign answer and points.
    // this probably doesnt need the combination of multiple common answers into one
    // two types of feedback need to be implemented. 1) assignmentfeedback 2) quizfeedback

    for (const question of this.#page.getManualGradedQuestions()) {
      const renderer = new AutoGradeButtonRenderer(question.getCommentElement(), () => this.#onAutoGradeClick(question))
      this.#renderers.push(renderer)
      await renderer.render()
    }
  }

  async stop(): Promise<void> {
    for (const renderer of this.#renderers) {
      await renderer.clear()
    }
    this.#renderers = []
  }

  async #onAutoGradeClick(question: QuizQuestionBox): Promise<void> {
    const autoGradeId = question.getAutoGradeId()
    logger.info(this, 'beginning auto grade', autoGradeId)

    await quizClient.beginAutoGrade(autoGradeId)
    logger.info(this, 'auto grade begun, opening comment page')

    question.openCommentPage()
  }
}
