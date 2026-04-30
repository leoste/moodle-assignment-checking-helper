import { configService } from './ConfigService'
import { webSocketService } from './WebSocketService'
import { commonAnswerService}  from './CommonAnswerService'
import { gradePartService } from './GradePartService'
import { pageInfoService } from './PageInfoService'
import { quizService } from './QuizService'

export default function initServices(): void {
  configService.init()
  webSocketService.init()
  commonAnswerService.init()
  gradePartService.init()
  pageInfoService.init()
  quizService.init()
}
