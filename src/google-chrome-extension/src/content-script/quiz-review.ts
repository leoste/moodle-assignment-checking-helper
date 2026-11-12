// The look shared by both extensions lies outside this extension's folder, so it's imported here instead of being listed in the manifest.
import '@shared/styles/theme.css'
import { logger } from '@shared/reporting/logger'
import ConsoleLogSink from '@shared/reporting/ConsoleLogSink'
import { chromeMessageProvider } from '../shared/infrastructure/ChromeMessageProvider'
import { quizReviewListener } from "./pagelistener/QuizReviewListener";

logger.init(new ConsoleLogSink())
chromeMessageProvider.init()
quizReviewListener.init()
