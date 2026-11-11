import BasePresenter from '../../shared/presenter/BasePresenter'
import type QuizReviewPage from '../pagemanager/QuizReviewPage'
import type QuizQuestionBox from '../pagemanager/QuizQuestionBox'
import { AutoGradeButtonRenderer } from '../renderer/AutoGradeButtonRenderer'
import { quizClient } from '../client/QuizClient'
import { logger } from '@shared/reporting/logger'

export default class QuizReviewPresenter extends BasePresenter {
  readonly #page: QuizReviewPage

  #renderers: AutoGradeButtonRenderer[] = []

  constructor(page: QuizReviewPage) {
    super()
    this.#page = page
  }

  async start(): Promise<void> {
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
