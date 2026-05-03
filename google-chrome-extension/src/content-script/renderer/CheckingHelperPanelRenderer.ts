import FeedbackClient from '../client/FeedbackClient';
import { QuickSubmitRenderer } from './QuickSubmitRenderer';
import { FeedbackSectionRenderer } from './FeedbackSectionRenderer';
import { getAssignmentId, getGradePanel, getMainDiv } from '../pagemanager/assignment-moodle-helper';
import { createAndAddChildElement, createElementWithClasses } from '../pagemanager/element-creation-helper';
import BaseRenderer from './BaseRenderer';

export default class CheckingHelperPanelRenderer extends BaseRenderer {
  #checkingHelperPanel: HTMLElement | undefined
  #feedbackDiv: HTMLElement | undefined
  #quickSubmitDiv: HTMLElement | undefined
  #feedbackElement: HTMLElement | undefined

  #feedbackRenderer: FeedbackSectionRenderer | undefined
  #quickSubmitRenderer: QuickSubmitRenderer | undefined

  async clear() {
    this.#checkingHelperPanel?.remove()
    this.#feedbackDiv?.remove()
    this.#quickSubmitDiv?.remove()
    this.#feedbackElement?.remove()

    await this.#feedbackRenderer?.clear()
    await this.#quickSubmitRenderer?.clear()
  }

  async render() {    
    await this.#setupCheckingHelperPanel()
  }

  async #setupCheckingHelperPanel() {
    this.#insertCheckingHelperPanelElement()

    this.#feedbackDiv = createAndAddChildElement(this.#checkingHelperPanel!, 'div', ['feedback-subpanel', 'checking-helper-subpanel'])
    this.#quickSubmitDiv = createAndAddChildElement(this.#checkingHelperPanel!, 'div', ['quick-submit-subpanel', 'checking-helper-subpanel'])

    await this.#setupFeedbackSection(this.#feedbackDiv)
    this.#setupQuickSubmit(this.#quickSubmitDiv)
  }

  #insertCheckingHelperPanelElement(): void {
    const mainDiv = getMainDiv()
    const gradePanel = getGradePanel()
    this.#checkingHelperPanel = createElementWithClasses('div', ['checking-helper-panel'])
    mainDiv.insertBefore(this.#checkingHelperPanel, gradePanel.nextSibling)
  }

  async #setupFeedbackSection(parentDiv: HTMLElement) {
    this.#feedbackElement = createAndAddChildElement(parentDiv, 'h2', null, 'Tagasiside')

    const assignmentId = getAssignmentId()
    const data = await new FeedbackClient().getData(assignmentId)

    this.#feedbackRenderer = new FeedbackSectionRenderer(parentDiv, data)
    this.#feedbackRenderer.render()
  }

  #setupQuickSubmit(parentDiv: HTMLElement) {
    this.#quickSubmitRenderer = new QuickSubmitRenderer(parentDiv, this.#feedbackRenderer!)
    this.#quickSubmitRenderer.render()
  }
}
