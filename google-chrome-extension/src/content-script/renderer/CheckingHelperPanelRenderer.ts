import FeedbackClient from '../client/FeedbackClient';
import { QuickSubmitRenderer } from './QuickSubmitRenderer';
import { FeedbackSectionRenderer } from './FeedbackSectionRenderer';
import { getAssignmentId, getGradePanel, getMainDiv } from '../pagemanager/assignment-moodle-helper';
import { createAndAddChildElement, createElementWithClasses } from '../pagemanager/element-creation-helper';

export default class CheckingHelperPanelRenderer {
  #checkingHelperPanel: HTMLElement | undefined
  #feedbackManager: FeedbackSectionRenderer | undefined
  #quickSubmitManager: QuickSubmitRenderer | undefined

  async render(): Promise<void> {
    this.#feedbackManager?.destroy()
    this.#quickSubmitManager?.destroy()
    this.#checkingHelperPanel?.remove()
    await this.#setupCheckingHelperPanel()
  }

  async #setupCheckingHelperPanel(): Promise<void> {
    this.#insertCheckingHelperPanelElement()

    const feedbackDiv = createAndAddChildElement(this.#checkingHelperPanel!, 'div', ['feedback-subpanel', 'checking-helper-subpanel'])
    const quickSubmitDiv = createAndAddChildElement(this.#checkingHelperPanel!, 'div', ['quick-submit-subpanel', 'checking-helper-subpanel'])

    await this.#setupFeedbackSection(feedbackDiv)
    this.#setupQuickSubmit(quickSubmitDiv)
  }

  #insertCheckingHelperPanelElement(): void {
    const mainDiv = getMainDiv()
    const gradePanel = getGradePanel()
    this.#checkingHelperPanel = createElementWithClasses('div', ['checking-helper-panel'])
    mainDiv.insertBefore(this.#checkingHelperPanel, gradePanel.nextSibling)
  }

  async #setupFeedbackSection(parentDiv: HTMLElement): Promise<void> {
    createAndAddChildElement(parentDiv, 'h2', null, 'Tagasiside')

    const assignmentId = getAssignmentId()
    const data = await new FeedbackClient().getData(assignmentId)

    this.#feedbackManager = new FeedbackSectionRenderer(parentDiv, data)
    this.#feedbackManager.create()
  }

  #setupQuickSubmit(parentDiv: HTMLElement): void {
    this.#quickSubmitManager = new QuickSubmitRenderer(parentDiv, this.#feedbackManager!)
    this.#quickSubmitManager.create()
  }
}
