import type BaseInfrastructure from '@shared/foundation/infrastructure/BaseInfrastructure'
import { consoleProvider } from '@shared/foundation/infrastructure/ConsoleProvider'
import { indexedDBProvider } from '../../../shared/foundation/infrastructure/IndexedDBProvider'
import { chromeMessageProvider } from '../../../shared/foundation/infrastructure/ChromeMessageProvider'
import { chromePortProvider } from '../../../shared/foundation/infrastructure/ChromePortProvider'
import { serviceWorkerNewsLink } from '../../../shared/foundation/infrastructure/ServiceWorkerNewsLink'
import { fileSystemAccessProvider } from './FileSystemAccessProvider'

export const infrastructure: readonly BaseInfrastructure[] = [
  consoleProvider,
  indexedDBProvider,
  chromeMessageProvider,
  chromePortProvider,
  serviceWorkerNewsLink,
  fileSystemAccessProvider,
]

export default function initInfrastructure(): void {
  infrastructure.forEach(item => item.init())
}
