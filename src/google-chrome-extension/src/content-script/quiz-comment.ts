import { reporter } from '@shared/reporter/Reporter'
import { consoleWatcher } from '@shared/watcher/ConsoleWatcher'
import { chromeMessageProvider } from '../shared/infrastructure/ChromeMessageProvider'
import { quizCommentListener } from "./pagelistener/QuizCommentListener";

reporter.addWatcher(consoleWatcher)
chromeMessageProvider.init()
quizCommentListener.init()
