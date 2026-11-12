import BaseRenderer from './BaseRenderer'
import { createAndAddChildElement } from '../util/element-creation-helper'
import type { Status } from '../types/Status'

export default class StatusLineRenderer extends BaseRenderer {
  readonly #parentElement: HTMLElement

  constructor(parentElement: HTMLElement) {
    super()
    this.#parentElement = parentElement
  }

  protected createRoot(): HTMLElement {
    return createAndAddChildElement(this.#parentElement, 'div', 'checking-helper-status-line')
  }

  show(statuses: readonly Status[]): void {
    this.element.replaceChildren()
    for (const status of statuses) {
      createAndAddChildElement(this.element, 'span', ['checking-helper-status', `checking-helper-status-${status.level}`], status.text)
    }
  }
}
