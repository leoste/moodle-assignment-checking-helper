import { reporter } from '@shared/reporter/Reporter'
import { consoleWatcher } from '@shared/watcher/ConsoleWatcher'
import { chromeMessageProvider } from '../shared/infrastructure/ChromeMessageProvider'
import { quizCommentPageListener } from "./listener/QuizCommentPageListener";

reporter.addWatcher(consoleWatcher)
chromeMessageProvider.init()
quizCommentPageListener.init()
