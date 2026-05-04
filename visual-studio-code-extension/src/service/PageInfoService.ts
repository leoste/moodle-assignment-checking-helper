import * as vscode from 'vscode'
import * as path from 'path'
import { OPEN_SUB_DIRECTORIES, SAFE_BINARY_EXTENSIONS } from '../config'
import BaseService from '@shared/service/BaseService'

class PageInfoService extends BaseService {
  async handlePageInfo(studentName: string): Promise<void> {
    if (!studentName) return

    vscode.window.terminals.forEach(t => t.dispose())
    await vscode.commands.executeCommand('workbench.files.action.collapseExplorerFolders')
    await vscode.commands.executeCommand('workbench.action.closeAllEditors')

    const folders = vscode.workspace.workspaceFolders
    if (!folders || folders.length === 0) {
      vscode.window.showWarningMessage('Moodle Helper: No workspace folder open.')
      return
    }

    const rootUri = folders[0].uri
    const targetEntry = await this.#findDirectoryByName(rootUri, studentName)

    if (!targetEntry) {
      vscode.window.showWarningMessage(`Moodle Helper: No folder found for "${studentName}".`)
      return
    }

    const targetUri = vscode.Uri.joinPath(rootUri, targetEntry)
    let files: [vscode.Uri, string][]

    if (OPEN_SUB_DIRECTORIES) {
      files = await this.#collectFiles(targetUri)
    } else {
      const entries = await vscode.workspace.fs.readDirectory(targetUri)
      files = entries
        .filter(([_, type]) => type === vscode.FileType.File)
        .map(([fileName]) => [targetUri, fileName])
    }

    let fileCount = 0
    for (const [dirUri, fileName] of files) {
      const column = (fileCount % 2) + 1
      const opened = await this.#openFile(dirUri, fileName, column)
      if (opened) fileCount++
    }
  }

  async #collectFiles(dirUri: vscode.Uri): Promise<[vscode.Uri, string][]> {
    let result: [vscode.Uri, string][] = []
    const entries = await vscode.workspace.fs.readDirectory(dirUri)
    for (const [name, type] of entries) {
      if (type === vscode.FileType.File) {
        result.push([dirUri, name])
      } else if (type === vscode.FileType.Directory) {
        result = result.concat(await this.#collectFiles(vscode.Uri.joinPath(dirUri, name)))
      }
    }
    return result
  }

  async #findDirectoryByName(rootUri: vscode.Uri, wantedName: string): Promise<string | undefined> {
    const entries = await vscode.workspace.fs.readDirectory(rootUri)
    const match = entries.find(
      ([name, type]) => type === vscode.FileType.Directory && name.startsWith(wantedName)
    )
    return match?.[0]
  }

  async #openFile(dirUri: vscode.Uri, fileName: string, column: number): Promise<boolean> {
    const fileUri = vscode.Uri.joinPath(dirUri, fileName)
    const ext = path.extname(fileName).toLowerCase()
    const options = { preview: false, viewColumn: column, preserveFocus: false }

    try {
      if (SAFE_BINARY_EXTENSIONS.has(ext)) {
        await vscode.commands.executeCommand('vscode.open', fileUri, options)
      } else {
        const doc = await vscode.workspace.openTextDocument(fileUri)
        await vscode.window.showTextDocument(doc, options)
      }
      return true
    } catch {
      return false
    }
  }
}

export const pageInfoService = new PageInfoService()
