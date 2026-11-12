import * as vscode from 'vscode'
import BaseInfrastructure from '@shared/infrastructure/BaseInfrastructure'

class EditorProvider extends BaseInfrastructure {
  async closeAll(): Promise<void> {
    await vscode.commands.executeCommand('workbench.action.closeAllEditors')
  }

  // The column counts from 0, the first editor column. A binary file is opened in VS Code's own viewer for it.
  async open(fileUri: vscode.Uri, column: number, binary: boolean): Promise<void> {
    const options = { preview: false, viewColumn: vscode.ViewColumn.One + column, preserveFocus: false }
    if (binary) {
      await vscode.commands.executeCommand('vscode.open', fileUri, options)
    } else {
      const doc = await vscode.workspace.openTextDocument(fileUri)
      await vscode.window.showTextDocument(doc, options)
    }
  }
}

export const editorProvider = new EditorProvider()
