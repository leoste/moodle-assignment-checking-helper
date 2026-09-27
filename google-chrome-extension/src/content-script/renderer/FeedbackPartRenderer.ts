import type { FeedbackPart } from '../../shared/types/FeedbackPart';
import { createAndAddChildElement, createAndAddChildImage } from '../../shared/util/element-creation-helper';
import BaseRenderer from '../../shared/renderer/BaseRenderer';
import { translations } from '@shared/translations/translations';

const ADD_BUTTON_IMAGE_PATH = 'images/double-thumbs-up-emoji.png'

export class FeedbackPartRenderer extends BaseRenderer {
  readonly #list: HTMLElement
  readonly #part: FeedbackPart
  readonly #onToggled: (enabled: boolean) => void
  #enabled: boolean

  #addButton: HTMLImageElement | undefined

  constructor(list: HTMLElement, part: FeedbackPart, onToggled: (enabled: boolean) => void) {
    super()

    this.#list = list
    this.#part = part
    this.#onToggled = onToggled
    this.#enabled = part.enabled
  }

  protected createRoot(): HTMLElement {
    return createAndAddChildElement(this.#list, 'li', 'clickable-list-item')
  }

  protected async renderContent(root: HTMLElement) {
    const container = createAndAddChildElement(root, 'div', 'item-container')
    createAndAddChildElement(container, 'div', 'text-section', this.#getDisplayText())
    const buttonsSection = createAndAddChildElement(container, 'div', 'buttons-section')

    this.#addButton = createAndAddChildImage(buttonsSection, ADD_BUTTON_IMAGE_PATH, ['add-button', this.#enabled ? 'active' : 'inactive'])
    this.#addButton.addEventListener('click', this.#toggle)
  }

  #getDisplayText(): string | null {
    const lines: string[] = []
    if (this.#part.labelText) lines.push(`label: ${this.#part.labelText}`)
    if (this.#part.enabledText) lines.push(`enabled: ${this.#part.enabledText}`)
    if (this.#part.disabledText) lines.push(`disabled: ${this.#part.disabledText}`)
    if (this.#part.points) {
      const points = translations.feedback.points(this.#part.points)
      if (lines.length > 0) lines[0] += ` (${points})`
      else lines.push(`(${points})`)
    }
    return lines.length > 0 ? lines.join('\n') : null
  }

  #toggle = (): void => {
    this.#enabled = !this.#enabled
    this.#addButton!.classList.toggle('active', this.#enabled)
    this.#addButton!.classList.toggle('inactive', !this.#enabled)
    this.#onToggled(this.#enabled)
  }
}
