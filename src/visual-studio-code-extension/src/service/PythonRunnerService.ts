import * as vscode from 'vscode'
import * as path from 'path'
import BaseService from '@shared/service/BaseService'
import { PYTHON_COMMAND } from '../config'
import { translations } from '@shared/translations/translations'

class PythonRunnerService extends BaseService {
  runScript(fileUri: vscode.Uri): void {
    const file = path.basename(fileUri.fsPath)
    const terminal = vscode.window.createTerminal({
      name: translations.pythonRunner.terminalName,
      cwd: vscode.Uri.joinPath(fileUri, '..')
    })
    terminal.show()
    terminal.sendText(`${PYTHON_COMMAND} "${file}"`)
  }
}

export const pythonRunnerService = new PythonRunnerService()
