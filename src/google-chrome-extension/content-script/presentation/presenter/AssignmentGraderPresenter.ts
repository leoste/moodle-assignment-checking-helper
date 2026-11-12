import BasePresenter from '@shared/presentation/presenter/BasePresenter'
import type AssignmentGraderPageManager from '../manager/AssignmentGraderPageManager'
import CheckingHelperPanelRenderer from '../renderer/CheckingHelperPanelRenderer'
import { feedbackClient } from '../../communication/client/FeedbackClient'
import { studentSubmissionClient } from '../../communication/client/StudentSubmissionClient'
import { newsClient } from '../../../shared/communication/client/NewsClient'
import { buildComment, calculateGrade } from '../../business/rules/grading-rules'
import { getDefaultSelection, getFeedbackView } from '../../business/rules/feedback-rules'
import { carryOverSelection } from '../../business/rules/selection-rules'
import deepCopy from '../../../shared/foundation/util/deepCopy'
import type { Feedback } from '../../../shared/business/types/Feedback'
import type { DefinitionLookup } from '../../../shared/business/types/DefinitionLookup'
import { announcer } from '@shared/communication/announcer/Announcer'
import { statusLineWatcher } from '@shared/communication/watcher/StatusLineWatcher'
import { getStudentSubmissionOpeningStatus, getStudentSubmissionStatus } from '@shared/business/rules/status-rules'
import {
  getAppliedStatus,
  getBrokenDefinitionsStatus,
  getDefinitionSearchingStatus,
  getDefinitionStatus,
} from '../../../shared/business/rules/status-rules'
import { RESPONSE_STATUS_ERROR } from '@shared/foundation/constants/vscode-message'
import { STATUS_TOPIC_APPLY, STATUS_TOPIC_BROKEN_DEFINITIONS, STATUS_TOPIC_MOODLE_PAGE } from '@shared/foundation/constants/status'
import { webLockProvider } from '../../foundation/infrastructure/WebLockProvider'
import { GRADING_TAB_LOCK_NAME } from '../../foundation/constants/locks'

export default class AssignmentGraderPresenter extends BasePresenter {
  readonly #pageManager: AssignmentGraderPageManager

  #feedback: Feedback[] = []
  #selection: boolean[][] = []
  #commentPrefix = ''
  #renderer: CheckingHelperPanelRenderer | undefined
  // A stopped presenter's late answers mustn't overwrite the next page's statuses.
  #stopped = false
  #feedbackShown = false
  #takingOver = false

  constructor(pageManager: AssignmentGraderPageManager) {
    super()
    this.#pageManager = pageManager
  }

  async start(): Promise<void> {
    const isGradingTab = await webLockProvider.acquire(GRADING_TAB_LOCK_NAME)
    announcer.announceLog(this, isGradingTab ? 'grading in this tab' : 'another tab is grading')
    if (this.#stopped) return
    if (isGradingTab) await this.#startGrading()
    else await this.#showGradingElsewhere()
  }

  async stop(): Promise<void> {
    this.#stopped = true
    await this.#renderer?.clear()
  }

  // The statuses belong to the grading tab, also when this tab's grading was just taken over.
  async #showGradingElsewhere(): Promise<void> {
    statusLineWatcher.unfollow(newsClient)
    announcer.announceStatusesCleared()
    const renderer = await this.#insertPanel()
    await renderer.renderGradingElsewhere()
  }

  async #startGrading(): Promise<void> {
    announcer.announceStatusCleared(STATUS_TOPIC_MOODLE_PAGE)
    announcer.announceStatusCleared(STATUS_TOPIC_BROKEN_DEFINITIONS)
    announcer.announceStatusCleared(STATUS_TOPIC_APPLY)
    void statusLineWatcher.follow(newsClient)
    const studentSubmissionOpened = this.#openStudentSubmission()
    const renderer = await this.#insertPanel()

