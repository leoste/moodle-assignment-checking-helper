import type BaseInfrastructure from '@shared/foundation/infrastructure/BaseInfrastructure'
import { outputChannelProvider } from './OutputChannelProvider'
import { statusBarItemProvider } from './StatusBarItemProvider'
import { vsCodeMessageReceiver } from './VsCodeMessageReceiver'
import { vsCodeWindowConnectionProvider } from './VsCodeWindowConnectionProvider'
import { vsCodeCommandReceiver } from './VsCodeCommandReceiver'
import { sidebarViewProvider } from './SidebarViewProvider'
import { sidebarNewsLink } from './SidebarNewsLink'
import { statusBarButtonProvider } from './StatusBarButtonProvider'
import { settingsProvider } from './SettingsProvider'
import { workspaceProvider } from './WorkspaceProvider'
import { editorProvider } from './EditorProvider'
import { terminalProvider } from './TerminalProvider'
import { notificationProvider } from './NotificationProvider'

// The output channel comes first: everything else logs to it from its initialisation on.
// The status bar item comes before the take-over button, so it's shown to the left of it.
export const infrastructure: readonly BaseInfrastructure[] = [
  outputChannelProvider,
  statusBarItemProvider,
  vsCodeMessageReceiver,
  vsCodeWindowConnectionProvider,
  vsCodeCommandReceiver,
  sidebarViewProvider,
  sidebarNewsLink,
  statusBarButtonProvider,
  settingsProvider,
  workspaceProvider,
  editorProvider,
  terminalProvider,
  notificationProvider,
]

export default function initInfrastructure(): void {
  infrastructure.forEach(item => item.init())
}
