import { logAnnouncer } from '@shared/communication/announcer/LogAnnouncer'
import { gradingAnnouncer } from '@shared/communication/announcer/GradingAnnouncer'
import { getElementNotFoundStatus } from '../../../shared/business/rules/status-rules'

export default function queryElement<T extends Element>(source: object, selector: string, parent: ParentNode = document): T {
  const element = parent.querySelector<T>(selector)
  if (!element) {
    logAnnouncer.announceLogError(source, `element not found: ${selector}`)
    gradingAnnouncer.announceStatus(getElementNotFoundStatus(selector))
  }
  return element!
}
