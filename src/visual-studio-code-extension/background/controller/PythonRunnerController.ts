import VsCodeCommandController from './VsCodeCommandController'
import { pythonRunnerService } from '../service/PythonRunnerService'
import { RUN_PYTHON_IN_TERMINAL_COMMAND } from '../config'

class PythonRunnerController extends VsCodeCommandController {
  protected override onInit(): undefined {
    this.addCommandHandler(RUN_PYTHON_IN_TERMINAL_COMMAND, async ([fileUri]) => {
      pythonRunnerService.runScript(fileUri)
    })
  }
}

export const pythonRunnerController = new PythonRunnerController()
