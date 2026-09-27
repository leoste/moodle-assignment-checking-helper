import type { Feedback } from '../../shared/types/Feedback';
import { FeedbackSectionRenderer, type FeedbackSectionCallbacks } from './FeedbackSectionRenderer';
import { createAndAddChildElement, createElementWithClasses } from '../../shared/util/element-creation-helper';
import BaseRenderer from '../../shared/renderer/BaseRenderer';

export default class CheckingHelperPanelRenderer extends BaseRenderer {
  readonly #callbacks: FeedbackSectionCallbacks

  #checkingHelperPanel: HTMLElement | undefined
  #feedbackDiv: HTMLElement | undefined
  #feedbackElement: HTMLElement | undefined

  #feedbackRenderer: FeedbackSectionRenderer | undefined

  constructor(callbacks: FeedbackSectionCallbacks) {
    super()
    this.#callbacks = callbacks
  }

  get element(): HTMLElement {
    return this.#checkingHelperPanel!
  }

  async clear() {
    this.#checkingHelperPanel?.remove()
    this.#feedbackDiv?.remove()
    this.#feedbackElement?.remove()

    await this.#feedbackRenderer?.clear()
  }

  async render() {
    this.#checkingHelperPanel = createElementWithClasses('div', ['checking-helper-panel'])
    this.#feedbackDiv = createAndAddChildElement(this.#checkingHelperPanel, 'div', ['feedback-subpanel', 'checking-helper-subpanel'])
    this.#feedbackElement = createAndAddChildElement(this.#feedbackDiv, 'h2', null, 'Tagasiside')
  }

  async renderFeedback(feedback: Feedback[]) {
    this.#feedbackRenderer = new FeedbackSectionRenderer(this.#feedbackDiv!, feedback, this.#callbacks)
    await this.#feedbackRenderer.render()
  }
}
