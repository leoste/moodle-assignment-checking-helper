import type { Feedback } from '../../shared/types/Feedback';
import { createAndAddChildElement } from '../../shared/util/element-creation-helper';
import BaseRenderer from '../../shared/renderer/BaseRenderer';
import { FeedbackPartRenderer } from './FeedbackPartRenderer';
import { translations } from '@shared/translations/translations';

export class FeedbackPartListRenderer extends BaseRenderer {
  readonly #parentElement: HTMLElement
  readonly #feedback: Feedback
  readonly #onPartToggled: (partIndex: number, enabled: boolean) => void

  constructor(
    parentElement: HTMLElement,
    feedback: Feedback,
    onPartToggled: (partIndex: number, enabled: boolean) => void
  ) {
    super()

    this.#parentElement = parentElement
    this.#feedback = feedback
    this.#onPartToggled = onPartToggled
  }

  protected createRoot(): HTMLElement {
    return createAndAddChildElement(this.#parentElement, 'div', 'common-answer-section')
  }

  protected async renderContent(root: HTMLElement) {
    createAndAddChildElement(root, 'h3', null, `${this.#feedback.title} (${translations.feedback.points(this.#feedback.intended_max_points)})`)
    const list = createAndAddChildElement(root, 'ul', 'common-answer-list')

    for (const [index, part] of this.#feedback.parts.entries()) {
      await new FeedbackPartRenderer(list, part, enabled => this.#onPartToggled(index, enabled)).render()
    }
  }
}
