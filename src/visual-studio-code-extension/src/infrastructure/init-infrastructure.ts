import type BaseInfrastructure from '@shared/infrastructure/BaseInfrastructure'
import { vsCodeMessageReceiver } from './VsCodeMessageReceiver'
import { sidebarViewProvider } from './SidebarViewProvider'

export const infrastructure: readonly BaseInfrastructure[] = [
  vsCodeMessageReceiver,
  sidebarViewProvider,
]

export default function initInfrastructure(): void {
  infrastructure.forEach(item => item.init())
}
