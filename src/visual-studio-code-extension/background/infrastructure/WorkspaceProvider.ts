import * as vscode from 'vscode'
import BaseInfrastructure from '@shared/infrastructure/BaseInfrastructure'
import type { WorkspaceEntry } from '../types/WorkspaceEntry'

// The folder open in VS Code: its files and the Explorer that shows them.
class WorkspaceProvider extends BaseInfrastructure {
  // Undefined when no folder is open.
  getRootFolder(): vscode.Uri | undefined {
    const folders = vscode.workspace.workspaceFolders
    if (!folders || folders.length === 0) return undefined
    return folders[0].uri
  }

  async readDirectory(dirUri: vscode.Uri): Promise<WorkspaceEntry[]> {
    const entries = await vscode.workspace.fs.readDirectory(dirUri)
    return entries.map(([name, type]) => ({
      name,
      isFile: type === vscode.FileType.File,
      isDirectory: type === vscode.FileType.Directory,
    }))
  }

  async collapseExplorer(): Promise<void> {
    await vscode.commands.executeCommand('workbench.files.action.collapseExplorerFolders')
  }
}

export const workspaceProvider = new WorkspaceProvider()
