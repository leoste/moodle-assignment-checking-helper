import { logger } from '@shared/logging/logger'
import ConsoleLogSink from '@shared/logging/ConsoleLogSink'
import { assignmentGraderListener } from "./pagelistener/AssignmentGraderListener";

logger.init(new ConsoleLogSink())
assignmentGraderListener.init()
