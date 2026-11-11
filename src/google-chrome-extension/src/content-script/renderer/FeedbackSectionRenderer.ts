import type { FeedbackView } from '../../shared/types/FeedbackView';
import { createAndAddChildElement } from '@shared/util/element-creation-helper';
import BaseRenderer from '@shared/renderer/BaseRenderer';
import { translations } from '@shared/translations/translations';
import { FeedbackPartListRenderer } from './FeedbackPartListRenderer';
import { CommentPrefixRenderer } from './CommentPrefixRenderer';

export interface FeedbackSectionCallbacks {
  onPartToggled: (feedbackIndex: number, partIndex: number, selected: boolean) => void
  onCommentPrefixChanged: (prefix: string) => void
}

export class FeedbackSectionRenderer extends BaseRenderer {
  readonly #parentElement: HTMLElement
  readonly #callbacks: FeedbackSectionCallbacks

  #feedbackRenderers: BaseRenderer[] = []
  #messageElement: HTMLElement | undefined

  constructor(parentElement: HTMLElement, callbacks: FeedbackSectionCallbacks) {
    super()

    this.#parentElement = parentElement
    this.#callbacks = callbacks
  }

  protected createRoot(): HTMLElement {
    return createAndAddChildElement(this.#parentElement, 'div', ['feedback-subpanel', 'checking-helper-subpanel'])
  }

  protected async renderContent(root: HTMLElement) {
    createAndAddChildElement(root, 'h2', null, translations.feedback.title)
    createAndAddChildElement(root, 'div', 'checking-helper-hint', translations.feedback.resizeHint)
  }

  // Replaces the feedback rendered before, e.g. when the definition was reloaded.
  async renderFeedback(feedback: FeedbackView[], commentPrefix: string) {
    await this.#clearFeedback()

    if (feedback.length === 0) {
      this.#messageElement = createAndAddChildElement(this.element, 'div', null, translations.feedback.notFound)
      return
    }

    this.#feedbackRenderers.push(new CommentPrefixRenderer(this.element, commentPrefix, this.#callbacks.onCommentPrefixChanged))
    for (const [feedbackIndex, item] of feedback.entries()) {
      const onPartToggled = (partIndex: number, selected: boolean) => this.#callbacks.onPartToggled(feedbackIndex, partIndex, selected)
      this.#feedbackRenderers.push(new FeedbackPartListRenderer(this.element, item, onPartToggled))
    }
    for (const renderer of this.#feedbackRenderers) {
      await renderer.render()
    }
  }

  async renderGradingElsewhere() {
    await this.#clearFeedback()
    this.#messageElement = createAndAddChildElement(this.element, 'div', null, translations.feedback.gradingElsewhere)
  }

  async #clearFeedback(): Promise<void> {
    this.#messageElement?.remove()
    this.#messageElement = undefined
    for (const renderer of this.#feedbackRenderers) {
      await renderer.clear()
    }
    this.#feedbackRenderers = []
  }
}
