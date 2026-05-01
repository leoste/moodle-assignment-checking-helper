import CommonAnswersClient from "../client/CommonAnswerClient";
import GradePartsClient from "../client/GradePartsClient";
import { QuickSubmitRenderer } from './QuickSubmitRenderer';
import { GradeSectionRenderer } from './GradeSectionRenderer';
import { CommentSectionRenderer } from './CommentSectionRenderer';
import { getAssignmentId, getGradePanel, getMainDiv } from "../pagemanager/assignment-moodle-helper";
import { createAndAddChildElement, createElementWithClasses } from "../pagemanager/element-creation-helper";

export default class CheckingHelperPanelRenderer {
  #checkingHelperPanel: HTMLElement | undefined
  #gradeManager: GradeSectionRenderer | undefined
  #commentManager: CommentSectionRenderer | undefined
  #quickSubmitManager: QuickSubmitRenderer | undefined

  async render(): Promise<void> {
    this.#gradeManager?.destroy()
    this.#commentManager?.destroy()
    this.#quickSubmitManager?.destroy()
    this.#checkingHelperPanel?.remove()
    await this.#setupCheckingHelperPanel()
  }

  async #setupCheckingHelperPanel(): Promise<void> {
    this.#insertCheckingHelperPanelElement()

    const leftDiv = createAndAddChildElement(this.#checkingHelperPanel!, 'div', ['grade-subpanel', 'checking-helper-subpanel'])
    const rightDiv = createAndAddChildElement(this.#checkingHelperPanel!, 'div', ['common-answer-subpanel', 'checking-helper-subpanel'])
    const rightBottomDiv = createAndAddChildElement(this.#checkingHelperPanel!, 'div', ['quick-submit-subpanel', 'checking-helper-subpanel'])

    await this.#setupGradeSection(leftDiv)
    await this.#setupCommentSection(rightDiv)
    this.#setupQuickSubmit(rightBottomDiv)
  }

  #insertCheckingHelperPanelElement(): void {
    const mainDiv = getMainDiv()
    const gradePanel = getGradePanel()
    this.#checkingHelperPanel = createElementWithClasses('div', ['checking-helper-panel'])
    mainDiv.insertBefore(this.#checkingHelperPanel, gradePanel.nextSibling)
  }

  async #setupGradeSection(parentDiv: HTMLElement): Promise<void> {
    createAndAddChildElement(parentDiv, 'h2', null, 'Hinde kujunemine')

    const assignmentId = getAssignmentId()
    const data = await new GradePartsClient().getData(assignmentId)

    this.#gradeManager = new GradeSectionRenderer(parentDiv, data)
    this.#gradeManager.create()
  }

  async #setupCommentSection(parentDiv: HTMLElement): Promise<void> {
    createAndAddChildElement(parentDiv, 'h2', null, 'Kommentaari koostamine')

    const assignmentId = getAssignmentId()
    const data = await new CommonAnswersClient().getData(assignmentId)

    this.#commentManager = new CommentSectionRenderer(parentDiv, data)
    this.#commentManager.create()
  }

  #setupQuickSubmit(parentDiv: HTMLElement): void {
    this.#quickSubmitManager = new QuickSubmitRenderer(parentDiv, this.#gradeManager!, this.#commentManager!)
    this.#quickSubmitManager.create()
  }
}
