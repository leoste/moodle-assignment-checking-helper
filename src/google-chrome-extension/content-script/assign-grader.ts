// The look shared by both extensions lies outside this extension's folder, so it's imported here instead of being listed in the manifest.
import '@shared/business/styles/theme.css'
import { consoleTyper } from '@shared/presentation/typer/ConsoleTyper'
import { consoleProvider } from '@shared/foundation/infrastructure/ConsoleProvider'
import { chromeMessageReceiver } from '../shared/foundation/infrastructure/ChromeMessageReceiver'
import { chromeMessageProvider } from '../shared/foundation/infrastructure/ChromeMessageProvider'
import { chromePortProvider } from '../shared/foundation/infrastructure/ChromePortProvider'
import { serviceWorkerNewsLink } from '../shared/foundation/infrastructure/ServiceWorkerNewsLink'
import { webLockProvider } from './foundation/infrastructure/WebLockProvider'
import { assignmentController } from './communication/controller/AssignmentController'
import { panelController } from './communication/controller/PanelController'
import { gradingTabController } from './communication/controller/GradingTabController'
import { assignmentGraderPageListener } from "./presentation/listener/AssignmentGraderPageListener";

consoleTyper.init()
consoleProvider.init()
chromeMessageReceiver.init()
chromeMessageProvider.init()
chromePortProvider.init()
serviceWorkerNewsLink.init()
webLockProvider.init()
assignmentController.init()
panelController.init()
gradingTabController.init()
assignmentGraderPageListener.init()
