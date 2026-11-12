import VsCodeCommandController from './VsCodeCommandController'
import { logService } from '../service/LogService'
import { SHOW_LOG_COMMAND } from '../config'

// The status bar item.
class LogController extends VsCodeCommandController {
  protected override onInit(): undefined {
    this.addCommandHandler(SHOW_LOG_COMMAND, async () => {
      logService.showLog()
    })
  }
}

export const logController = new LogController()
