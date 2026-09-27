import { createAndAddChildElement } from '../../shared/util/element-creation-helper';
import BaseRenderer from '../../shared/renderer/BaseRenderer';

export class AutoGradeButtonRenderer extends BaseRenderer {
  readonly #parentElement: HTMLElement
  readonly #onClick: () => void

  #button: HTMLElement | undefined

  constructor(parentElement: HTMLElement, onClick: () => void) {
    super()
    this.#parentElement = parentElement
    this.#onClick = onClick
  }

  async render() {
    this.#button = createAndAddChildElement(this.#parentElement, 'button', 'auto-max-button', 'Assign max points with no comment')
    this.#button.addEventListener('click', this.#onClick)
  }

  async clear() {
    this.#button?.removeEventListener('click', this.#onClick)
    this.#button?.remove()
  }
}
