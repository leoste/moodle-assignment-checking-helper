import { getSaveGradeAndShowNextButton } from '../pagemanager/assignment-moodle-helper';
import { CommentSectionRenderer } from './CommentSectionRenderer';
import { createAndAddChildImage } from '../pagemanager/element-creation-helper';
import { GradeSectionRenderer } from './GradeSectionRenderer';


export class QuickSubmitRenderer {
    #gradeManager!: GradeSectionRenderer;
    #commentManager!: CommentSectionRenderer;
    #parentElement!: HTMLElement;

    setParentElement(element: HTMLElement): void {
        this.#parentElement = element;
    }

    setOtherManagers(gradeManager: GradeSectionRenderer, commentManager: CommentSectionRenderer): void {
        this.#gradeManager = gradeManager;
        this.#commentManager = commentManager;
    }

    create(): void {
        const img = createAndAddChildImage(this.#parentElement, 'images/double-thumbs-up-emoji.png');
        img.addEventListener('click', () => {
            this.#gradeManager.setPointsMax();
            this.#commentManager.setCommentEmpty();
            // this also automatically submits the comment
            getSaveGradeAndShowNextButton().click();
        }, {
            once: true
        });
    }

    destroy(): void {
        // TODO: implement removing listeners here
    }
}
