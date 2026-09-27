import type BaseInfrastructure from '@shared/infrastructure/BaseInfrastructure'
import { vsCodeMessageReceiver } from './VsCodeMessageReceiver'

export const infrastructure: readonly BaseInfrastructure[] = [
  vsCodeMessageReceiver,
]

export default function initInfrastructure(): void {
  infrastructure.forEach(item => item.init())
}
