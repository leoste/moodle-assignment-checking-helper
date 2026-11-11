import { createAndAddChildElement } from '../../shared/util/element-creation-helper';
import BaseRenderer from '../../shared/renderer/BaseRenderer';
import { translations } from '@shared/translations/translations';

export interface ApplySectionCallbacks {
  onApply: () => void
}

export class ApplySectionRenderer extends BaseRenderer {
  readonly #parentElement: HTMLElement
  readonly #callbacks: ApplySectionCallbacks

  #gradeElement: HTMLElement | undefined
  #commentElement: HTMLElement | undefined
  #stateElement: HTMLElement | undefined

  constructor(parentElement: HTMLElement, callbacks: ApplySectionCallbacks) {
    super()

    this.#parentElement = parentElement
    this.#callbacks = callbacks
  }

  protected createRoot(): HTMLElement {
    return createAndAddChildElement(this.#parentElement, 'div', 'apply-section')
  }

  protected async renderContent(root: HTMLElement) {
    const container = createAndAddChildElement(root, 'div', 'item-container')
    this.#gradeElement = createAndAddChildElement(container, 'div', ['text-section', 'apply-grade'])
    this.#commentElement = createAndAddChildElement(container, 'div', ['text-section', 'apply-comment'])

    const controls = createAndAddChildElement(container, 'div', 'apply-controls')
    const button = createAndAddChildElement(controls, 'button', 'apply-button', translations.apply.button) as HTMLButtonElement
    button.type = 'button'
    button.addEventListener('click', this.#callbacks.onApply)
    this.#stateElement = createAndAddChildElement(controls, 'div', 'apply-state')
  }

  setPreview(grade: number, comment: string): void {
    this.#gradeElement!.textContent = translations.apply.grade(grade)
    this.#commentElement!.textContent = comment
  }

  setApplied(applied: boolean): void {
    this.#stateElement!.textContent = applied ? translations.apply.applied : translations.apply.unapplied
    this.#stateElement!.classList.toggle('unapplied', !applied)
  }
}
