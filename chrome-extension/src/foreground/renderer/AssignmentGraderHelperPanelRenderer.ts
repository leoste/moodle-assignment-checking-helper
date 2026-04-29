import type { CommonAnswer, GradePart } from '../../types'
import { createElementWithClasses, createAndAddChildElement, createAndAddChildImage } from '../pagemanager/assignment-element-helper'
import deepCopy from '../../util/deepCopy'
import {
  getMainDiv,
  getGradePanel,
  getCommentLink,
  getCommentTextarea,
  getGradeInput,
  getSaveGradeAndShowNextButton,
  getAssignmentId,
} from '../pagemanager/assignment-moodle-helper'
import CommonAnswersClient from '../client/CommonAnswerClient'
import GradePartsClient from '../client/GradePartsClient'

class ClickableListManager {

  #states!: CommonAnswer[] | GradePart['parts']
  #list!: HTMLElement
  #onClickCallback!: (states: CommonAnswer[] | GradePart['parts']) => void
  #properties!: { sectionDivClass: string; sectionTitle: string; listItemClass: string }
  #parentElement!: HTMLElement

  setParentElement(parentElement: HTMLElement): void {
    this.#parentElement = parentElement
  }

  setParameters(
    onClickCallback: (states: CommonAnswer[] | GradePart['parts']) => void,
    items: CommonAnswer[] | GradePart['parts'],
    properties: { sectionDivClass: string; sectionTitle: string; listItemClass: string }
  ): void {
    this.#onClickCallback = onClickCallback
    this.#states = items
    this.#properties = properties
  }

