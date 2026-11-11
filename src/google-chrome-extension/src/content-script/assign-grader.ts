// The look shared by both extensions lies outside this extension's folder, so it's imported here instead of being listed in the manifest.
import '@shared/styles/theme.css'
import { logger } from '@shared/reporting/logger'
import ConsoleLogSink from '@shared/reporting/ConsoleLogSink'
import { chromeMessageReceiver } from '../shared/infrastructure/ChromeMessageReceiver'
import { assignmentController } from './controller/AssignmentController'
import { panelController } from './controller/PanelController'
import { assignmentGraderListener } from "./pagelistener/AssignmentGraderListener";

logger.init(new ConsoleLogSink())
chromeMessageReceiver.init()
assignmentController.init()
panelController.init()
assignmentGraderListener.init()
