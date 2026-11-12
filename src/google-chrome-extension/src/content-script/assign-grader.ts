// The look shared by both extensions lies outside this extension's folder, so it's imported here instead of being listed in the manifest.
import '@shared/styles/theme.css'
import { reporter } from '@shared/reporter/Reporter'
import { consoleWatcher } from '@shared/watcher/ConsoleWatcher'
import { statusLineWatcher } from '@shared/watcher/StatusLineWatcher'
import { chromeMessageReceiver } from '../shared/infrastructure/ChromeMessageReceiver'
import { chromeMessageProvider } from '../shared/infrastructure/ChromeMessageProvider'
import { chromePortProvider } from '../shared/infrastructure/ChromePortProvider'
import { webLockProvider } from './infrastructure/WebLockProvider'
import { assignmentController } from './controller/AssignmentController'
import { panelController } from './controller/PanelController'
import { gradingTabController } from './controller/GradingTabController'
import { newsController } from '../shared/controller/NewsController'
import { assignmentGraderListener } from "./pagelistener/AssignmentGraderListener";

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
assignmentGraderListener.init()
