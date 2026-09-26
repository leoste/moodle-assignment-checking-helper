import type { FeedbackPart } from '../../shared/types/FeedbackPart';
import { createAndAddChildElement, createAndAddChildImage } from '../../shared/util/element-creation-helper';
import BaseRenderer from '../../shared/renderer/BaseRenderer';

const ADD_BUTTON_IMAGE_PATH = 'images/double-thumbs-up-emoji.png'

export class ClickableListItemRenderer extends BaseRenderer {
  readonly #list: HTMLElement
  readonly #listItem: FeedbackPart
  #itemUpdatedCallback: (() => void) | undefined

  #addButton: HTMLImageElement | undefined
  #buttonsSection: HTMLElement | undefined

  #item: HTMLElement | undefined
  #container: HTMLElement | undefined
  #otherContainer: HTMLElement | undefined  

  constructor(list: HTMLElement, item: FeedbackPart) {
    super()

    this.#list = list
    this.#listItem = item
  }

  setItemUpdatedCallback(callback: () => void): void {
    this.#itemUpdatedCallback = callback
  }

  async render() {
    this.#item = createAndAddChildElement(this.#list, 'li', 'clickable-list-item');
    this.#container = createAndAddChildElement(this.#item, 'div', 'item-container');
    this.#otherContainer = createAndAddChildElement(this.#container, 'div', 'text-section', this.#getDisplayText());
    this.#buttonsSection = createAndAddChildElement(this.#container, 'div', 'buttons-section');
    this.createAddButton();
  }

  async clear() {
    this.#itemUpdatedCallback = undefined
    this.#item?.remove()
    this.#container?.remove()
    this.#otherContainer?.remove()
    this.#addButton!.removeEventListener('click', this.#addButtonOnClick);
    this.#addButton?.remove()
    this.#buttonsSection?.remove()
  }

  createAddButton(): void {
    const classList = ['add-button'];
    const extraClass = this.#listItem.enabled ? 'active' : 'inactive';
    classList.push(extraClass);
    this.#addButton = createAndAddChildImage(this.#buttonsSection!, ADD_BUTTON_IMAGE_PATH, classList);
    this.#addButton.addEventListener('click', this.#addButtonOnClick);
  }

  #getDisplayText(): string | null {
    const lines: string[] = []
    if (this.#listItem.labelText) lines.push(`label: ${this.#listItem.labelText}`)
    if (this.#listItem.enabledText) lines.push(`enabled: ${this.#listItem.enabledText}`)
    if (this.#listItem.disabledText) lines.push(`disabled: ${this.#listItem.disabledText}`)
    if (this.#listItem.points) {
      if (lines.length > 0) lines[0] += ` (${this.#listItem.points}p)`
      else lines.push(`(${this.#listItem.points}p)`)
    }
    return lines.length > 0 ? lines.join('\n') : null
  }

  #addButtonOnClick = (): void => {
    this.#toggleItem();
  };

  #toggleItem(): void {
    const newState = !this.#listItem.enabled;
    this.#listItem.enabled = newState;
    this.#addButton!.classList.toggle('active', newState);
    this.#addButton!.classList.toggle('inactive', !newState);
    this.#itemUpdatedCallback!();
  }
}
