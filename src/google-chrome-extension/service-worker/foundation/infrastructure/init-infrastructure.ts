import type BaseInfrastructure from '@shared/foundation/infrastructure/BaseInfrastructure'
import { consoleProvider } from '@shared/foundation/infrastructure/ConsoleProvider'
import { chromeMessageReceiver } from '../../../shared/foundation/infrastructure/ChromeMessageReceiver'
import { chromePortReceiver } from './ChromePortReceiver'
import { pageNewsLink } from './PageNewsLink'
import { vsCodeConnectionProvider } from './VsCodeConnectionProvider'
import { indexedDBProvider } from '../../../shared/foundation/infrastructure/IndexedDBProvider'
import { chromeStorageProvider } from '../../../shared/foundation/infrastructure/ChromeStorageProvider'

export const infrastructure: readonly BaseInfrastructure[] = [
  consoleProvider,
  chromeMessageReceiver,
  chromePortReceiver,
  pageNewsLink,
  vsCodeConnectionProvider,
  indexedDBProvider,
  chromeStorageProvider,
]

export default function initInfrastructure(): void {
  infrastructure.forEach(item => item.init())
}
