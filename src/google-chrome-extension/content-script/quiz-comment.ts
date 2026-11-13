import { consoleTyper } from '@shared/presentation/typer/ConsoleTyper'
import { consoleProvider } from '@shared/foundation/infrastructure/ConsoleProvider'
import { chromeMessageProvider } from '../shared/foundation/infrastructure/ChromeMessageProvider'
import { quizCommentPageListener } from "./presentation/listener/QuizCommentPageListener";

consoleTyper.init()
consoleProvider.init()
chromeMessageProvider.init()
quizCommentPageListener.init()
