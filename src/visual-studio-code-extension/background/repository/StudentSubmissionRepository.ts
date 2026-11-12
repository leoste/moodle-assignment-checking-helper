import * as vscode from 'vscode'
import BaseRepository from '@shared/repository/BaseRepository'
import { workspaceProvider } from '../foundation/infrastructure/WorkspaceProvider'
import { isStudentFolder, shouldEnterFolder } from '../business/rules/student-files-rules'
import type { SubmissionFile } from '../business/types/SubmissionFile'

// The students' submissions, downloaded from Moodle into the folder open in VS Code: a folder for every student.
class StudentSubmissionRepository extends BaseRepository {
  // Undefined when no folder is open in VS Code.
  getSubmissionsFolder(): vscode.Uri | undefined {
    return workspaceProvider.getRootFolder()
  }

  async findStudentFolder(submissionsFolder: vscode.Uri, studentName: string): Promise<vscode.Uri | undefined> {
    const entries = await workspaceProvider.readDirectory(submissionsFolder)
    const match = entries.find(entry => entry.isDirectory && isStudentFolder(entry.name, studentName))
    return match ? vscode.Uri.joinPath(submissionsFolder, match.name) : undefined
  }

  async getFiles(studentFolder: vscode.Uri, withSubfolders: boolean): Promise<SubmissionFile[]> {
    if (withSubfolders) {
      return this.#getFilesRecursively(studentFolder)
    }
    const entries = await workspaceProvider.readDirectory(studentFolder)
    return entries
      .filter(entry => entry.isFile)
      .map((entry): SubmissionFile => [studentFolder, entry.name])
  }

  async #getFilesRecursively(dirUri: vscode.Uri): Promise<SubmissionFile[]> {
    let result: SubmissionFile[] = []
    for (const entry of await workspaceProvider.readDirectory(dirUri)) {
      if (entry.isFile) {
        result.push([dirUri, entry.name])
      } else if (entry.isDirectory && shouldEnterFolder(entry.name)) {
        result = result.concat(await this.#getFilesRecursively(vscode.Uri.joinPath(dirUri, entry.name)))
      }
    }
    return result
  }
}

export const studentSubmissionRepository = new StudentSubmissionRepository()
