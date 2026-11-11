import '@shared/styles/theme.css'
import './sidebar.css'
import { logger } from '@shared/reporting/logger'
import ConsoleLogSink from '@shared/reporting/ConsoleLogSink'
import { vsCodeApiProvider } from './infrastructure/VsCodeApiProvider'
import { webviewMessageReceiver } from './infrastructure/WebviewMessageReceiver'
import { sidebarController } from './controller/SidebarController'
import { sidebarListener } from './pagelistener/SidebarListener'

logger.init(new ConsoleLogSink())
vsCodeApiProvider.init()
webviewMessageReceiver.init()
sidebarController.init()
sidebarListener.init()
