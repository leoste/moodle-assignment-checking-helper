import { fileHandleRepository } from '../../background/repository/FileHandleRepository'
import { FILES_UPDATE_CACHE } from '../../constants/messages'
import type { FileSourceInfo } from '../../types'

export async function selectFolder(source: FileSourceInfo): Promise<FileSystemDirectoryHandle | null> {
  try {
    const handle = await window.showDirectoryPicker({ mode: 'read' })
    await fileHandleRepository.set(source.directoryConfigKey, handle)
    return handle
  } catch (e) {
    if (e instanceof DOMException && e.name === 'AbortError') return null
    throw e
  }
}

export async function refreshSource(source: FileSourceInfo): Promise<boolean> {
  const handle = await fileHandleRepository.get<FileSystemDirectoryHandle>(source.directoryConfigKey)
  if (!handle) return false
  const permission = await handle.requestPermission({ mode: 'read' })
  if (permission !== 'granted') return false
  const files = await readDirectory(handle)
  await chrome.runtime.sendMessage({ type: FILES_UPDATE_CACHE, content: { cacheKey: source.cacheKey, files } })
  return true
}

async function readDirectory(dirHandle: FileSystemDirectoryHandle): Promise<string[]> {
  const contents: string[] = []
  for await (const entry of dirHandle.values()) {
    if (entry.kind === 'file') {
      const file = await (entry as FileSystemFileHandle).getFile()
      contents.push(await file.text())
    } else if (entry.kind === 'directory') {
      contents.push(...await readDirectory(entry as FileSystemDirectoryHandle))
    }
  }
  return contents
}
