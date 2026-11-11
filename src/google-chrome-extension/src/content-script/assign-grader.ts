import { logger } from '@shared/reporting/logger'
import ConsoleLogSink from '@shared/reporting/ConsoleLogSink'
import { chromeMessageReceiver } from '../shared/infrastructure/ChromeMessageReceiver'
import { assignmentController } from './controller/AssignmentController'
import { assignmentGraderListener } from "./pagelistener/AssignmentGraderListener";

logger.init(new ConsoleLogSink())
chromeMessageReceiver.init()
assignmentController.init()
assignmentGraderListener.init()
