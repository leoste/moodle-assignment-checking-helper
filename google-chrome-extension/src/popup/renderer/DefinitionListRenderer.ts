import type { Assignment } from '../../shared/types/Assignment'
import BaseRenderer from '../../shared/renderer/BaseRenderer'
import { createAndAddChildElement } from '../../shared/util/element-creation-helper'
import { translations } from '@shared/translations/translations'

export default class DefinitionListRenderer extends BaseRenderer {
  readonly #parentElement: HTMLElement
  readonly #assignments: Assignment[]

  constructor(parentElement: HTMLElement, assignments: Assignment[]) {
    super()
    this.#parentElement = parentElement
    this.#assignments = assignments
  }

  protected createRoot(): HTMLElement {
    return createAndAddChildElement(this.#parentElement, 'div')
  }

  protected async renderContent(root: HTMLElement): Promise<void> {
    if (this.#assignments.length === 0) {
      createAndAddChildElement(root, 'div', 'text', translations.definitions.noneFound)
      return
    }

    const list = createAndAddChildElement(root, 'ul', 'definition-list')
    for (const assignment of this.#assignments) {
      const courseCode = assignment.course_code ?? translations.definitions.noCourseCode
      createAndAddChildElement(list, 'li', null, `${courseCode} - ${assignment.name} (${assignment.moodleIds.join(', ')})`)
    }
  }
}
