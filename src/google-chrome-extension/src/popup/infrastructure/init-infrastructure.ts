import type BaseInfrastructure from '@shared/infrastructure/BaseInfrastructure'
import { indexedDBProvider } from '../../shared/infrastructure/IndexedDBProvider'
import { chromeMessageProvider } from '../../shared/infrastructure/ChromeMessageProvider'
import { fileSystemAccessProvider } from './FileSystemAccessProvider'

export const infrastructure: readonly BaseInfrastructure[] = [
  indexedDBProvider,
  chromeMessageProvider,
  fileSystemAccessProvider,
]

export default function initInfrastructure(): void {
  infrastructure.forEach(item => item.init())
}
