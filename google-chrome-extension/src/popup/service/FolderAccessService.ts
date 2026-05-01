import { fileHandleRepository } from '../../shared/repository/FileHandleRepository'
import { FILES_UPDATE_CACHE } from '../../shared/constants/messages'
import type { FileSourceInfo } from '../../shared/types'

/*
TODO: important before can add new features!
folderaccessservice shouldn't contain chrome.runtime.sendmessage in it plainly.
message sending should be abstracted away into FileCacheClient, cause it's talking with FileCacheController using these messages.
this might also need baseclient to be moved into shared folder, if it isn't already.
*/

/*
TODO: there is some weird feel of wrongness around popup structure, this service, popuprenderer and popup.ts
i can't say what it is but it exists. if at some point anyone knows what it is for sure (no AI please thanks), fix it.
*/

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
