import { logger } from '@shared/reporting/logger'
import ConsoleLogSink from '@shared/reporting/ConsoleLogSink'
import { assignmentGraderListener } from "./pagelistener/AssignmentGraderListener";

logger.init(new ConsoleLogSink())
assignmentGraderListener.init()
