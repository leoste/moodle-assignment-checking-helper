// The look shared by both extensions lies outside this extension's folder, so it's imported here instead of being listed in the manifest.
import '@shared/presentation/styles/theme.css'
import { reporter } from '@shared/communication/reporter/Reporter'
import { consoleWatcher } from '@shared/communication/watcher/ConsoleWatcher'
import { chromeMessageProvider } from '../shared/foundation/infrastructure/ChromeMessageProvider'
import { quizReviewPageListener } from "./presentation/listener/QuizReviewPageListener";

reporter.addWatcher(consoleWatcher)
chromeMessageProvider.init()
quizReviewPageListener.init()
