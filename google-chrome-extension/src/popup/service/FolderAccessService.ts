import { fileHandleRepository } from '../../shared/repository/FileHandleRepository'
import type { FileSourceInfo } from '../../shared/types/FileSourceInfo'
import { fileCacheClient } from '../client/FileCacheClient'
import BaseService from '@shared/service/BaseService'

/*
TODO: there is some weird feel of wrongness around popup structure, this service, popuprenderer and popup.ts
i can't say what it is but it exists. if at some point anyone knows what it is for sure (no AI please thanks), fix it.
*/

class FolderAccessService extends BaseService {
  async selectFolder(source: FileSourceInfo): Promise<FileSystemDirectoryHandle | null> {
    try {
      const handle = await window.showDirectoryPicker({ mode: 'read' })
      await fileHandleRepository.set(source.directoryConfigKey, handle)
      return handle
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') return null
      throw e
    }
  }

  async refreshSource(source: FileSourceInfo): Promise<boolean> {
    const handle = await fileHandleRepository.get<FileSystemDirectoryHandle>(source.directoryConfigKey)
    if (!handle) return false
    const permission = await handle.requestPermission({ mode: 'read' })
    if (permission !== 'granted') return false
    const files = await this.#readDirectory(handle)
    await fileCacheClient.updateCache(source.cacheKey, files)
    return true
  }

  async #readDirectory(dirHandle: FileSystemDirectoryHandle): Promise<string[]> {
    const contents: string[] = []
    for await (const entry of dirHandle.values()) {
      if (entry.kind === 'file') {
        const file = await (entry as FileSystemFileHandle).getFile()
        contents.push(await file.text())
      } else if (entry.kind === 'directory') {
        contents.push(...await this.#readDirectory(entry as FileSystemDirectoryHandle))
      }
    }
    return contents
  }
}

export const folderAccessService = new FolderAccessService()
