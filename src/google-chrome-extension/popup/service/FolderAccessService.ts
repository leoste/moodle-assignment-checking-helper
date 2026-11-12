import { directoryHandleRepository } from '../../shared/repository/DirectoryHandleRepository'
import type { FileSourceInfo } from '../../shared/business/types/FileSourceInfo'
import { fileCacheClient } from '../communication/client/FileCacheClient'
import { fileSystemAccessProvider } from '../foundation/infrastructure/FileSystemAccessProvider'
import BaseService from '@shared/service/BaseService'

/*
TODO: there is some weird feel of wrongness around popup structure, this service, popuprenderer and popup.ts
i can't say what it is but it exists. if at some point anyone knows what it is for sure (no AI please thanks), fix it.
*/

class FolderAccessService extends BaseService {
  async selectFolder(source: FileSourceInfo): Promise<FileSystemDirectoryHandle | null> {
    const handle = await fileSystemAccessProvider.pickFolder()
    if (!handle) return null
    await directoryHandleRepository.setDirectoryHandle(source, handle)
    return handle
  }

  async refreshSource(source: FileSourceInfo): Promise<boolean> {
    const handle = await directoryHandleRepository.getDirectoryHandle(source)
    if (!handle) return false
    if (!await fileSystemAccessProvider.requestReadPermission(handle)) return false
    const files = await fileSystemAccessProvider.readFiles(handle)
    await fileCacheClient.updateCache(source.cacheKey, files)
    return true
  }
}

export const folderAccessService = new FolderAccessService()
