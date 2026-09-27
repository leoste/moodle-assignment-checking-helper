import type { Feedback } from '../../shared/types/Feedback';
import { FeedbackSectionRenderer, type FeedbackSectionCallbacks } from './FeedbackSectionRenderer';
import { createElementWithClasses } from '../../shared/util/element-creation-helper';
import BaseRenderer from '../../shared/renderer/BaseRenderer';

export default class CheckingHelperPanelRenderer extends BaseRenderer {
  readonly #callbacks: FeedbackSectionCallbacks

  #feedbackSectionRenderer: FeedbackSectionRenderer | undefined

  constructor(callbacks: FeedbackSectionCallbacks) {
    super()
    this.#callbacks = callbacks
  }

  protected createRoot(): HTMLElement {
    return createElementWithClasses('div', ['checking-helper-panel'])
  }

  protected async renderContent(root: HTMLElement) {
    this.#feedbackSectionRenderer = new FeedbackSectionRenderer(root, this.#callbacks)
    await this.#feedbackSectionRenderer.render()
  }

  async renderFeedback(feedback: Feedback[]) {
    await this.#feedbackSectionRenderer!.renderFeedback(feedback)
  }
}
