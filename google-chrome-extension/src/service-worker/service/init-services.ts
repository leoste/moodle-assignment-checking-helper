import { webSocketService } from './WebSocketService'
import { commonAnswerService } from './CommonAnswerService'
import { gradePartService } from './GradePartService'
import { pageInfoService } from './PageInfoService'
import { quizService } from './QuizService'

export default function initServices(): void {
  webSocketService.init()
  commonAnswerService.init()
  gradePartService.init()
  pageInfoService.init()
  quizService.init()
}
