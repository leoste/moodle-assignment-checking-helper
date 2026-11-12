import type BaseInfrastructure from '@shared/infrastructure/BaseInfrastructure'
import { chromeMessageReceiver } from '../../shared/infrastructure/ChromeMessageReceiver'
import { chromePortReceiver } from './ChromePortReceiver'
import { vsCodeConnectionProvider } from './VsCodeConnectionProvider'
import { indexedDBProvider } from '../../shared/infrastructure/IndexedDBProvider'
import { chromeStorageProvider } from '../../shared/infrastructure/ChromeStorageProvider'

export const infrastructure: readonly BaseInfrastructure[] = [
  chromeMessageReceiver,
  chromePortReceiver,
  vsCodeConnectionProvider,
  indexedDBProvider,
  chromeStorageProvider,
]

export default function initInfrastructure(): void {
  infrastructure.forEach(item => item.init())
}
