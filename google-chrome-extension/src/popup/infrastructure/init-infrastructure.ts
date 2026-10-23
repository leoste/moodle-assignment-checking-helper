import type BaseInfrastructure from '@shared/infrastructure/BaseInfrastructure'
import { indexedDBProvider } from '../../shared/infrastructure/IndexedDBProvider'

export const infrastructure: readonly BaseInfrastructure[] = [
  indexedDBProvider,
]

export default function initInfrastructure(): void {
  infrastructure.forEach(item => item.init())
}
