import type {
  ASSIGNMENT_DIRECTORY_HANDLE_KEY,
  ASSIGNMENT_FILE_CACHE_KEY,
  AUTO_GRADE_KEY_PREFIX,
} from '../constants/storage'
import type { FileCache } from './FileCache'

export type IndexedDBSchema = {
  // written by the popup, which picks the folder and holds the read permission
  [ASSIGNMENT_DIRECTORY_HANDLE_KEY]: FileSystemDirectoryHandle
  // written by the service worker
  [ASSIGNMENT_FILE_CACHE_KEY]: FileCache
}

export type ChromeStorageSchema = {
  [key: AutoGradeKey]: true
}

export type DirectoryHandleKey = typeof ASSIGNMENT_DIRECTORY_HANDLE_KEY
export type FileCacheKey = typeof ASSIGNMENT_FILE_CACHE_KEY
export type AutoGradeKey = `${typeof AUTO_GRADE_KEY_PREFIX}:${string}`
