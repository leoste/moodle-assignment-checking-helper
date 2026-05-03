import type { CommonAnswer } from '../../shared/types/CommonAnswer';
import type { GradePart } from '../../shared/types/GradePart';
import { createElementWithClasses, createAndAddChildElement } from '../pagemanager/element-creation-helper';
import { ClickableListItemRenderer } from './ClickableListItemRenderer';

interface ClickableListProperties {
  sectionDivClass: string
  sectionTitle: string
  listItemClass: string
}

export class ClickableListRenderer {
  readonly #parentElement: HTMLElement
  readonly #onClickCallback: (states: CommonAnswer[] | GradePart['parts']) => void
  readonly #states: CommonAnswer[] | GradePart['parts']
  readonly #properties: ClickableListProperties

  #list!: HTMLElement

  constructor(
    parentElement: HTMLElement,
    onClickCallback: (states: CommonAnswer[] | GradePart['parts']) => void,
    items: CommonAnswer[] | GradePart['parts'],
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

  #createItem = (item: CommonAnswer | GradePart['parts'][number]): void => {
    const renderer = new ClickableListItemRenderer(this.#list, item);
    renderer.setItemUpdatedCallback(this.#itemUpdatedCallback);
    renderer.createItem();
  };

  #itemUpdatedCallback = (): void => {
    this.#onClickCallback(this.#states);
  };
}
