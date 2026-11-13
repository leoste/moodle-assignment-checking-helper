// The look shared by both extensions lies outside this extension's folder, so it's imported here instead of being listed in the manifest.
import '@shared/business/styles/theme.css'
import { consoleTyper } from '@shared/presentation/typer/ConsoleTyper'
import { consoleProvider } from '@shared/foundation/infrastructure/ConsoleProvider'
import { chromeMessageProvider } from '../shared/foundation/infrastructure/ChromeMessageProvider'
import { quizReviewPageListener } from "./presentation/listener/QuizReviewPageListener";

consoleTyper.init()
consoleProvider.init()
chromeMessageProvider.init()
quizReviewPageListener.init()
