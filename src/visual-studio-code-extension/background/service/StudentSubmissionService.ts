import * as vscode from 'vscode'
import BaseService from '@shared/service/BaseService'
import { translations } from '@shared/business/translations/translations'
import { logAnnouncer } from '@shared/communication/announcer/LogAnnouncer'
import { studentSubmissionAnnouncer } from '@shared/communication/announcer/StudentSubmissionAnnouncer'
import { getStudentSubmissionOpeningStatus, getStudentSubmissionStatus } from '@shared/business/rules/status-rules'
import type { VsCodeResponseStatus } from '@shared/business/types/VsCodeMessage'
import {
  RESPONSE_STATUS_NO_WORKSPACE,
  RESPONSE_STATUS_NOT_FOUND,
  RESPONSE_STATUS_NOTHING_OPENED,
  RESPONSE_STATUS_OK,
} from '@shared/foundation/constants/vscode-message'
import { canOpenMoreFiles, getEditorColumnOffset, isBinaryFile } from '../business/rules/student-files-rules'
import { settingsRepository } from '../repository/SettingsRepository'
import { studentSubmissionRepository } from '../repository/StudentSubmissionRepository'
import { workspaceProvider } from '../foundation/infrastructure/WorkspaceProvider'
import { editorProvider } from '../foundation/infrastructure/EditorProvider'
import { terminalProvider } from '../foundation/infrastructure/TerminalProvider'
import type { SubmissionFile } from '../business/types/SubmissionFile'

interface OpenResult {
  status: VsCodeResponseStatus
  // Shown as a popup when the lecturer has to do something about the result.
  popupText?: string
}

class StudentSubmissionService extends BaseService {
  async openStudentSubmission(studentName: string): Promise<VsCodeResponseStatus> {
    studentSubmissionAnnouncer.announceStatus(getStudentSubmissionOpeningStatus(studentName))
    const { status, popupText } = await this.#open(studentName)
    studentSubmissionAnnouncer.announceStatus({ ...getStudentSubmissionStatus(studentName, status), popupText })
    return status
  }

  async #open(studentName: string): Promise<OpenResult> {
    if (!studentName) {
      logAnnouncer.announceLogError(this, 'no student name given')
      return { status: RESPONSE_STATUS_NOT_FOUND }
    }

    await this.#resetWorkspace()

    const submissionsFolder = studentSubmissionRepository.getSubmissionsFolder()
    if (!submissionsFolder) {
      logAnnouncer.announceLogError(this, 'no workspace folder open')
      return { status: RESPONSE_STATUS_NO_WORKSPACE, popupText: translations.studentSubmission.noWorkspaceFolder }
    }

    const studentFolder = await studentSubmissionRepository.findStudentFolder(submissionsFolder, studentName)
    if (!studentFolder) {
      logAnnouncer.announceLogError(this, `no folder found for "${studentName}"`)
      return { status: RESPONSE_STATUS_NOT_FOUND, popupText: translations.studentSubmission.noStudentFolder(studentName) }
    }
    logAnnouncer.announceLog(this, `student folder of "${studentName}": ${studentFolder.fsPath}`)

    const { openSubDirectories } = await settingsRepository.getSettings()
    const files = await studentSubmissionRepository.getFiles(studentFolder, openSubDirectories)
    const openedCount = await this.#openFiles(files)
    logAnnouncer.announceLog(this, `opened ${openedCount} of ${files.length} file(s)`)
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
      logAnnouncer.announceLogError(this, `could not open ${fileUri.fsPath}`, err)
      return false
    }
  }
}

export const studentSubmissionService = new StudentSubmissionService()
