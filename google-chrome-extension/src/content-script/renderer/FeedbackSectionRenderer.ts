import type { Feedback } from '../../shared/types/Feedback';
import { createAndAddChildElement } from '../../shared/util/element-creation-helper';
import BaseRenderer from '../../shared/renderer/BaseRenderer';
import { translations } from '@shared/translations/translations';
import { FeedbackPartListRenderer } from './FeedbackPartListRenderer';
import { CommentPrefixRenderer } from './CommentPrefixRenderer';

export interface FeedbackSectionCallbacks {
  onPartToggled: (feedbackIndex: number, partIndex: number, enabled: boolean) => void
  onCommentPrefixChanged: (prefix: string) => void
}

export class FeedbackSectionRenderer extends BaseRenderer {
  readonly #parentElement: HTMLElement
  readonly #callbacks: FeedbackSectionCallbacks

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
  }

  async renderFeedback(feedback: Feedback[]) {
    await new CommentPrefixRenderer(this.element, this.#callbacks.onCommentPrefixChanged).render()

    for (const [feedbackIndex, item] of feedback.entries()) {
      const onPartToggled = (partIndex: number, enabled: boolean) => this.#callbacks.onPartToggled(feedbackIndex, partIndex, enabled)
      await new FeedbackPartListRenderer(this.element, item, onPartToggled).render()
    }
  }
}
