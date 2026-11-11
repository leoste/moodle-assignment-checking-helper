import BasePresenter from '../../shared/presenter/BasePresenter'
import type AssignmentGraderPage from '../pagemanager/AssignmentGraderPage'
import CheckingHelperPanelRenderer from '../renderer/CheckingHelperPanelRenderer'
import { feedbackClient } from '../client/FeedbackClient'
import { studentSubmissionClient } from '../client/StudentSubmissionClient'
import { buildComment, calculateGrade } from '../rules/grading-rules'
import { getDefaultSelection, getFeedbackView } from '../rules/feedback-rules'
import deepCopy from '../../shared/util/deepCopy'
import type { Feedback } from '../../shared/types/Feedback'
import { logger } from '@shared/logging/logger'

export default class AssignmentGraderPresenter extends BasePresenter {
  readonly #page: AssignmentGraderPage

  #feedback: Feedback[] = []
  #selection: boolean[][] = []
  #commentPrefix = ''
  #renderer: CheckingHelperPanelRenderer | undefined

  constructor(page: AssignmentGraderPage) {
    super()
    this.#page = page
  }

  async start(): Promise<void> {
    const studentSubmissionOpened = this.#openStudentSubmission()

    this.#renderer = new CheckingHelperPanelRenderer({
      onPartToggled: this.#onPartToggled,
      onCommentPrefixChanged: this.#onCommentPrefixChanged,
      onResized: this.#onPanelResized,
      onApply: this.#onApply,
    })
    await this.#renderer.render()
    this.#page.insertPanel(this.#renderer.element)

    const assignmentId = this.#page.getAssignmentId()
    this.#feedback = deepCopy(await feedbackClient.getData(assignmentId) ?? [])
    this.#selection = getDefaultSelection(this.#feedback)
    logger.info(this, `assignment ${assignmentId}: ${this.#feedback.length} feedback group(s)`)
    await this.#renderer.renderFeedback(getFeedbackView(this.#feedback, this.#selection))

    this.#page.expandCommentSection()
    if (this.#feedback.length > 0) {
      await this.#renderer.renderApplySection()
      this.#updatePreview()
    }

    await studentSubmissionOpened
  }

  async stop(): Promise<void> {
    await this.#renderer?.clear()
  }

  async #openStudentSubmission(): Promise<void> {
    const studentName = this.#page.getStudentName()
    const response = await studentSubmissionClient.openStudentSubmission(studentName)
    logger.info(this, `student submission of "${studentName}" opened in VS Code: ${response}`)
  }

  #onPartToggled = (feedbackIndex: number, partIndex: number, selected: boolean): void => {
    this.#selection[feedbackIndex][partIndex] = selected
    this.#updatePreview()
  }

  #onCommentPrefixChanged = (prefix: string): void => {
    this.#commentPrefix = prefix
    this.#updatePreview()
  }

  #onPanelResized = (left: number): void => {
    this.#page.resizeGradePanel(left)
  }

  #onApply = (): void => {
    const grade = this.#getGrade()
    this.#page.setGrade(String(grade))
    this.#page.setComment(this.#getComment())
    logger.info(this, `applied grade ${grade} and comment`)
    this.#renderer?.setApplied(true)
  }

  #updatePreview(): void {
    const grade = this.#getGrade()
    logger.info(this, `grade: ${grade}`)
    this.#renderer?.setPreview(grade, this.#getComment())
    this.#renderer?.setApplied(false)
  }

  #getGrade(): number {
    return calculateGrade(this.#feedback, this.#selection)
  }

  #getComment(): string {
    return buildComment(this.#commentPrefix, this.#feedback, this.#selection)
  }
}
