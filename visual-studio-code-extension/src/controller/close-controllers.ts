import { pageInfoController } from './PageInfoController'
import { pythonRunnerController } from './PythonRunnerController'

export default function closeControllers(): void {
  pageInfoController.close()
  pythonRunnerController.close()
}
