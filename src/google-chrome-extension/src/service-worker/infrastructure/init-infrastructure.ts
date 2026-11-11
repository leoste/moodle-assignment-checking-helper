import type BaseInfrastructure from '@shared/infrastructure/BaseInfrastructure'
import { chromeMessageReceiver } from '../../shared/infrastructure/ChromeMessageReceiver'
import { vsCodeConnectionProvider } from './VsCodeConnectionProvider'
import { indexedDBProvider } from '../../shared/infrastructure/IndexedDBProvider'

export const infrastructure: readonly BaseInfrastructure[] = [
  chromeMessageReceiver,
  vsCodeConnectionProvider,
  indexedDBProvider,
]

export default function initInfrastructure(): void {
  infrastructure.forEach(item => item.init())
}
