import { logger } from '@shared/logging/logger'

export default function queryElement<T extends Element>(source: object, selector: string, parent: ParentNode = document): T {
  const element = parent.querySelector<T>(selector)
  if (!element) {
    logger.error(source, `element not found: ${selector}`)
  }
  return element!
}
