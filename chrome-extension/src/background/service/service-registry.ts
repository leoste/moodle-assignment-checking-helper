import WebSocketService from './WebSocketService'
import CommonAnswerService from './CommonAnswerService'
import GradePartService from './GradePartService'
import PageInfoService from './PageInfoService'
import QuizService from './QuizService'

const serviceRegistry = {
  webSocketService: new WebSocketService(),
  commonAnswerService: new CommonAnswerService(),
  gradePartService: new GradePartService(),
  pageInfoService: new PageInfoService(),
  quizService: new QuizService(),
}

export default serviceRegistry
