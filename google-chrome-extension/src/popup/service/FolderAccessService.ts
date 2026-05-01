import { fileHandleRepository } from '../../shared/repository/FileHandleRepository'
import { FILES_UPDATE_CACHE } from '../../shared/constants/messages'
import type { FileSourceInfo } from '../../shared/types'

class FolderAccessService {
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
    await chrome.runtime.sendMessage({ type: FILES_UPDATE_CACHE, content: { cacheKey: source.cacheKey, files } })
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
