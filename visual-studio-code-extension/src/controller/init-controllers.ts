import type BaseController from '@shared/controller/BaseController'
import { studentSubmissionController } from './StudentSubmissionController'
import { pythonRunnerController } from './PythonRunnerController'

// All controllers of the extension. Adding a controller here makes it both initialised and closed.
export const controllers: readonly BaseController[] = [
  studentSubmissionController,
  pythonRunnerController,
]

export default function initControllers(): void {
  controllers.forEach(controller => controller.init())
}
