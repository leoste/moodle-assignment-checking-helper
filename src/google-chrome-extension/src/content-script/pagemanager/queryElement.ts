import { logger } from '@shared/reporting/logger'
import { statusReporter } from '@shared/reporting/statusReporter'
import { getElementNotFoundStatus } from '../../shared/rules/status-rules'

export default function queryElement<T extends Element>(source: object, selector: string, parent: ParentNode = document): T {
  const element = parent.querySelector<T>(selector)
  if (!element) {
    logger.error(source, `element not found: ${selector}`)
    statusReporter.report(getElementNotFoundStatus(selector))
  }
  return element!
}
