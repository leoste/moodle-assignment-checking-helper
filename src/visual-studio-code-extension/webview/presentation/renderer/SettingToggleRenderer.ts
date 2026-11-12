import BaseRenderer from '@shared/presentation/renderer/BaseRenderer'
import { createAndAddChildElement } from '@shared/foundation/util/element-creation-helper'

// One true/false setting: the whole box is clickable.
export default class SettingToggleRenderer extends BaseRenderer {
  readonly #parentElement: HTMLElement
  readonly #text: string
  readonly #onChange: (checked: boolean) => void

  #checkbox: HTMLInputElement | undefined

  constructor(parentElement: HTMLElement, text: string, onChange: (checked: boolean) => void) {
    super()
    this.#parentElement = parentElement
    this.#text = text
    this.#onChange = onChange
  }

  protected createRoot(): HTMLElement {
    return createAndAddChildElement(this.#parentElement, 'label', ['setting-toggle', 'checking-helper-interactive'])
  }

  protected async renderContent(root: HTMLElement) {
    const checkbox = createAndAddChildElement(root, 'input') as HTMLInputElement
    checkbox.type = 'checkbox'
    checkbox.addEventListener('change', () => this.#onChange(checkbox.checked))
    this.#checkbox = checkbox
    createAndAddChildElement(root, 'span', null, this.#text)
  }

  setChecked(checked: boolean): void {
    this.#checkbox!.checked = checked
  }
}
