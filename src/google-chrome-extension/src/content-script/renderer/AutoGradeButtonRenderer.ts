import { createAndAddChildElement } from '@shared/util/element-creation-helper';
import BaseRenderer from '@shared/renderer/BaseRenderer';
import { translations } from '@shared/translations/translations';

export class AutoGradeButtonRenderer extends BaseRenderer {
  readonly #parentElement: HTMLElement
  readonly #onClick: () => void

  constructor(parentElement: HTMLElement, onClick: () => void) {
    super()
    this.#parentElement = parentElement
    this.#onClick = onClick
  }

  protected createRoot(): HTMLElement {
    const button = createAndAddChildElement(
      this.#parentElement,
      'button',
      ['auto-max-button', 'checking-helper-button', 'checking-helper-interactive'],
      translations.quizAutoGrade.assignMaxPoints,
    )
    button.addEventListener('click', this.#onClick)
    return button
  }
}
