import { pageInfoController } from './PageInfoController'
import { pythonRunnerController } from './PythonRunnerController'

export default function initControllers(): void {
  pageInfoController.init()
  pythonRunnerController.init()
}
