import { logger } from '@shared/reporting/logger'
import ConsoleLogSink from '@shared/reporting/ConsoleLogSink'
import { quizCommentListener } from "./pagelistener/QuizCommentListener";

logger.init(new ConsoleLogSink())
quizCommentListener.init()
