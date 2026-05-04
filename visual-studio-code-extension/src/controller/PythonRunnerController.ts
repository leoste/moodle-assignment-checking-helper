import * as vscode from 'vscode'
import VsCodeCommandController from './VsCodeCommandController'
import { pythonRunnerService } from '../service/PythonRunnerService'

class PythonRunnerController extends VsCodeCommandController {
  
    protected override async onInit(): Promise<void> {
    
        this.registerCommand('moodle-helper.runPythonInTerminal', (fileUri: vscode.Uri) => {
            pythonRunnerService.runScript(fileUri)
        })
    }
}

export const pythonRunnerController = new PythonRunnerController()
