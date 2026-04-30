import { DEFINITIONS_CACHE_KEY } from '../background/repository/LocalFileRepository'
import { configRepository } from '../background/repository/ConfigRepository'

const folderNameEl = document.getElementById('folder-name')!
const syncStatusEl = document.getElementById('sync-status')!
const selectBtn = document.getElementById('select-btn')!

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

async function syncToStorage(handle: FileSystemDirectoryHandle): Promise<void> {
  syncStatusEl.textContent = 'Sünkroniseerin...'
  const contents = await readDirectory(handle)
  await chrome.storage.local.set({ [DEFINITIONS_CACHE_KEY]: contents })
  syncStatusEl.textContent = `${contents.length} faili sünkroniseeritud`
}

async function init(): Promise<void> {
  const { directoryHandle } = await configRepository.getConfig()
  if (!directoryHandle) return
  folderNameEl.textContent = directoryHandle.name
  await syncToStorage(directoryHandle)
}

selectBtn.addEventListener('click', async () => {
  try {
    const directoryHandle = await window.showDirectoryPicker({ mode: 'read' })
    await configRepository.setConfig({ directoryHandle })
    folderNameEl.textContent = directoryHandle.name
    await syncToStorage(directoryHandle)
  } catch (e) {
    if (e instanceof DOMException && e.name === 'AbortError') return
    console.error('Kausta valimine ebaõnnestus:', e)
    syncStatusEl.textContent = 'Viga kausta lugemisel'
  }
})

init()
