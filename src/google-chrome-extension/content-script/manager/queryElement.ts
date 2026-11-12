import { announcer } from '@shared/announcer/Announcer'
import { getElementNotFoundStatus } from '../../shared/rules/status-rules'

export default function queryElement<T extends Element>(source: object, selector: string, parent: ParentNode = document): T {
  const element = parent.querySelector<T>(selector)
  if (!element) {
    announcer.announceLogError(source, `element not found: ${selector}`)
    announcer.announceStatus(getElementNotFoundStatus(selector))
  }
  return element!
}
