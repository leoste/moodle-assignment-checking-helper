import type { DirectoryHandleKey, FileCacheKey } from './StorageSchema'

export interface FileSourceInfo {
  displayName: string
  directoryHandleKey: DirectoryHandleKey
  cacheKey: FileCacheKey
}
