import type { FeedbackPartView } from '../../shared/types/FeedbackPartView';
import { createAndAddChildElement, createAndAddChildImage } from '../../shared/util/element-creation-helper';
import BaseRenderer from '../../shared/renderer/BaseRenderer';
import { translations } from '@shared/translations/translations';

const ADD_BUTTON_IMAGE_PATH = 'images/double-thumbs-up-emoji.png'

export class FeedbackPartRenderer extends BaseRenderer {
  readonly #list: HTMLElement
  readonly #part: FeedbackPartView
  readonly #onToggled: (selected: boolean) => void
  #selected: boolean

  #addButton: HTMLImageElement | undefined

  constructor(list: HTMLElement, part: FeedbackPartView, onToggled: (selected: boolean) => void) {
    super()

    this.#list = list
    this.#part = part
    this.#onToggled = onToggled
    this.#selected = part.selected
  }

  protected createRoot(): HTMLElement {
    return createAndAddChildElement(this.#list, 'li', 'clickable-list-item')
  }

  protected async renderContent(root: HTMLElement) {
    const container = createAndAddChildElement(root, 'div', 'item-container')
    createAndAddChildElement(container, 'div', 'text-section', this.#getDisplayText())
    const buttonsSection = createAndAddChildElement(container, 'div', 'buttons-section')

    this.#addButton = createAndAddChildImage(buttonsSection, ADD_BUTTON_IMAGE_PATH, ['add-button', this.#selected ? 'active' : 'inactive'])
    this.#addButton.addEventListener('click', this.#toggle)
  }

  #getDisplayText(): string | null {
    const lines: string[] = []
    if (this.#part.labelText) lines.push(translations.feedback.partLabelText(this.#part.labelText))
    if (this.#part.selectedText) lines.push(translations.feedback.partSelectedText(this.#part.selectedText))
    if (this.#part.unselectedText) lines.push(translations.feedback.partUnselectedText(this.#part.unselectedText))
    if (this.#part.points) {
      const points = translations.feedback.points(this.#part.points)
      if (lines.length > 0) lines[0] += ` (${points})`
      else lines.push(`(${points})`)
    }
    return lines.length > 0 ? lines.join('\n') : null
  }

  #toggle = (): void => {
    this.#selected = !this.#selected
    this.#addButton!.classList.toggle('active', this.#selected)
    this.#addButton!.classList.toggle('inactive', !this.#selected)
    this.#onToggled(this.#selected)
  }
}
