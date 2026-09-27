import { logger } from '@shared/logging/logger'
import ConsoleLogSink from '@shared/logging/ConsoleLogSink'
import { quizReviewListener } from "./pagelistener/QuizReviewListener";

logger.init(new ConsoleLogSink())
quizReviewListener.init()
