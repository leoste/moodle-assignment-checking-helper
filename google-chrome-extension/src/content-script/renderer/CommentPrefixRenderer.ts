import { createAndAddChildElement } from '../../shared/util/element-creation-helper';
import BaseRenderer from '../../shared/renderer/BaseRenderer';

export class CommentPrefixRenderer extends BaseRenderer {
  readonly #parentElement: HTMLElement
  #onChangeCallback: ((prefix: string) => void) | undefined

  #section: HTMLElement | undefined
  #textarea: HTMLTextAreaElement | undefined

  constructor(parentElement: HTMLElement) {
    super()
    this.#parentElement = parentElement
  }

  setOnChangeCallback(callback: (prefix: string) => void): void {
    this.#onChangeCallback = callback
  }

  async render() {
    this.#section = createAndAddChildElement(this.#parentElement, 'div', 'comment-prefix-section')
    createAndAddChildElement(this.#section, 'h3', null, 'Kommentaari algus')
    const itemContainer = createAndAddChildElement(this.#section, 'div', 'item-container')
    this.#textarea = createAndAddChildElement(itemContainer, 'textarea', 'comment-prefix-textarea') as HTMLTextAreaElement
    createAndAddChildElement(itemContainer, 'div', 'buttons-section')
    this.#textarea.addEventListener('input', this.#onInput)
  }

  async clear() {
    this.#textarea?.removeEventListener('input', this.#onInput)
    this.#section?.remove()
    this.#onChangeCallback = undefined
  }

  #onInput = (): void => {
    this.#onChangeCallback?.(this.#textarea!.value)
  }
}
