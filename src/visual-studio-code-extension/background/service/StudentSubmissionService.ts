import * as vscode from 'vscode'
import BaseService from '@shared/service/BaseService'
import { translations } from '@shared/translations/translations'
import { announcer } from '@shared/announcer/Announcer'
import { getStudentSubmissionOpeningStatus, getStudentSubmissionStatus } from '@shared/rules/status-rules'
import type { VsCodeResponseStatus } from '@shared/types/VsCodeMessage'
import {
  RESPONSE_STATUS_NO_WORKSPACE,
  RESPONSE_STATUS_NOT_FOUND,
  RESPONSE_STATUS_NOTHING_OPENED,
  RESPONSE_STATUS_OK,
} from '@shared/constants/vscode-message'
import { canOpenMoreFiles, getEditorColumnOffset, isBinaryFile } from '../rules/student-files-rules'
import { settingsRepository } from '../repository/SettingsRepository'
import { studentSubmissionRepository } from '../repository/StudentSubmissionRepository'
import { workspaceProvider } from '../infrastructure/WorkspaceProvider'
import { editorProvider } from '../infrastructure/EditorProvider'
import { terminalProvider } from '../infrastructure/TerminalProvider'
import type { SubmissionFile } from '../types/SubmissionFile'

interface OpenResult {
  status: VsCodeResponseStatus
  // Shown as a popup when the lecturer has to do something about the result.
  popupText?: string
}

class StudentSubmissionService extends BaseService {
  async openStudentSubmission(studentName: string): Promise<VsCodeResponseStatus> {
    announcer.announceStatus(getStudentSubmissionOpeningStatus(studentName))
    const { status, popupText } = await this.#open(studentName)
    announcer.announceStatus({ ...getStudentSubmissionStatus(studentName, status), popupText })
    return status
  }

  async #open(studentName: string): Promise<OpenResult> {
    if (!studentName) {
      announcer.announceLogError(this, 'no student name given')
      return { status: RESPONSE_STATUS_NOT_FOUND }
    }

    await this.#resetWorkspace()

    const submissionsFolder = studentSubmissionRepository.getSubmissionsFolder()
    if (!submissionsFolder) {
      announcer.announceLogError(this, 'no workspace folder open')
      return { status: RESPONSE_STATUS_NO_WORKSPACE, popupText: translations.studentSubmission.noWorkspaceFolder }
    }

    const studentFolder = await studentSubmissionRepository.findStudentFolder(submissionsFolder, studentName)
    if (!studentFolder) {
      announcer.announceLogError(this, `no folder found for "${studentName}"`)
      return { status: RESPONSE_STATUS_NOT_FOUND, popupText: translations.studentSubmission.noStudentFolder(studentName) }
    }
    announcer.announceLog(this, `student folder of "${studentName}": ${studentFolder.fsPath}`)

    const { openSubDirectories } = await settingsRepository.getSettings()
    const files = await studentSubmissionRepository.getFiles(studentFolder, openSubDirectories)
    const openedCount = await this.#openFiles(files)
    announcer.announceLog(this, `opened ${openedCount} of ${files.length} file(s)`)
    return { status: openedCount > 0 ? RESPONSE_STATUS_OK : RESPONSE_STATUS_NOTHING_OPENED }
  }

  async #resetWorkspace(): Promise<void> {
    terminalProvider.closeAll()
    await workspaceProvider.collapseExplorer()
    await editorProvider.closeAll()
  }

  async #openFiles(files: SubmissionFile[]): Promise<number> {
    let fileCount = 0
    for (const [dirUri, fileName] of files) {
      if (!canOpenMoreFiles(fileCount)) break
      const opened = await this.#openFile(dirUri, fileName, getEditorColumnOffset(fileCount))
      if (opened) fileCount++
    }
    return fileCount
  }

  async #openFile(dirUri: vscode.Uri, fileName: string, column: number): Promise<boolean> {
    const fileUri = vscode.Uri.joinPath(dirUri, fileName)
    try {
      await editorProvider.open(fileUri, column, isBinaryFile(fileName))
      return true
    } catch (err) {
      announcer.announceLogError(this, `could not open ${fileUri.fsPath}`, err)
      return false
    }
  }
}

export const studentSubmissionService = new StudentSubmissionService()
