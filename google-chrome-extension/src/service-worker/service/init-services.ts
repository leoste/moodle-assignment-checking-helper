import { webSocketService } from './WebSocketService'
import { assignmentService } from './AssignmentService'
import { fileCacheService } from './FileCacheService'
import { pageInfoService } from './PageInfoService'
import { quizService } from './QuizService'

export default function initServices(): void {
  webSocketService.init()
  assignmentService.init()
  fileCacheService.init()
  pageInfoService.init()
  quizService.init()
}

/*
TODO: important before adding new features! this is regarding all services.
services essentially reflect abstract parts of the overall multi-extension project.
they are business logic in code essentially. so its important all services accurately reflect the intended structure.
verify that this is the case and if necessary, do changes.
this sort of stuff should also be documented in the main readme probably.
*/