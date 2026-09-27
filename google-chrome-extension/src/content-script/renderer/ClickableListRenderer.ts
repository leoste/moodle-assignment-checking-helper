import type { FeedbackPart } from '../../shared/types/FeedbackPart';
import { createElementWithClasses, createAndAddChildElement } from '../../shared/util/element-creation-helper';
import BaseRenderer from '../../shared/renderer/BaseRenderer';
import { ClickableListItemRenderer } from './ClickableListItemRenderer';

interface ClickableListProperties {
  sectionDivClass: string
  sectionTitle: string
  listItemClass: string
}

export class ClickableListRenderer extends BaseRenderer {
  readonly #parentElement: HTMLElement
  readonly #onItemToggled: (itemIndex: number, enabled: boolean) => void
  readonly #parts: FeedbackPart[]
  readonly #properties: ClickableListProperties


  #section: HTMLElement | undefined
  #header: HTMLElement | undefined
  #list: HTMLElement | undefined

  #renderers: ClickableListItemRenderer[] = []

  constructor(
    parentElement: HTMLElement,
    onItemToggled: (itemIndex: number, enabled: boolean) => void,
    items: FeedbackPart[],
    properties: ClickableListProperties
  ) {
    super()

    this.#parentElement = parentElement
    this.#onItemToggled = onItemToggled
    this.#parts = items
    this.#properties = properties
  }

  async render() {
    this.#section = createElementWithClasses('div', [this.#properties.sectionDivClass]);
    this.#header = createAndAddChildElement(this.#section, 'h3', null, this.#properties.sectionTitle);
    this.#list = createAndAddChildElement(this.#section, 'ul', this.#properties.listItemClass);

    for (const [index, part] of this.#parts.entries()) {
        await this.#createItem(part, index)
    }

    this.#parentElement.appendChild(this.#section);
  }

  async clear() {
    this.#section?.remove()
    this.#header?.remove()
    this.#list?.remove()

    for (const renderer of this.#renderers) {
        await renderer.clear()
    }
    this.#renderers = []
  }

  #createItem = async (item: FeedbackPart, index: number) => {
    const renderer = new ClickableListItemRenderer(this.#list!, item);
    this.#renderers.push(renderer)
    renderer.setItemToggledCallback(enabled => this.#onItemToggled(index, enabled));
    await renderer.render();
  };
}
