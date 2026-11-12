import type BaseInfrastructure from '@shared/foundation/infrastructure/BaseInfrastructure'
import { indexedDBProvider } from '../../../shared/foundation/infrastructure/IndexedDBProvider'
import { chromeMessageProvider } from '../../../shared/foundation/infrastructure/ChromeMessageProvider'
import { chromePortProvider } from '../../../shared/foundation/infrastructure/ChromePortProvider'
import { fileSystemAccessProvider } from './FileSystemAccessProvider'

export const infrastructure: readonly BaseInfrastructure[] = [
  indexedDBProvider,
  chromeMessageProvider,
  chromePortProvider,
  fileSystemAccessProvider,
]

export default function initInfrastructure(): void {
  infrastructure.forEach(item => item.init())
}
