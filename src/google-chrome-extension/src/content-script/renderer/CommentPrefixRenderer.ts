import { createAndAddChildElement } from '@shared/util/element-creation-helper';
import BaseRenderer from '@shared/renderer/BaseRenderer';
import { translations } from '@shared/translations/translations';

export class CommentPrefixRenderer extends BaseRenderer {
  readonly #parentElement: HTMLElement
  readonly #prefix: string
  readonly #onChange: (prefix: string) => void

  constructor(parentElement: HTMLElement, prefix: string, onChange: (prefix: string) => void) {
    super()
    this.#parentElement = parentElement
    this.#prefix = prefix
    this.#onChange = onChange
  }

  protected createRoot(): HTMLElement {
    return createAndAddChildElement(this.#parentElement, 'div', 'comment-prefix-section')
  }

  protected async renderContent(root: HTMLElement) {
    createAndAddChildElement(root, 'h3', null, translations.feedback.commentPrefix)
    const itemContainer = createAndAddChildElement(root, 'div', 'item-container')
    const textarea = createAndAddChildElement(itemContainer, 'textarea', ['comment-prefix-textarea', 'checking-helper-interactive']) as HTMLTextAreaElement
    textarea.placeholder = translations.feedback.commentPrefixPlaceholder
    textarea.value = this.#prefix
    createAndAddChildElement(itemContainer, 'div', 'buttons-section')
    textarea.addEventListener('input', () => this.#onChange(textarea.value))
  }
}
