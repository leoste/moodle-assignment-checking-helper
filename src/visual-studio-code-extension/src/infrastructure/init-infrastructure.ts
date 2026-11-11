import type BaseInfrastructure from '@shared/infrastructure/BaseInfrastructure'
import { vsCodeMessageReceiver } from './VsCodeMessageReceiver'
import { vsCodeWindowConnectionProvider } from './VsCodeWindowConnectionProvider'
import { sidebarViewProvider } from './SidebarViewProvider'
import { statusBarButtonProvider } from './StatusBarButtonProvider'

export const infrastructure: readonly BaseInfrastructure[] = [
  vsCodeMessageReceiver,
  vsCodeWindowConnectionProvider,
  sidebarViewProvider,
  statusBarButtonProvider,
]

export default function initInfrastructure(): void {
  infrastructure.forEach(item => item.init())
}
