import BasePresenter from '@shared/presenter/BasePresenter'
import type AssignmentGraderPage from '../pagemanager/AssignmentGraderPage'
import CheckingHelperPanelRenderer from '../renderer/CheckingHelperPanelRenderer'
import { feedbackClient } from '../client/FeedbackClient'
import { studentSubmissionClient } from '../client/StudentSubmissionClient'
import { buildComment, calculateGrade } from '../rules/grading-rules'
import { getDefaultSelection, getFeedbackView } from '../rules/feedback-rules'
import { carryOverSelection } from '../rules/selection-rules'
import deepCopy from '../../shared/util/deepCopy'
import type { Feedback } from '../../shared/types/Feedback'
import type { DefinitionLookup } from '../../shared/types/DefinitionLookup'
import { logger } from '@shared/reporting/logger'
import { statusReporter } from '@shared/reporting/statusReporter'
import { portStatusReceiver } from '../../shared/reporting/PortStatusReceiver'
import { getStudentSubmissionOpeningStatus, getStudentSubmissionStatus } from '@shared/rules/status-rules'
import { getBrokenDefinitionsStatus, getDefinitionSearchingStatus, getDefinitionStatus } from '../../shared/rules/status-rules'
import { RESPONSE_STATUS_ERROR } from '@shared/constants/vscode-message'
import { STATUS_TOPIC_BROKEN_DEFINITIONS, STATUS_TOPIC_MOODLE_PAGE } from '@shared/constants/status'
import { webLockProvider } from '../infrastructure/WebLockProvider'

// Held by the one tab that grades, see "One grading tab" in the README.
const GRADING_TAB_LOCK_NAME = 'moodle-helper/grading-tab'

export default class AssignmentGraderPresenter extends BasePresenter {
  readonly #page: AssignmentGraderPage

  #feedback: Feedback[] = []
  #selection: boolean[][] = []
  #commentPrefix = ''
  #renderer: CheckingHelperPanelRenderer | undefined
  // A stopped presenter's late answers mustn't overwrite the next page's statuses.
  #stopped = false
  #feedbackShown = false

  constructor(page: AssignmentGraderPage) {
    super()
    this.#page = page
  }

  async start(): Promise<void> {
    statusReporter.clear(STATUS_TOPIC_MOODLE_PAGE)
    statusReporter.clear(STATUS_TOPIC_BROKEN_DEFINITIONS)
    const isGradingTab = await webLockProvider.acquire(GRADING_TAB_LOCK_NAME)
    logger.info(this, isGradingTab ? 'grading in this tab' : 'another tab is grading')
    if (this.#stopped) return
    if (!isGradingTab) {
      const renderer = await this.#insertPanel()
      await renderer.renderGradingElsewhere()
      return
    }

    portStatusReceiver.connect()
    const studentSubmissionOpened = this.#openStudentSubmission()
    const renderer = await this.#insertPanel()

    const assignmentId = this.#page.getAssignmentId()
    statusReporter.report(getDefinitionSearchingStatus())
    const lookup = await feedbackClient.getData(assignmentId)
    this.#reportDefinition(lookup, assignmentId)
    this.#feedback = deepCopy(lookup?.definition?.feedback ?? [])
    this.#selection = getDefaultSelection(this.#feedback)
    logger.info(this, `assignment ${assignmentId}: ${this.#feedback.length} feedback group(s)`)
    await renderer.renderFeedback(getFeedbackView(this.#feedback, this.#selection), this.#commentPrefix)
    this.#feedbackShown = true

    this.#page.expandCommentSection()
    await this.#renderApplySection()

    await studentSubmissionOpened
  }

  async stop(): Promise<void> {
    this.#stopped = true
    await this.#renderer?.clear()
  }

  // Called when the definitions were reloaded in the popup. The lecturer's selections and comment prefix are kept where the new definition allows it.
  async refreshDefinition(): Promise<void> {
    if (!this.#feedbackShown || this.#stopped) return
    const assignmentId = this.#page.getAssignmentId()
    statusReporter.clear(STATUS_TOPIC_BROKEN_DEFINITIONS)
    statusReporter.report(getDefinitionSearchingStatus())
    const lookup = await feedbackClient.getData(assignmentId)
    this.#reportDefinition(lookup, assignmentId)
    if (this.#stopped) return

    const feedback = deepCopy(lookup?.definition?.feedback ?? [])
    this.#selection = carryOverSelection(this.#feedback, this.#selection, feedback)
    this.#feedback = feedback
    logger.info(this, `assignment ${assignmentId} reloaded: ${this.#feedback.length} feedback group(s)`)
    await this.#renderer!.renderFeedback(getFeedbackView(this.#feedback, this.#selection), this.#commentPrefix)
    await this.#renderApplySection()
  }

  async #insertPanel(): Promise<CheckingHelperPanelRenderer> {
    const renderer = new CheckingHelperPanelRenderer({
      onPartToggled: this.#onPartToggled,
      onCommentPrefixChanged: this.#onCommentPrefixChanged,
      onResized: this.#onPanelResized,
      onApply: this.#onApply,
    })
    this.#renderer = renderer
    await renderer.render()
    this.#page.insertPanel(renderer.element)
    statusReporter.setSink(renderer.statusLine)
    return renderer
  }

  async #renderApplySection(): Promise<void> {
    if (this.#feedback.length === 0) {
      await this.#renderer?.clearApplySection()
      return
    }
    await this.#renderer?.renderApplySection()
    this.#updatePreview()
  }

  async #openStudentSubmission(): Promise<void> {
    const studentName = this.#page.getStudentName()
    statusReporter.report(getStudentSubmissionOpeningStatus(studentName))
    const response = await studentSubmissionClient.openStudentSubmission(studentName)
    logger.info(this, `student submission of "${studentName}" opened in VS Code: ${response}`)
    if (this.#stopped) return
    statusReporter.report(getStudentSubmissionStatus(studentName, response ?? RESPONSE_STATUS_ERROR))
  }

  #reportDefinition(lookup: DefinitionLookup | undefined, assignmentId: string): void {
    if (this.#stopped) return
    statusReporter.report(getDefinitionStatus(lookup, assignmentId))
    const brokenDefinitionsStatus = getBrokenDefinitionsStatus(lookup?.brokenFiles ?? [])
    if (brokenDefinitionsStatus) statusReporter.report(brokenDefinitionsStatus)
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
