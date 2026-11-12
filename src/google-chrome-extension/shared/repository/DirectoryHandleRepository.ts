import IndexedDBRepository from './IndexedDBRepository'
import type { FileSourceInfo } from '../business/types/FileSourceInfo'

class DirectoryHandleRepository extends IndexedDBRepository {
  getDirectoryHandle(source: FileSourceInfo): Promise<FileSystemDirectoryHandle | undefined> {
    return this.getValue(source.directoryHandleKey)
  }

  setDirectoryHandle(source: FileSourceInfo, handle: FileSystemDirectoryHandle): Promise<void> {
    return this.setValue(source.directoryHandleKey, handle)
  }
}

export const directoryHandleRepository = new DirectoryHandleRepository()
