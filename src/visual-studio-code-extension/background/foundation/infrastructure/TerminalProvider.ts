import * as vscode from 'vscode'
import BaseInfrastructure from '@shared/foundation/infrastructure/BaseInfrastructure'

class TerminalProvider extends BaseInfrastructure {
  closeAll(): void {
    vscode.window.terminals.forEach(terminal => terminal.dispose())
  }

  runInNewTerminal(name: string, cwd: vscode.Uri, commandLine: string): void {
    const terminal = vscode.window.createTerminal({ name, cwd })
    terminal.show()
    terminal.sendText(commandLine)
  }
}

export const terminalProvider = new TerminalProvider()
