import { logger } from '@shared/logging/logger'
import ConsoleLogSink from '@shared/logging/ConsoleLogSink'
import { quizCommentListener } from "./pagelistener/QuizCommentListener";

logger.init(new ConsoleLogSink())
quizCommentListener.init()
