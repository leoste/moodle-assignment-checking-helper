import CommonAnswersClient from "../client/CommonAnswerClient";
import GradePartsClient from "../client/GradePartsClient";
import { QuickSubmitRenderer } from './QuickSubmitRenderer';
import { GradeSectionRenderer } from './GradeSectionRenderer';
import { CommentSectionRenderer } from './CommentSectionRenderer';
import { getAssignmentId, getGradePanel, getMainDiv } from "../pagemanager/assignment-moodle-helper";
import { createAndAddChildElement, createElementWithClasses } from "../pagemanager/element-creation-helper";

export default class CheckingHelperPanelRenderer {

    constructor() {
        console.log("uus constructor mehed");
        this.#gradeManager = new GradeSectionRenderer();
        this.#commentManager = new CommentSectionRenderer();
        this.#quickSubmitManager = new QuickSubmitRenderer();
    }

    #checkingHelperPanel: HTMLElement | undefined;
    #gradeManager: GradeSectionRenderer;
    #commentManager: CommentSectionRenderer;
    #quickSubmitManager: QuickSubmitRenderer;

    async render(): Promise<void> {
        this.#gradeManager.destroy();
        this.#commentManager.destroy();
        this.#quickSubmitManager.destroy();
        this.#checkingHelperPanel?.remove();
        void this.#setupCheckingHelperPanel();
    }

    async #setupCheckingHelperPanel(): Promise<void> {
        this.#insertCheckingHelperPanelElement();

        const leftDiv = createAndAddChildElement(this.#checkingHelperPanel!, 'div', ['grade-subpanel', 'checking-helper-subpanel']);
        const rightDiv = createAndAddChildElement(this.#checkingHelperPanel!, 'div', ['common-answer-subpanel', 'checking-helper-subpanel']);
        const rightBottomDiv = createAndAddChildElement(this.#checkingHelperPanel!, 'div', ['quick-submit-subpanel', 'checking-helper-subpanel']);

        void this.#setupGradeSection(leftDiv);
        void this.#setupCommentSection(rightDiv);
        void this.#setupQuickSubmit(rightBottomDiv);
    }

    #insertCheckingHelperPanelElement(): void {
        const mainDiv = getMainDiv();
        const gradePanel = getGradePanel();
        this.#checkingHelperPanel = createElementWithClasses('div', ['checking-helper-panel']);
        mainDiv.insertBefore(this.#checkingHelperPanel, gradePanel.nextSibling);
    }

    async #setupQuickSubmit(parentDiv: HTMLElement): Promise<void> {
        this.#quickSubmitManager.setParentElement(parentDiv);
        this.#quickSubmitManager.setOtherManagers(this.#gradeManager, this.#commentManager);
        this.#quickSubmitManager.create();
    }

    async #setupGradeSection(parentDiv: HTMLElement): Promise<void> {
        createAndAddChildElement(parentDiv, 'h2', null, 'Hinde kujunemine');

        // TODO: move fetching into component probably
        const assignmentId = getAssignmentId();
        const fetcher = new GradePartsClient();
        const data = await fetcher.getData(assignmentId);
        this.#gradeManager.setParentElement(parentDiv);
        this.#gradeManager.setGradeParts(data);
        this.#gradeManager.create();
    }

    async #setupCommentSection(parentDiv: HTMLElement): Promise<void> {
        createAndAddChildElement(parentDiv, 'h2', null, 'Kommentaari koostamine');

        // TODO: move fetching into component probably
        const assignmentId = getAssignmentId();
        const fetcher = new CommonAnswersClient();
        const data = await fetcher.getData(assignmentId);
        this.#commentManager.setParentElement(parentDiv);
        this.#commentManager.setCommonAnswers(data);
        this.#commentManager.create();
    }
}
