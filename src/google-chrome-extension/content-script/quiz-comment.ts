import { reporter } from '@shared/communication/reporter/Reporter'
import { consoleWatcher } from '@shared/communication/watcher/ConsoleWatcher'
import { chromeMessageProvider } from '../shared/foundation/infrastructure/ChromeMessageProvider'
import { quizCommentPageListener } from "./presentation/listener/QuizCommentPageListener";

reporter.addWatcher(consoleWatcher)
chromeMessageProvider.init()
quizCommentPageListener.init()
