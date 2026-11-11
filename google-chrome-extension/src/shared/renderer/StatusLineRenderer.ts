import BaseRenderer from './BaseRenderer'
import { createAndAddChildElement } from '../util/element-creation-helper'
import type { StatusSink } from '@shared/reporting/StatusSink'
import type { Status } from '@shared/types/Status'

export default class StatusLineRenderer extends BaseRenderer implements StatusSink {
  readonly #parentElement: HTMLElement

  constructor(parentElement: HTMLElement) {
    super()
    this.#parentElement = parentElement
  }

  protected createRoot(): HTMLElement {
    return createAndAddChildElement(this.#parentElement, 'div', 'status-line')
  }

  show(statuses: readonly Status[]): void {
    this.element.replaceChildren()
    for (const status of statuses) {
      createAndAddChildElement(this.element, 'span', ['status', `status-${status.level}`], status.text)
    }
  }
}