  create(): void {
    const section = createElementWithClasses('div', [this.#properties.sectionDivClass])
    createAndAddChildElement(section, 'h3', null, this.#properties.sectionTitle)
    this.#list = createAndAddChildElement(section, 'ul', this.#properties.listItemClass)
    this.#states.forEach(this.#createItem)
    this.#ItemUpdatedCallback()
    this.#parentElement.appendChild(section)
  }

  destroy(): void {
    // TODO: implement
  }

  #createItem = (item: CommonAnswer | GradePart['parts'][number]): void => {
    const manager = new ClickableListItemManager()
    manager.setParameters(this.#list, item)
    manager.setItemUpdatedCallback(this.#ItemUpdatedCallback)
    manager.createItem()
  }

  #ItemUpdatedCallback = (): void => {
    this.#onClickCallback(this.#states)
  }
}

class ClickableListItemManager {

  #list!: HTMLElement
  #listItem!: CommonAnswer | GradePart['parts'][number]
  #listItemUpdatedCallback!: () => void

  #addButton!: HTMLImageElement
  #buttonsSection!: HTMLElement

  setParameters(list: HTMLElement, item: CommonAnswer | GradePart['parts'][number]): void {
    this.#list = list
    this.#listItem = item
  }

  setItemUpdatedCallback(callback: () => void): void {
    this.#listItemUpdatedCallback = callback
  }

  createItem(): void {
    const item = createAndAddChildElement(this.#list, 'li', 'clickable-list-item')
    const container = createAndAddChildElement(item, 'div', 'item-container')
    createAndAddChildElement(container, 'div', 'text-section', this.#listItem.text)
    this.#buttonsSection = createAndAddChildElement(container, 'div', 'buttons-section')
    this.createAddButton()
  }

  createAddButton(): void {
    const classList = ['add-button']
    const extraClass = this.#listItem.enabled ? 'active' : 'inactive'
    classList.push(extraClass)
    this.#addButton = createAndAddChildImage(this.#buttonsSection, 'images/laughing-pointing-emoji.png', classList)
    this.#addButton.addEventListener('click', this.#addButtonOnClick)
  }

  #addButtonOnClick = (): void => {
    this.#toggleItem()
  }

  #toggleItem(): void {
    const newState = !this.#listItem.enabled
    this.#listItem.enabled = newState
    this.#addButton.classList.toggle('active', newState)
    this.#addButton.classList.toggle('inactive', !newState)
    this.#listItemUpdatedCallback()
  }
}

export default class CheckingHelperPanelRenderer {

  constructor() {
    console.log("uus constructor mehed")
    this.#gradeManager = new GradeSectionManager()
    this.#commentManager = new CommentSectionManager()
    this.#quickSubmitManager = new QuickSubmitManager()
  }

  #checkingHelperPanel: HTMLElement | undefined
  #gradeManager: GradeSectionManager
  #commentManager: CommentSectionManager
  #quickSubmitManager: QuickSubmitManager

  async render(): Promise<void> {
    this.#gradeManager.destroy()
    this.#commentManager.destroy()
    this.#quickSubmitManager.destroy()
    this.#checkingHelperPanel?.remove()
    void this.#setupCheckingHelperPanel()
  }

  async #setupCheckingHelperPanel(): Promise<void> {
    this.#insertCheckingHelperPanelElement()

    const leftDiv = createAndAddChildElement(this.#checkingHelperPanel!, 'div', ['grade-subpanel', 'checking-helper-subpanel'])
    const rightDiv = createAndAddChildElement(this.#checkingHelperPanel!, 'div', ['common-answer-subpanel', 'checking-helper-subpanel'])
    const rightBottomDiv = createAndAddChildElement(this.#checkingHelperPanel!, 'div', ['quick-submit-subpanel', 'checking-helper-subpanel'])

    void this.#setupGradeSection(leftDiv)
    void this.#setupCommentSection(rightDiv)
    void this.#setupQuickSubmit(rightBottomDiv)
  }

  #insertCheckingHelperPanelElement(): void {
    const mainDiv = getMainDiv()
    const gradePanel = getGradePanel()
    this.#checkingHelperPanel = createElementWithClasses('div', ['checking-helper-panel'])
    mainDiv.insertBefore(this.#checkingHelperPanel, gradePanel.nextSibling)
  }

  async #setupQuickSubmit(parentDiv: HTMLElement): Promise<void> {
    this.#quickSubmitManager.setParentElement(parentDiv)
    this.#quickSubmitManager.setOtherManagers(this.#gradeManager, this.#commentManager)
    this.#quickSubmitManager.create()
  }

  async #setupGradeSection(parentDiv: HTMLElement): Promise<void> {
    createAndAddChildElement(parentDiv, 'h2', null, 'Hinde kujunemine')

    // TODO: move fetching into component probably
    const assignmentId = getAssignmentId()
    const fetcher = new GradePartsClient()
    const data = await fetcher.getData(assignmentId)
    this.#gradeManager.setParentElement(parentDiv)
    this.#gradeManager.setGradeParts(data)
    this.#gradeManager.create()
  }

  async #setupCommentSection(parentDiv: HTMLElement): Promise<void> {
    createAndAddChildElement(parentDiv, 'h2', null, 'Kommentaari koostamine')

    // TODO: move fetching into component probably
    const assignmentId = getAssignmentId()
    const fetcher = new CommonAnswersClient()
    const data = await fetcher.getData(assignmentId)
    this.#commentManager.setParentElement(parentDiv)
    this.#commentManager.setCommonAnswers(data)
    this.#commentManager.create()
  }
}

class CommentSectionManager {

  #commonAnswers!: CommonAnswer[]
  #commentTextarea!: HTMLTextAreaElement
  #parentElement!: HTMLElement

  setParentElement(parentElement: HTMLElement): void {
    this.#parentElement = parentElement
  }

  setCommonAnswers(commonAnswers: CommonAnswer[] | undefined): void {
    this.#commonAnswers = commonAnswers ?? []
  }

  create(): void {
    const listManager = new ClickableListManager()
    listManager.setParentElement(this.#parentElement)

    this.#commentTextarea = getCommentTextarea()
    this.#expandCommentSection()

    const properties = {
      sectionDivClass: 'common-answer-section',
      sectionTitle: 'Tüüpvastused',
      listItemClass: 'common-answer-list'
    }
    const items = this.#commonAnswers
    const onClickCallback = this.#onClickCallback

    listManager.setParameters(onClickCallback, items, properties)
    listManager.create()
  }

  destroy(): void {
    // TODO: implement actual removal of callbacks, destruction of the list managers etc
  }

  setCommentEmpty(): void {
    this.#setCommentText('')
  }

  #onClickCallback = (states: CommonAnswer[] | GradePart['parts']): void => {
    this.#updateCommentText(states as CommonAnswer[])
  }

  #updateCommentText(states: CommonAnswer[]): void {
    const text = this.#getCommonAnswerString(states)
    this.#setCommentText(text)
  }

  #setCommentText(text: string): void {
    this.#commentTextarea.value = text
  }

