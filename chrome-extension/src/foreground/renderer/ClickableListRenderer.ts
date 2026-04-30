import type { CommonAnswer, GradePart } from '../../types';
import { createElementWithClasses, createAndAddChildElement } from '../pagemanager/element-creation-helper';
import { ClickableListItemRenderer } from './ClickableListItemRenderer';


export class ClickableListRenderer {

    #states!: CommonAnswer[] | GradePart['parts'];
    #list!: HTMLElement;
    #onClickCallback!: (states: CommonAnswer[] | GradePart['parts']) => void;
    #properties!: { sectionDivClass: string; sectionTitle: string; listItemClass: string; };
    #parentElement!: HTMLElement;

    setParentElement(parentElement: HTMLElement): void {
        this.#parentElement = parentElement;
    }

    setParameters(
        onClickCallback: (states: CommonAnswer[] | GradePart['parts']) => void,
        items: CommonAnswer[] | GradePart['parts'],
        properties: { sectionDivClass: string; sectionTitle: string; listItemClass: string; }
    ): void {
        this.#onClickCallback = onClickCallback;
        this.#states = items;
        this.#properties = properties;
    }

    create(): void {
        const section = createElementWithClasses('div', [this.#properties.sectionDivClass]);
        createAndAddChildElement(section, 'h3', null, this.#properties.sectionTitle);
        this.#list = createAndAddChildElement(section, 'ul', this.#properties.listItemClass);
        this.#states.forEach(this.#createItem);
        this.#ItemUpdatedCallback();
        this.#parentElement.appendChild(section);
    }

    destroy(): void {
        // TODO: implement
    }

    #createItem = (item: CommonAnswer | GradePart['parts'][number]): void => {
        const manager = new ClickableListItemRenderer();
        manager.setParameters(this.#list, item);
        manager.setItemUpdatedCallback(this.#ItemUpdatedCallback);
        manager.createItem();
    };

    #ItemUpdatedCallback = (): void => {
        this.#onClickCallback(this.#states);
    };
}
