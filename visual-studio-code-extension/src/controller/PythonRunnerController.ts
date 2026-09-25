import * as vscode from 'vscode'
import VsCodeCommandController from './VsCodeCommandController'
import { pythonRunnerService } from '../service/PythonRunnerService'
import { RUN_PYTHON_IN_TERMINAL_COMMAND } from '../config'

class PythonRunnerController extends VsCodeCommandController {
  
    protected override async onInit(): Promise<void> {
    
        this.registerCommand(RUN_PYTHON_IN_TERMINAL_COMMAND,(fileUri: vscode.Uri) => {
            pythonRunnerService.runScript(fileUri)
        })
    }
}

export const pythonRunnerController = new PythonRunnerController()
