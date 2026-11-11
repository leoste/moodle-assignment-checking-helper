import '@shared/styles/theme.css'
import './sidebar.css'
import { logger } from '@shared/reporting/logger'
import ConsoleLogSink from '@shared/reporting/ConsoleLogSink'
import { vsCodeApiProvider } from './infrastructure/VsCodeApiProvider'
import { webviewMessageReceiver } from './infrastructure/WebviewMessageReceiver'
import { sidebarController } from './controller/SidebarController'
import { sidebarPresenter } from './presenter/SidebarPresenter'
import { sidebarClient } from './client/SidebarClient'

logger.init(new ConsoleLogSink())
vsCodeApiProvider.init()
webviewMessageReceiver.init()
sidebarController.init()
// The page asks for the current settings and statuses only once it can show them.
void sidebarPresenter.start().then(() => sidebarClient.notifyReady())
