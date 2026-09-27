import type { Feedback } from '../../shared/types/Feedback';
import BaseRenderer from '../../shared/renderer/BaseRenderer';
import { ClickableListRenderer } from './ClickableListRenderer';
import { CommentPrefixRenderer } from './CommentPrefixRenderer';

export interface FeedbackSectionCallbacks {
  onPartToggled: (feedbackIndex: number, partIndex: number, enabled: boolean) => void
  onCommentPrefixChanged: (prefix: string) => void
}

export class FeedbackSectionRenderer extends BaseRenderer {
  readonly #parentElement: HTMLElement
  readonly #feedbackItems: Feedback[]
  readonly #callbacks: FeedbackSectionCallbacks

  #commentPrefixRenderer: CommentPrefixRenderer | undefined
  #clickableListRenderers: ClickableListRenderer[] = []

  constructor(parentElement: HTMLElement, feedbackItems: Feedback[], callbacks: FeedbackSectionCallbacks) {
    super()

    this.#parentElement = parentElement
    this.#feedbackItems = feedbackItems
    this.#callbacks = callbacks
  }

  async render() {
    this.#commentPrefixRenderer = new CommentPrefixRenderer(this.#parentElement)
    this.#commentPrefixRenderer.setOnChangeCallback(this.#callbacks.onCommentPrefixChanged)
    await this.#commentPrefixRenderer.render()

    for (const [index, item] of this.#feedbackItems.entries()) {
        await this.#createFeedbackList(item, index)
    }
  }

  async clear() {
    await this.#commentPrefixRenderer?.clear()
    this.#commentPrefixRenderer = undefined
    for (const renderer of this.#clickableListRenderers) {
        await renderer.clear()
    }
    this.#clickableListRenderers = []
  }

  async #createFeedbackList(item: Feedback, feedbackIndex: number) {
    const listRenderer = new ClickableListRenderer(
      this.#parentElement,
      (partIndex, enabled) => this.#callbacks.onPartToggled(feedbackIndex, partIndex, enabled),
      item.parts,
      {
        sectionDivClass: 'common-answer-section',
        sectionTitle: `${item.title} (${item.max_points}p)`,
        listItemClass: 'common-answer-list',
      }
    )
    this.#clickableListRenderers.push(listRenderer)

    await listRenderer.render()
  }
}
