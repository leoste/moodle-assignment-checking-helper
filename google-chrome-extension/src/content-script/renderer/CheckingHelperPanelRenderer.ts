import { feedbackClient } from '../client/FeedbackClient';
import { FeedbackSectionRenderer } from './FeedbackSectionRenderer';
import type AssignmentGraderPage from '../pagemanager/AssignmentGraderPage';
import { createAndAddChildElement, createElementWithClasses } from '../../shared/util/element-creation-helper';
import BaseRenderer from '../../shared/renderer/BaseRenderer';

export default class CheckingHelperPanelRenderer extends BaseRenderer {
  readonly #page: AssignmentGraderPage

  #checkingHelperPanel: HTMLElement | undefined
  #feedbackDiv: HTMLElement | undefined
  #feedbackElement: HTMLElement | undefined

  #feedbackRenderer: FeedbackSectionRenderer | undefined

  constructor(page: AssignmentGraderPage) {
    super()
    this.#page = page
  }

  async clear() {
    this.#checkingHelperPanel?.remove()
    this.#feedbackDiv?.remove()
    this.#feedbackElement?.remove()

    await this.#feedbackRenderer?.clear()
  }

  async render() {
    await this.#setupCheckingHelperPanel()
  }

  async #setupCheckingHelperPanel() {
    this.#insertCheckingHelperPanelElement()

    this.#feedbackDiv = createAndAddChildElement(this.#checkingHelperPanel!, 'div', ['feedback-subpanel', 'checking-helper-subpanel'])

    await this.#setupFeedbackSection(this.#feedbackDiv)
  }

  #insertCheckingHelperPanelElement(): void {
    this.#checkingHelperPanel = createElementWithClasses('div', ['checking-helper-panel'])
    this.#page.insertPanel(this.#checkingHelperPanel)
  }

  async #setupFeedbackSection(parentDiv: HTMLElement) {
    this.#feedbackElement = createAndAddChildElement(parentDiv, 'h2', null, 'Tagasiside')

    const data = await feedbackClient.getData(this.#page.getAssignmentId())

    this.#feedbackRenderer = new FeedbackSectionRenderer(parentDiv, data, this.#page)
    this.#feedbackRenderer.render()
  }
}
