import '@shared/business/styles/theme.css'
import './business/styles/sidebar.css'
import { reporter } from '@shared/communication/reporter/Reporter'
import { consoleWatcher } from '@shared/communication/watcher/ConsoleWatcher'
import { vsCodeApiProvider } from './foundation/infrastructure/VsCodeApiProvider'
import { webviewMessageReceiver } from './foundation/infrastructure/WebviewMessageReceiver'
import { newsController } from './communication/controller/NewsController'
import { sidebarPageListener } from './presentation/listener/SidebarPageListener'

reporter.addWatcher(consoleWatcher)
vsCodeApiProvider.init()
webviewMessageReceiver.init()
newsController.init()
sidebarPageListener.init()
