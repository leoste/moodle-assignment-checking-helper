import type { CommonAnswer } from '../../shared/types/CommonAnswer';
import type { GradePart } from '../../shared/types/GradePart';
import { getCommentTextarea, getCommentLink } from '../pagemanager/assignment-moodle-helper';
import { ClickableListRenderer } from './ClickableListRenderer';


export class CommentSectionRenderer {
  readonly #parentElement: HTMLElement
  readonly #commonAnswers: CommonAnswer[]
  #commentTextarea!: HTMLTextAreaElement

  constructor(parentElement: HTMLElement, commonAnswers: CommonAnswer[] | undefined) {
    this.#parentElement = parentElement
    this.#commonAnswers = commonAnswers ?? []
  }

  create(): void {
    this.#commentTextarea = getCommentTextarea();
    this.#expandCommentSection();

    const listRenderer = new ClickableListRenderer(
      this.#parentElement,
      this.#onClickCallback,
      this.#commonAnswers,
      {
        sectionDivClass: 'common-answer-section',
        sectionTitle: 'Tüüpvastused',
        listItemClass: 'common-answer-list',
      }
    );
    listRenderer.create();
  }

  destroy(): void {
    // TODO: implement actual removal of callbacks, destruction of the list managers etc
  }

  setCommentEmpty(): void {
    this.#setCommentText('');
  }

  #onClickCallback = (states: CommonAnswer[] | GradePart['parts']): void => {
    this.#updateCommentText(states as CommonAnswer[]);
  };

  #updateCommentText(states: CommonAnswer[]): void {
    const text = this.#getCommonAnswerString(states);
    this.#setCommentText(text);
  }

  #setCommentText(text: string): void {
    this.#commentTextarea.value = text;
  }

  #getCommonAnswerString(states: CommonAnswer[]): string {
    const enabledTexts = states
      .filter(answer => answer.enabled)
      .map(answer => answer.text);
    return enabledTexts.join('\n');
  }

  #expandCommentSection(): void {
    const commentLink = getCommentLink();
    commentLink.click();
  }
}
