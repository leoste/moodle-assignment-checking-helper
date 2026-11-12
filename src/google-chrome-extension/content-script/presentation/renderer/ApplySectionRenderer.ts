import { createAndAddChildElement } from '@shared/foundation/util/element-creation-helper';
import BaseRenderer from '@shared/presentation/renderer/BaseRenderer';
import { translations } from '@shared/business/translations/translations';

export interface ApplySectionCallbacks {
  onApply: () => void
}

export class ApplySectionRenderer extends BaseRenderer {
  readonly #parentElement: HTMLElement
  readonly #callbacks: ApplySectionCallbacks

  #gradeElement: HTMLElement | undefined
  #commentElement: HTMLElement | undefined

  constructor(parentElement: HTMLElement, callbacks: ApplySectionCallbacks) {
    super()

    this.#parentElement = parentElement
    this.#callbacks = callbacks
  }

  protected createRoot(): HTMLElement {
    return createAndAddChildElement(this.#parentElement, 'div', 'apply-section')
  }

  // A 2×2 grid: the grade and the comment, then the button and the hint.
  protected async renderContent(root: HTMLElement) {
    this.#gradeElement = createAndAddChildElement(root, 'div', ['text-section', 'apply-grade'])
    this.#commentElement = createAndAddChildElement(root, 'div', ['text-section', 'apply-comment'])

    const button = createAndAddChildElement(
      root,
      'button',
      ['apply-button', 'checking-helper-button', 'checking-helper-interactive'],
      translations.apply.button,
    ) as HTMLButtonElement
    button.type = 'button'
    button.addEventListener('click', this.#callbacks.onApply)

    createAndAddChildElement(root, 'div', 'checking-helper-hint', translations.apply.hint)
  }

  setPreview(grade: number, comment: string): void {
    this.#gradeElement!.textContent = translations.apply.grade(grade)
    this.#commentElement!.textContent = comment
  }
}
