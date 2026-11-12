import { logger } from '@shared/reporting/logger'
import ConsoleLogSink from '@shared/reporting/ConsoleLogSink'
import { chromeMessageProvider } from '../shared/infrastructure/ChromeMessageProvider'
import { quizCommentListener } from "./pagelistener/QuizCommentListener";

logger.init(new ConsoleLogSink())
chromeMessageProvider.init()
quizCommentListener.init()
