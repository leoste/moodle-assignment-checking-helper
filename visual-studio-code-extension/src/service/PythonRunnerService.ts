import * as vscode from 'vscode'
import * as path from 'path'
import BaseService from '@shared/service/BaseService'

class PythonRunnerService extends BaseService {
  runScript(fileUri: vscode.Uri): void {
    const file = path.basename(fileUri.fsPath)
    const terminal = vscode.window.createTerminal({
      name: 'Python Runner',
      cwd: vscode.Uri.joinPath(fileUri, '..')
    })
    terminal.show()
    terminal.sendText(`python "${file}"`)
  }
}

export const pythonRunnerService = new PythonRunnerService()
