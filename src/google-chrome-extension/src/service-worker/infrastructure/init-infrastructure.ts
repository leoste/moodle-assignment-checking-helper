import type BaseInfrastructure from '@shared/infrastructure/BaseInfrastructure'
import { chromeMessageReceiver } from '../../shared/infrastructure/ChromeMessageReceiver'
import { vsCodeConnectionProvider } from './VsCodeConnectionProvider'
import { indexedDBProvider } from '../../shared/infrastructure/IndexedDBProvider'
import { chromeStorageProvider } from '../../shared/infrastructure/ChromeStorageProvider'

export const infrastructure: readonly BaseInfrastructure[] = [
  chromeMessageReceiver,
  vsCodeConnectionProvider,
  indexedDBProvider,
  chromeStorageProvider,
]

export default function initInfrastructure(): void {
  infrastructure.forEach(item => item.init())
}
