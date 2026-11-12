import '@shared/styles/theme.css'
import './sidebar.css'
import { reporter } from '@shared/reporter/Reporter'
import { consoleWatcher } from '@shared/watcher/ConsoleWatcher'
import { vsCodeApiProvider } from './infrastructure/VsCodeApiProvider'
import { webviewMessageReceiver } from './infrastructure/WebviewMessageReceiver'
import { newsController } from './controller/NewsController'
import { sidebarPageListener } from './listener/SidebarPageListener'

reporter.addWatcher(consoleWatcher)
vsCodeApiProvider.init()
webviewMessageReceiver.init()
newsController.init()
sidebarPageListener.init()
