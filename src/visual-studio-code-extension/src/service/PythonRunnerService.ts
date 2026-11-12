import * as vscode from 'vscode'
import * as path from 'path'
import BaseService from '@shared/service/BaseService'
import { translations } from '@shared/translations/translations'
import { terminalProvider } from '../infrastructure/TerminalProvider'
import { PYTHON_COMMAND } from '../config'

class PythonRunnerService extends BaseService {
  runScript(fileUri: vscode.Uri): void {
    const file = path.basename(fileUri.fsPath)
    terminalProvider.runInNewTerminal(
      translations.pythonRunner.terminalName,
      vscode.Uri.joinPath(fileUri, '..'),
      `${PYTHON_COMMAND} "${file}"`,
    )
  }
}

export const pythonRunnerService = new PythonRunnerService()
