import * as path from 'path'
import { OPEN_SUB_DIRECTORIES, SAFE_BINARY_EXTENSIONS, MAX_AUTO_OPENED_FILES, BLACKLISTED_FOLDER_NAMES, EDITOR_COLUMN_COUNT } from '../config'

// Letters, digits and the characters inside names like "Mari-Liis" or "O'Brien".
const NAME_CHARACTER = /[\p{L}\p{N}'-]/u

// The folder name must start with the whole name: what follows it can't continue the name,
// so "Mari Maa" matches "Mari Maa_123_assignsubmission_file" but not "Mari Maasikas_…".
export function isStudentFolder(folderName: string, studentName: string): boolean {
  if (!folderName.startsWith(studentName)) return false
  const nextCharacter = folderName.charAt(studentName.length)
  return nextCharacter === '' || !NAME_CHARACTER.test(nextCharacter)
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
