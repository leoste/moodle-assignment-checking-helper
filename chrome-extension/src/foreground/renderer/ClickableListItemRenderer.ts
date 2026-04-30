import { CommonAnswer, GradePart } from '../../types';
import { createAndAddChildElement, createAndAddChildImage } from '../pagemanager/element-creation-helper';

export class ClickableListItemRenderer {

    #list!: HTMLElement;
    #listItem!: CommonAnswer | GradePart['parts'][number];
    #listItemUpdatedCallback!: () => void;

    #addButton!: HTMLImageElement;
    #buttonsSection!: HTMLElement;

    setParameters(list: HTMLElement, item: CommonAnswer | GradePart['parts'][number]): void {
        this.#list = list;
        this.#listItem = item;
    }

    setItemUpdatedCallback(callback: () => void): void {
        this.#listItemUpdatedCallback = callback;
    }

    createItem(): void {
        const item = createAndAddChildElement(this.#list, 'li', 'clickable-list-item');
        const container = createAndAddChildElement(item, 'div', 'item-container');
        createAndAddChildElement(container, 'div', 'text-section', this.#listItem.text);
        this.#buttonsSection = createAndAddChildElement(container, 'div', 'buttons-section');
        this.createAddButton();
    }

    createAddButton(): void {
        const classList = ['add-button'];
        const extraClass = this.#listItem.enabled ? 'active' : 'inactive';
        classList.push(extraClass);
        this.#addButton = createAndAddChildImage(this.#buttonsSection, 'images/laughing-pointing-emoji.png', classList);
        this.#addButton.addEventListener('click', this.#addButtonOnClick);
    }

    #addButtonOnClick = (): void => {
        this.#toggleItem();
    };

    #toggleItem(): void {
        const newState = !this.#listItem.enabled;
        this.#listItem.enabled = newState;
        this.#addButton.classList.toggle('active', newState);
        this.#addButton.classList.toggle('inactive', !newState);
        this.#listItemUpdatedCallback();
    }
}
