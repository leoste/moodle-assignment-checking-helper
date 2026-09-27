import * as path from 'path'
import { OPEN_SUB_DIRECTORIES, SAFE_BINARY_EXTENSIONS, MAX_AUTO_OPENED_FILES, BLACKLISTED_FOLDER_NAMES, EDITOR_COLUMN_COUNT } from '../config'

export function isStudentFolder(folderName: string, studentName: string): boolean {
  return folderName.startsWith(studentName)
}

export function shouldCollectSubFolders(): boolean {
  return OPEN_SUB_DIRECTORIES
}

export function shouldEnterFolder(folderName: string): boolean {
  return !BLACKLISTED_FOLDER_NAMES.has(folderName)
}

export function canOpenMoreFiles(openedCount: number): boolean {
  return openedCount < MAX_AUTO_OPENED_FILES
}

export function getEditorColumnOffset(openedCount: number): number {
  return openedCount % EDITOR_COLUMN_COUNT
}

export function isBinaryFile(fileName: string): boolean {
  return SAFE_BINARY_EXTENSIONS.has(path.extname(fileName).toLowerCase())
}
