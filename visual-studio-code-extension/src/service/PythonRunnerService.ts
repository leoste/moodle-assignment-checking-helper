import * as vscode from 'vscode'
import * as path from 'path'
import BaseService from '@shared/service/BaseService'
import { PYTHON_COMMAND, PYTHON_TERMINAL_NAME } from '../config'

class PythonRunnerService extends BaseService {
  runScript(fileUri: vscode.Uri): void {
    const file = path.basename(fileUri.fsPath)
    const terminal = vscode.window.createTerminal({
      name: PYTHON_TERMINAL_NAME,
      cwd: vscode.Uri.joinPath(fileUri, '..')
    })
    terminal.show()
    terminal.sendText(`${PYTHON_COMMAND} "${file}"`)
  }
}

export const pythonRunnerService = new PythonRunnerService()
