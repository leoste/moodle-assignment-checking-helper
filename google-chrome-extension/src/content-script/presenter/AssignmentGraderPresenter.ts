import BasePresenter from '../../shared/presenter/BasePresenter'
import type AssignmentGraderPage from '../pagemanager/AssignmentGraderPage'
import CheckingHelperPanelRenderer from '../renderer/CheckingHelperPanelRenderer'
import { feedbackClient } from '../client/FeedbackClient'
import { pageInfoClient } from '../client/PageInfoClient'
import { buildComment, calculateGrade } from '../rules/grading-rules'
import deepCopy from '../../shared/util/deepCopy'
import type { Feedback } from '../../shared/types/Feedback'

export default class AssignmentGraderPresenter extends BasePresenter {
  readonly #page: AssignmentGraderPage

  #feedback: Feedback[] = []
  #commentPrefix = ''
  #renderer: CheckingHelperPanelRenderer | undefined

  constructor(page: AssignmentGraderPage) {
    super()
    this.#page = page
  }

  async start(): Promise<void> {
    const studentNameSent = this.#sendStudentName()

    this.#renderer = new CheckingHelperPanelRenderer({
      onPartToggled: this.#onPartToggled,
      onCommentPrefixChanged: this.#onCommentPrefixChanged,
    })
    await this.#renderer.render()
    this.#page.insertPanel(this.#renderer.element)

    this.#feedback = deepCopy(await feedbackClient.getData(this.#page.getAssignmentId()) ?? [])
    await this.#renderer.renderFeedback(this.#feedback)

    this.#page.expandCommentSection()
    if (this.#feedback.length > 0) {
      this.#updateGrade()
      this.#updateComment()
    }

    await studentNameSent
  }

  async stop(): Promise<void> {
    await this.#renderer?.clear()
  }

  async #sendStudentName(): Promise<void> {
    const response = await pageInfoClient.postStudentName(this.#page.getStudentName())
    console.log(response)
  }

  #onPartToggled =(feedbackIndex: number, partIndex: number, enabled: boolean): void => {
    this.#feedback[feedbackIndex].parts[partIndex].enabled = enabled
    this.#updateGrade()
    this.#updateComment()
  }

  #onCommentPrefixChanged = (prefix: string): void => {
    this.#commentPrefix = prefix
    this.#updateComment()
  }

  #updateGrade(): void {
    this.#page.setGrade(String(calculateGrade(this.#feedback)))
  }

  #updateComment(): void {
    this.#page.setComment(buildComment(this.#commentPrefix, this.#feedback))
  }
}
