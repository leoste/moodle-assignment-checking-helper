import type { FeedbackPart } from '../../shared/types/FeedbackPart';
import { createElementWithClasses, createAndAddChildElement } from '../pagemanager/element-creation-helper';
import { ClickableListItemRenderer } from './ClickableListItemRenderer';

interface ClickableListProperties {
  sectionDivClass: string
  sectionTitle: string
  listItemClass: string
}

export class ClickableListRenderer {
  readonly #parentElement: HTMLElement
  readonly #onClickCallback: (states: FeedbackPart[]) => void
  readonly #states: FeedbackPart[]
  readonly #properties: ClickableListProperties

  #list!: HTMLElement

  constructor(
    parentElement: HTMLElement,
    onClickCallback: (states: FeedbackPart[]) => void,
    items: FeedbackPart[],
    properties: ClickableListProperties
  ) {
    this.#parentElement = parentElement
    this.#onClickCallback = onClickCallback
    this.#states = items
    this.#properties = properties
  }

  create(): void {
    const section = createElementWithClasses('div', [this.#properties.sectionDivClass]);
    createAndAddChildElement(section, 'h3', null, this.#properties.sectionTitle);
    this.#list = createAndAddChildElement(section, 'ul', this.#properties.listItemClass);
    this.#states.forEach(this.#createItem);
    this.#itemUpdatedCallback();
    this.#parentElement.appendChild(section);
  }

  destroy(): void {
    // TODO: implement
  }

  #createItem = (item: FeedbackPart): void => {
    const renderer = new ClickableListItemRenderer(this.#list, item);
    renderer.setItemUpdatedCallback(this.#itemUpdatedCallback);
    renderer.createItem();
  };

  #itemUpdatedCallback = (): void => {
    this.#onClickCallback(this.#states);
  };
}