  #getCommonAnswerString(states: CommonAnswer[]): string {
    const enabledTexts = states
      .filter(answer => answer.enabled)
      .map(answer => answer.text)
    return enabledTexts.join('\n')
  }

  #expandCommentSection(): void {
    const commentLink = getCommentLink()
    commentLink.click()
  }
}

class GradeSectionManager {

  #gradeParts!: GradePart[]
  #parentElement!: HTMLElement
  #gradeInput!: HTMLInputElement

  setParentElement(parentElement: HTMLElement): void {
    this.#parentElement = parentElement
  }

  setGradeParts(gradeParts: GradePart[] | undefined): void {
    this.#gradeParts = deepCopy(gradeParts ?? [])

    let idCounter = 0
    this.#gradeParts.forEach(part => {
      part._id = ++idCounter
      part.parts.forEach(partPart => {
        partPart.text = `${partPart.text} (${partPart.points}p)`
      })
    })
  }

  create(): void {
    this.#gradeInput = getGradeInput()
    this.#gradeParts.forEach(gradePart => {
      this.createSubsectionList(gradePart)
    })
  }

  destroy(): void {
    // TODO: implement actual removal of callbacks, destruction of the list managers etc
  }

  setPointsMax(): void {
    this.#calculateAndSetTotalPoints(true)
  }

  createSubsectionList(gradePart: GradePart): void {
    const listManager = new ClickableListManager()
    listManager.setParentElement(this.#parentElement)

    const properties = {
      sectionDivClass: 'common-answer-section',
      sectionTitle: `${gradePart.title} (${gradePart.max.points}p)`,
      listItemClass: 'common-answer-list'
    }
    const items = gradePart.parts
    const onClickCallback = (states: CommonAnswer[] | GradePart['parts']) => this.#onClickCallback(states as GradePart['parts'], gradePart._id!)

    listManager.setParameters(onClickCallback, items, properties)
    listManager.create()
  }

  #onClickCallback = (states: GradePart['parts'], id: number): void => {
    const gradePart = this.#gradeParts.find(p => p._id === id)
    if (gradePart) gradePart.parts = states

    this.#calculateAndSetTotalPoints()
  }

  #calculateAndSetTotalPoints(overrideEnabledTrue?: boolean): void {
    const totalPoints = this.#gradeParts.reduce((sum, major) => {
      const partSum = (major.parts ?? []).reduce((ps, p) =>
        ps + ((p.enabled || overrideEnabledTrue) ? (p.points ?? 0) : 0), 0)
      return sum + partSum
    }, 0)
    this.#gradeInput.value = String(totalPoints > 0 ? totalPoints : 100)
  }
}

class QuickSubmitManager {
  #gradeManager!: GradeSectionManager
  #commentManager!: CommentSectionManager
  #parentElement!: HTMLElement

  setParentElement(element: HTMLElement): void {
    this.#parentElement = element
  }

  setOtherManagers(gradeManager: GradeSectionManager, commentManager: CommentSectionManager): void {
    this.#gradeManager = gradeManager
    this.#commentManager = commentManager
  }

  create(): void {
    const img = createAndAddChildImage(this.#parentElement, 'images/double-thumbs-up-emoji.png')
    img.addEventListener('click', () => {
      this.#gradeManager.setPointsMax()
      this.#commentManager.setCommentEmpty()
      // this also automatically submits the comment
      getSaveGradeAndShowNextButton().click()
    }, {
      once: true
    })
  }

  destroy(): void {
    // TODO: implement removing listeners here
  }
}
