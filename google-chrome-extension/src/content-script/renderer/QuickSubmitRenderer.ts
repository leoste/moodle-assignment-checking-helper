import { getSaveGradeAndShowNextButton } from '../pagemanager/assignment-moodle-helper';
import { FeedbackSectionRenderer } from './FeedbackSectionRenderer';
import { createAndAddChildImage } from '../pagemanager/element-creation-helper';

export class QuickSubmitRenderer {
  readonly #parentElement: HTMLElement
  readonly #feedbackManager: FeedbackSectionRenderer

  constructor(parentElement: HTMLElement, feedbackManager: FeedbackSectionRenderer) {
    this.#parentElement = parentElement
    this.#feedbackManager = feedbackManager
  }

  create(): void {
    const img = createAndAddChildImage(this.#parentElement, 'images/double-thumbs-up-emoji.png');
    img.addEventListener('click', () => {
      this.#feedbackManager.setPointsMax();
      this.#feedbackManager.setCommentEmpty();
      // this also automatically submits the comment
      getSaveGradeAndShowNextButton().click();
    }, {
      once: true
    });
  }

  destroy(): void {
    // TODO: implement removing listeners here
  }
}
