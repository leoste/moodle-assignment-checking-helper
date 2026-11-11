import type { Assignment } from '../../shared/types/Assignment'
import BaseRenderer from '@shared/renderer/BaseRenderer'
import { createAndAddChildElement } from '@shared/util/element-creation-helper'
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

    for (const [index, group] of this.#groupByCourseCode().entries()) {
      if (index > 0) createAndAddChildElement(root, 'hr')
      const list = createAndAddChildElement(root, 'ul', 'definition-list')
      for (const assignment of group) {
        const courseCode = assignment.course_code ?? translations.definitions.noCourseCode
        createAndAddChildElement(list, 'li', null, `${courseCode} - ${assignment.name} (${assignment.moodleIds.join(', ')})`)
      }
    }
  }

  #groupByCourseCode(): Assignment[][] {
    const groups = new Map<string | undefined, Assignment[]>()
    for (const assignment of this.#assignments) {
      const group = groups.get(assignment.course_code) ?? []
      group.push(assignment)
      groups.set(assignment.course_code, group)
    }
    return [...groups.entries()]
      .sort(([a], [b]) => a === undefined ? 1 : b === undefined ? -1 : a.localeCompare(b))
      .map(([, group]) => group.sort((a, b) => a.name.localeCompare(b.name)))
  }
}
