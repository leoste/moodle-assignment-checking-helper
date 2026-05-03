import { getSaveGradeAndShowNextButton } from '../pagemanager/assignment-moodle-helper';
import { FeedbackSectionRenderer } from './FeedbackSectionRenderer';
import { createAndAddChildImage } from '../pagemanager/element-creation-helper';
import BaseRenderer from './BaseRenderer';

export class QuickSubmitRenderer extends BaseRenderer {
  readonly #parentElement: HTMLElement
  readonly #feedbackManager: FeedbackSectionRenderer

  #onClick!: () => void
  #img: HTMLElement | undefined

  constructor(parentElement: HTMLElement, feedbackRenderer: FeedbackSectionRenderer) {
    super()

    this.#parentElement = parentElement
    this.#feedbackManager = feedbackRenderer
  }

  async render() {
    this.#img = createAndAddChildImage(this.#parentElement, 'images/double-thumbs-up-emoji.png');
    this.#onClick = () => {
      this.#feedbackManager.setPointsMax();
      this.#feedbackManager.setCommentEmpty();
      // this also automatically submits the comment
      getSaveGradeAndShowNextButton().click();
    }
    this.#img.addEventListener('click', this.#onClick, {
      once: true
    });
  }

  async clear() {
    this.#img!.removeEventListener('click', this.#onClick)
    this.#img?.remove()
  }
}
