import { pageInfoService } from './PageInfoService'
import { pythonRunnerService } from './PythonRunnerService'

export default function initServices(): void {
  pageInfoService.init()
  pythonRunnerService.init()
}
