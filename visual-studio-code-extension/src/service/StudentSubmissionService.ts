import * as vscode from 'vscode'
import BaseService from '@shared/service/BaseService'
import { translations } from '@shared/translations/translations'
import { logger } from '@shared/logging/logger'
import {
  canOpenMoreFiles,
  getEditorColumnOffset,
  isBinaryFile,
  isStudentFolder,
  shouldCollectSubFolders,
  shouldEnterFolder,
} from '../rules/student-files-rules'

type FileEntry = [dirUri: vscode.Uri, fileName: string]

class StudentSubmissionService extends BaseService {
  async openStudentSubmission(studentName: string): Promise<void> {
    if (!studentName) {
      logger.error(this, 'no student name given')
      return
    }

    await this.#resetWorkspace()

    const studentFolderUri = await this.#findStudentFolder(studentName)
    if (!studentFolderUri) return
    logger.info(this, `student folder of "${studentName}": ${studentFolderUri.fsPath}`)

    const files = await this.#collectSubmissionFiles(studentFolderUri)
    const openedCount = await this.#openFiles(files)
    logger.info(this, `opened ${openedCount} of ${files.length} file(s)`)
  }

  async #resetWorkspace(): Promise<void> {
    vscode.window.terminals.forEach(t => t.dispose())
    await vscode.commands.executeCommand('workbench.files.action.collapseExplorerFolders')
    await vscode.commands.executeCommand('workbench.action.closeAllEditors')
  }

  async #findStudentFolder(studentName: string): Promise<vscode.Uri | undefined> {
    const folders = vscode.workspace.workspaceFolders
    if (!folders || folders.length === 0) {
      logger.error(this, 'no workspace folder open')
      vscode.window.showWarningMessage(translations.studentSubmission.noWorkspaceFolder)
      return undefined
    }

    const rootUri = folders[0].uri
    const folderName = await this.#findDirectoryByName(rootUri, studentName)

    if (!folderName) {
      logger.error(this, `no folder found for "${studentName}"`)
      vscode.window.showWarningMessage(translations.studentSubmission.noStudentFolder(studentName))
      return undefined
    }

    return vscode.Uri.joinPath(rootUri, folderName)
  }

  async #findDirectoryByName(rootUri: vscode.Uri, wantedName: string): Promise<string | undefined> {
    const entries = await vscode.workspace.fs.readDirectory(rootUri)
    const match = entries.find(
      ([name, type]) => type === vscode.FileType.Directory && isStudentFolder(name, wantedName)
    )
    return match?.[0]
  }

  async #collectSubmissionFiles(folderUri: vscode.Uri): Promise<FileEntry[]> {
    if (shouldCollectSubFolders()) {
      return this.#collectFilesRecursively(folderUri)
    }
    const entries = await vscode.workspace.fs.readDirectory(folderUri)
    return entries
      .filter(([_, type]) => type === vscode.FileType.File)
      .map(([fileName]): FileEntry => [folderUri, fileName])
  }

  async #collectFilesRecursively(dirUri: vscode.Uri): Promise<FileEntry[]> {
    let result: FileEntry[] = []
    const entries = await vscode.workspace.fs.readDirectory(dirUri)
    for (const [name, type] of entries) {
      if (type === vscode.FileType.File) {
        result.push([dirUri, name])
      } else if (type === vscode.FileType.Directory && shouldEnterFolder(name)) {
        result = result.concat(await this.#collectFilesRecursively(vscode.Uri.joinPath(dirUri, name)))
      }
    }
    return result
  }

  async #openFiles(files: FileEntry[]): Promise<number> {
    let fileCount = 0
    for (const [dirUri, fileName] of files) {
      if (!canOpenMoreFiles(fileCount)) break
      const column = vscode.ViewColumn.One + getEditorColumnOffset(fileCount)
      const opened = await this.#openFile(dirUri, fileName, column)
      if (opened) fileCount++
    }
    return fileCount
  }

  async #openFile(dirUri: vscode.Uri, fileName: string, column: number): Promise<boolean> {
    const fileUri = vscode.Uri.joinPath(dirUri, fileName)
    const options = { preview: false, viewColumn: column, preserveFocus: false }

    try {
      if (isBinaryFile(fileName)) {
        await vscode.commands.executeCommand('vscode.open', fileUri, options)
      } else {
        const doc = await vscode.workspace.openTextDocument(fileUri)
        await vscode.window.showTextDocument(doc, options)
      }
      return true
    } catch (err) {
      logger.error(this, `could not open ${fileUri.fsPath}`, err)
      return false
    }
  }
}

export const studentSubmissionService = new StudentSubmissionService()
