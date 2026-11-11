import { logger } from '@shared/reporting/logger'
import ConsoleLogSink from '@shared/reporting/ConsoleLogSink'
import { quizReviewListener } from "./pagelistener/QuizReviewListener";

logger.init(new ConsoleLogSink())
quizReviewListener.init()
