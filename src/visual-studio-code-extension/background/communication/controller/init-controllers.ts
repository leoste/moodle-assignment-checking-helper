import type BaseController from '@shared/communication/controller/BaseController'
import { studentSubmissionController } from './StudentSubmissionController'
import { pythonRunnerController } from './PythonRunnerController'
import { settingsController } from './SettingsController'
import { receptionMessageController } from './ReceptionMessageController'
import { receptionCommandController } from './ReceptionCommandController'
import { receptionWebviewController } from './ReceptionWebviewController'
import { newsController } from './NewsController'
import { logController } from './LogController'

// All controllers of the extension. Adding a controller here makes it both initialised and closed.
export const controllers: readonly BaseController[] = [
  studentSubmissionController,
  pythonRunnerController,
  settingsController,
  receptionMessageController,
  receptionCommandController,
  receptionWebviewController,
  newsController,
  logController,
]

export default function initControllers(): void {
  controllers.forEach(controller => controller.init())
}
