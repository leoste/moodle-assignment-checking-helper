// The look shared by both extensions lies outside this extension's folder, so it's imported here instead of being listed in the manifest.
import '@shared/business/styles/theme.css'
import { reporter } from '@shared/communication/reporter/Reporter'
import { consoleWatcher } from '@shared/communication/watcher/ConsoleWatcher'
import { statusLineWatcher } from '@shared/communication/watcher/StatusLineWatcher'
import { chromeMessageReceiver } from '../shared/foundation/infrastructure/ChromeMessageReceiver'
import { chromeMessageProvider } from '../shared/foundation/infrastructure/ChromeMessageProvider'
import { chromePortProvider } from '../shared/foundation/infrastructure/ChromePortProvider'
import { webLockProvider } from './foundation/infrastructure/WebLockProvider'
import { assignmentController } from './communication/controller/AssignmentController'
import { panelController } from './communication/controller/PanelController'
import { gradingTabController } from './communication/controller/GradingTabController'
import { newsController } from '../shared/communication/controller/NewsController'
import { assignmentGraderPageListener } from "./presentation/listener/AssignmentGraderPageListener";

reporter.addWatcher(consoleWatcher)
reporter.addWatcher(statusLineWatcher)
chromeMessageReceiver.init()
chromeMessageProvider.init()
chromePortProvider.init()
webLockProvider.init()
assignmentController.init()
panelController.init()
gradingTabController.init()
newsController.init()
assignmentGraderPageListener.init()
