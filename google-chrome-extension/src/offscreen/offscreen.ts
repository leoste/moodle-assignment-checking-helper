import { configRepository } from '../background/repository/ConfigRepository'
import { OFFSCREEN_READ_FILES } from '../constants/messages'

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type !== OFFSCREEN_READ_FILES) return false
  readFiles().then(sendResponse)
  return true
})

async function readFiles(): Promise<string[]> {
  const { directoryHandle } = await configRepository.getConfig()
  if (!directoryHandle) return []
  try {
    return await readDirectory(directoryHandle)
  } catch (e) {
    console.warn('Offscreen: failed to read definitions folder', e)
    return []
  }
}

async function readDirectory(dirHandle: FileSystemDirectoryHandle): Promise<string[]> {
  const contents: string[] = []
  for await (const entry of dirHandle.values()) {
    if (entry.kind === 'file' && entry.name.endsWith('.json')) {
      const file = await (entry as FileSystemFileHandle).getFile()
      contents.push(await file.text())
    } else if (entry.kind === 'directory') {
      const sub = await readDirectory(entry as FileSystemDirectoryHandle)
      contents.push(...sub)
    }
  }
  return contents
}