    const assignmentId = this.#pageManager.getAssignmentId()
    announcer.announceStatus(getDefinitionSearchingStatus())
    const lookup = await feedbackClient.getData(assignmentId)
    this.#reportDefinition(lookup, assignmentId)
    this.#feedback = deepCopy(lookup?.definition?.feedback ?? [])
    this.#selection = getDefaultSelection(this.#feedback)
    announcer.announceLog(this, `assignment ${assignmentId}: ${this.#feedback.length} feedback group(s)`)
    await renderer.renderFeedback(getFeedbackView(this.#feedback, this.#selection), this.#commentPrefix)
    this.#feedbackShown = true

    this.#pageManager.expandCommentSection()
    await this.#renderApplySection()

    await studentSubmissionOpened
  }

  // Called when the definitions were reloaded in the popup. The lecturer's selections and comment prefix are kept where the new definition allows it.
  async refreshDefinition(): Promise<void> {
    if (!this.#feedbackShown || this.#stopped) return
    const assignmentId = this.#pageManager.getAssignmentId()
    announcer.announceStatusCleared(STATUS_TOPIC_BROKEN_DEFINITIONS)
    announcer.announceStatus(getDefinitionSearchingStatus())
    const lookup = await feedbackClient.getData(assignmentId)
    this.#reportDefinition(lookup, assignmentId)
    if (this.#stopped) return

    const feedback = deepCopy(lookup?.definition?.feedback ?? [])
    this.#selection = carryOverSelection(this.#feedback, this.#selection, feedback)
    this.#feedback = feedback
    announcer.announceLog(this, `assignment ${assignmentId} reloaded: ${this.#feedback.length} feedback group(s)`)
    await this.#renderer!.renderFeedback(getFeedbackView(this.#feedback, this.#selection), this.#commentPrefix)
    await this.#renderApplySection()
  }

  async #insertPanel(): Promise<CheckingHelperPanelRenderer> {
    const renderer = new CheckingHelperPanelRenderer({
      onPartToggled: this.#onPartToggled,
      onCommentPrefixChanged: this.#onCommentPrefixChanged,
      onResized: this.#onPanelResized,
      onApply: this.#onApply,
      onTakeOver: this.#onTakeOver,
    })
    this.#renderer = renderer
    await renderer.render()
    this.#pageManager.insertPanel(renderer.element)
    statusLineWatcher.setStatusLine(renderer.statusLine)
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
    const studentName = this.#pageManager.getStudentName()
    announcer.announceStatus(getStudentSubmissionOpeningStatus(studentName))
    const response = await studentSubmissionClient.openStudentSubmission(studentName)
    announcer.announceLog(this, `student submission of "${studentName}" opened in VS Code: ${response}`)
    if (this.#stopped) return
    announcer.announceStatus(getStudentSubmissionStatus(studentName, response ?? RESPONSE_STATUS_ERROR))
  }

  #reportDefinition(lookup: DefinitionLookup | undefined, assignmentId: string): void {
    if (this.#stopped) return
    announcer.announceStatus(getDefinitionStatus(lookup, assignmentId))
    const brokenDefinitionsStatus = getBrokenDefinitionsStatus(lookup?.brokenFiles ?? [])
    if (brokenDefinitionsStatus) announcer.announceStatus(brokenDefinitionsStatus)
  }

  #onPartToggled = (feedbackIndex: number, partIndex: number, selected: boolean): void => {
    this.#selection[feedbackIndex][partIndex] = selected
    this.#updatePreview()
  }

  #onCommentPrefixChanged = (prefix: string): void => {
    this.#commentPrefix = prefix
    this.#updatePreview()
  }

  // The tab the grading is taken from loads its panel again through GradingTabController.
  #onTakeOver = async (): Promise<void> => {
    if (this.#takingOver) return
    this.#takingOver = true
    await webLockProvider.steal(GRADING_TAB_LOCK_NAME)
    announcer.announceLog(this, 'took the grading over from another tab')
    if (this.#stopped) return
    await this.#renderer?.clear()
    await this.#startGrading()
  }

  #onPanelResized = (left: number): void => {
    this.#pageManager.resizeGradePanel(left)
  }

  #onApply = (): void => {
    const grade = this.#getGrade()
    this.#pageManager.setGrade(String(grade))
    this.#pageManager.setComment(this.#getComment())
    announcer.announceLog(this, `applied grade ${grade} and comment`)
    announcer.announceStatus(getAppliedStatus())
  }

  // A change after applying hasn't reached Moodle yet.
  #updatePreview(): void {
    const grade = this.#getGrade()
    announcer.announceLog(this, `grade: ${grade}`)
    this.#renderer?.setPreview(grade, this.#getComment())
    announcer.announceStatusCleared(STATUS_TOPIC_APPLY)
  }

  #getGrade(): number {
    return calculateGrade(this.#feedback, this.#selection)
  }

  #getComment(): string {
    return buildComment(this.#commentPrefix, this.#feedback, this.#selection)
  }
}
