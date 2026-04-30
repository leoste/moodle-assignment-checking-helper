import type { CommonAnswer, GradePart } from '../../types';
import { getCommentTextarea, getCommentLink } from '../pagemanager/assignment-moodle-helper';
import { ClickableListRenderer } from './ClickableListRenderer';


export class CommentSectionRenderer {

    #commonAnswers!: CommonAnswer[];
    #commentTextarea!: HTMLTextAreaElement;
    #parentElement!: HTMLElement;

    setParentElement(parentElement: HTMLElement): void {
        this.#parentElement = parentElement;
    }

    setCommonAnswers(commonAnswers: CommonAnswer[] | undefined): void {
        this.#commonAnswers = commonAnswers ?? [];
    }

    create(): void {
        const listManager = new ClickableListRenderer();
        listManager.setParentElement(this.#parentElement);

        this.#commentTextarea = getCommentTextarea();
        this.#expandCommentSection();

        const properties = {
            sectionDivClass: 'common-answer-section',
            sectionTitle: 'Tüüpvastused',
            listItemClass: 'common-answer-list'
        };
        const items = this.#commonAnswers;
        const onClickCallback = this.#onClickCallback;

        listManager.setParameters(onClickCallback, items, properties);
        listManager.create();
    }

    destroy(): void {
        // TODO: implement actual removal of callbacks, destruction of the list managers etc
    }

    setCommentEmpty(): void {
        this.#setCommentText('');
    }

    #onClickCallback = (states: CommonAnswer[] | GradePart['parts']): void => {
        this.#updateCommentText(states as CommonAnswer[]);
    };

    #updateCommentText(states: CommonAnswer[]): void {
        const text = this.#getCommonAnswerString(states);
        this.#setCommentText(text);
    }

    #setCommentText(text: string): void {
        this.#commentTextarea.value = text;
    }

    #getCommonAnswerString(states: CommonAnswer[]): string {
        const enabledTexts = states
            .filter(answer => answer.enabled)
            .map(answer => answer.text);
        return enabledTexts.join('\n');
    }

    #expandCommentSection(): void {
        const commentLink = getCommentLink();
        commentLink.click();
    }
}
