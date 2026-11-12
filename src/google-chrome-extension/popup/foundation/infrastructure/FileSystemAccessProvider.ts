import BaseInfrastructure from '@shared/foundation/infrastructure/BaseInfrastructure'
import type { CachedFile } from '../../../shared/business/types/CachedFile'

class FileSystemAccessProvider extends BaseInfrastructure {
  // Null when the lecturer cancels the folder picker.
  async pickFolder(): Promise<FileSystemDirectoryHandle | null> {
    try {
      return await window.showDirectoryPicker({ mode: 'read' })
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') return null
      throw e
    }
  }

  async requestReadPermission(handle: FileSystemDirectoryHandle): Promise<boolean> {
    return await handle.requestPermission({ mode: 'read' }) === 'granted'
  }

  async readFiles(dirHandle: FileSystemDirectoryHandle): Promise<CachedFile[]> {
    const files: CachedFile[] = []
    for await (const entry of dirHandle.values()) {
      if (entry.kind === 'file') {
        const file = await (entry as FileSystemFileHandle).getFile()
        files.push({ name: entry.name, content: await file.text() })
      } else if (entry.kind === 'directory') {
        files.push(...await this.readFiles(entry as FileSystemDirectoryHandle))
      }
    }
    return files
  }
}

export const fileSystemAccessProvider = new FileSystemAccessProvider()
