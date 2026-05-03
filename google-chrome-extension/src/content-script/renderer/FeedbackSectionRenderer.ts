import type { Feedback } from '../../shared/types/Feedback';
import type { FeedbackPart } from '../../shared/types/FeedbackPart';
import deepCopy from '../../shared/util/deepCopy';
import { getGradeInput, getCommentTextarea, getCommentLink } from '../pagemanager/assignment-moodle-helper';
import { ClickableListRenderer } from './ClickableListRenderer';

export class FeedbackSectionRenderer {
  readonly #parentElement: HTMLElement
  readonly #feedbackItems: Feedback[]
  #gradeInput!: HTMLInputElement
  #commentTextarea!: HTMLTextAreaElement

  constructor(parentElement: HTMLElement, feedbackItems: Feedback[] | undefined) {
    this.#parentElement = parentElement
    this.#feedbackItems = deepCopy(feedbackItems ?? [])

    let idCounter = 0
    this.#feedbackItems.forEach(item => {
      item._id = ++idCounter
    })
  }

  create(): void {
    this.#gradeInput = getGradeInput()
    this.#commentTextarea = getCommentTextarea()
    this.#expandCommentSection()
    this.#feedbackItems.forEach(item => this.#createFeedbackList(item))
  }

  destroy(): void {
    // TODO: implement actual removal of callbacks, destruction of the list renderers etc
  }

  setPointsMax(): void {
    this.#calculateAndSetTotalPoints(true)
  }

  setCommentEmpty(): void {
    this.#setCommentText('')
  }

  #createFeedbackList(item: Feedback): void {
    const onClickCallback = (parts: FeedbackPart[]) => this.#onFeedbackPartClick(parts, item._id!)

    const listRenderer = new ClickableListRenderer(
      this.#parentElement,
      onClickCallback,
      item.parts,
      {
        sectionDivClass: 'common-answer-section',
        sectionTitle: `${item.title} (${item.max.points}p)`,
        listItemClass: 'common-answer-list',
      }
    )
    listRenderer.create()
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

  #calculateAndSetTotalPoints(overrideEnabledTrue?: boolean): void {
    const totalPoints = this.#feedbackItems.reduce((sum, item) => {
      return sum + item.parts.reduce((ps, p) => {
        return ps + ((p.enabled || overrideEnabledTrue) ? (p.points ?? 0) : 0)
      }, 0)
    }, 0)
    this.#gradeInput.value = String(totalPoints > 0 ? totalPoints : 100)
  }

  #buildCommentText(): string {
    const texts: string[] = []
    for (const item of this.#feedbackItems) {
      for (const part of item.parts) {
        if (part.enabled && part.text && !part.textDisabled) texts.push(part.text)
      }
    }
    return texts.join('\n')
  }

  #setCommentText(text: string): void {
    this.#commentTextarea.value = text
  }

  #expandCommentSection(): void {
    getCommentLink().click()
  }
}
