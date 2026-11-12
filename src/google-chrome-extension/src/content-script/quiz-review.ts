// The look shared by both extensions lies outside this extension's folder, so it's imported here instead of being listed in the manifest.
import '@shared/styles/theme.css'
import { reporter } from '@shared/reporter/Reporter'
import { consoleWatcher } from '@shared/watcher/ConsoleWatcher'
import { chromeMessageProvider } from '../shared/infrastructure/ChromeMessageProvider'
import { quizReviewListener } from "./pagelistener/QuizReviewListener";

reporter.addWatcher(consoleWatcher)
chromeMessageProvider.init()
quizReviewListener.init()
