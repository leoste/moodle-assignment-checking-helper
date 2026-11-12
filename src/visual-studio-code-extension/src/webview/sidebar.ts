import '@shared/styles/theme.css'
import './sidebar.css'
import { reporter } from '@shared/reporter/Reporter'
import { consoleWatcher } from '@shared/watcher/ConsoleWatcher'
import { vsCodeApiProvider } from './infrastructure/VsCodeApiProvider'
import { webviewMessageReceiver } from './infrastructure/WebviewMessageReceiver'
import { sidebarController } from './controller/SidebarController'
import { newsController } from './controller/NewsController'
import { sidebarListener } from './pagelistener/SidebarListener'

reporter.addWatcher(consoleWatcher)
vsCodeApiProvider.init()
webviewMessageReceiver.init()
sidebarController.init()
newsController.init()
sidebarListener.init()
