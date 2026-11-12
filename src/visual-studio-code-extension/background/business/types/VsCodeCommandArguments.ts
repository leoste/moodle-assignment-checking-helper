import type * as vscode from 'vscode'
import type { RUN_PYTHON_IN_TERMINAL_COMMAND, SHOW_LOG_COMMAND, TAKE_OVER_COMMAND } from '../../config'

// The arguments VS Code calls each command with. Controllers are type checked against this map.
export type VsCodeCommandArguments = {
  // The right-clicked file.
  [RUN_PYTHON_IN_TERMINAL_COMMAND]: [fileUri: vscode.Uri]
  [TAKE_OVER_COMMAND]: []
  [SHOW_LOG_COMMAND]: []
}
