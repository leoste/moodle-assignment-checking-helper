import type BaseController from '@shared/controller/BaseController'
import { pageInfoController } from './PageInfoController'
import { pythonRunnerController } from './PythonRunnerController'

// All controllers of the extension. Adding a controller here makes it both initialised and closed.
export const controllers: readonly BaseController[] = [
  pageInfoController,
  pythonRunnerController,
]

export default function initControllers(): void {
  controllers.forEach(controller => controller.init())
}
