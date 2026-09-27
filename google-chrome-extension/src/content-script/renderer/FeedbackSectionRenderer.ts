import type { Feedback } from '../../shared/types/Feedback';
import type { FeedbackPart } from '../../shared/types/FeedbackPart';
import deepCopy from '../../shared/util/deepCopy';
import type AssignmentGraderPage from '../pagemanager/AssignmentGraderPage';
import BaseRenderer from '../../shared/renderer/BaseRenderer';
import { ClickableListRenderer } from './ClickableListRenderer';
import { CommentPrefixRenderer } from './CommentPrefixRenderer';

export class FeedbackSectionRenderer extends BaseRenderer {
  readonly #parentElement: HTMLElement
  readonly #feedbackItems: Feedback[]
  readonly #page: AssignmentGraderPage

  #commentPrefixRenderer: CommentPrefixRenderer | undefined
  #clickableListRenderers: ClickableListRenderer[] = []

  constructor(parentElement: HTMLElement, feedbackItems: Feedback[] | undefined, page: AssignmentGraderPage) {
    super()

    this.#parentElement = parentElement
    this.#page = page
    this.#feedbackItems = deepCopy(feedbackItems ?? [])

    let idCounter = 0
    this.#feedbackItems.forEach(item => {
      item._id = ++idCounter
    })
  }

  async render() {
    this.#page.expandCommentSection()

    this.#commentPrefixRenderer = new CommentPrefixRenderer(this.#parentElement)
    this.#commentPrefixRenderer.setOnChangeCallback(() => this.#updateComment())
    await this.#commentPrefixRenderer.render()

    for (const item of this.#feedbackItems) {
        await this.#createFeedbackList(item)
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

  async #createFeedbackList(item: Feedback) {
    const onClickCallback = (parts: FeedbackPart[]) => this.#onFeedbackPartClick(parts, item._id!)

    const listRenderer = new ClickableListRenderer(
      this.#parentElement,
      onClickCallback,
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

  #onFeedbackPartClick(parts: FeedbackPart[], id: number): void {
    const item = this.#feedbackItems.find(i => i._id === id)
    if (item) item.parts = parts
    this.#updateGrade()
    this.#updateComment()
  }

  #updateGrade(): void {
    this.#calculateAndSetTotalPoints()
  }

  #updateComment(): void {
    this.#setCommentText(this.#buildCommentText())
  }

  #calculateAndSetTotalPoints(): void {
    const totalPoints = this.#feedbackItems.reduce((sum, item) => {
      return sum + item.parts.reduce((ps, p) => {
        return ps + (p.enabled ? (p.points ?? 0) : 0)
      }, 0)
    }, 0)
    this.#page.setGrade(String(totalPoints > 0 ? totalPoints : 100))
  }

  #buildCommentText(): string {
    const texts: string[] = []
    const prefix = this.#commentPrefixRenderer?.value
    if (prefix) texts.push(prefix)
    for (const item of this.#feedbackItems) {
      for (const part of item.parts) {
        if (part.enabled && part.enabledText) texts.push(part.enabledText)
        if (!part.enabled && part.disabledText) texts.push(part.disabledText)
      }
    }
    return texts.join('\n')
  }

  #setCommentText(text: string): void {
    this.#page.setComment(text)
  }
}
