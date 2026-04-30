import { fileHandleRepository } from '../background/repository/FileHandleRepository'
import { FILES_GET_SOURCES } from '../constants/messages'
import type { FileSourceInfo } from '../types'
import { refreshSource, selectFolder } from './service/FolderAccessService'

// TODO: refactor popup.ts into components and stuff

const sourcesContainer = document.getElementById('sources-container')!
const refreshBtn = document.getElementById('refresh-btn') as HTMLButtonElement

async function init(): Promise<void> {
  const sources = await chrome.runtime.sendMessage({ type: FILES_GET_SOURCES, content: {} }) as FileSourceInfo[]
  for (const source of sources) {
    sourcesContainer.appendChild(await createSourceElement(source))
  }
}

async function createSourceElement(source: FileSourceInfo): Promise<HTMLElement> {
  const div = document.createElement('div')
  div.className = 'source'

  const nameEl = document.createElement('div')
  nameEl.className = 'source-folder-name'

  const handle = await fileHandleRepository.get<FileSystemDirectoryHandle>(source.directoryConfigKey)
  nameEl.textContent = handle ? handle.name : 'Kaust valimata'

  const selectBtn = document.createElement('button')
  selectBtn.textContent = `Vali ${source.displayName.toLowerCase()}`
  selectBtn.addEventListener('click', async () => {
    const newHandle = await selectFolder(source)
    if (newHandle) nameEl.textContent = newHandle.name
  })

  div.appendChild(nameEl)
  div.appendChild(selectBtn)
  return div
}

refreshBtn.addEventListener('click', async () => {
  const sources = await chrome.runtime.sendMessage({ type: FILES_GET_SOURCES, content: {} }) as FileSourceInfo[]
  refreshBtn.disabled = true
  refreshBtn.textContent = 'Uuendamine...'
  for (const source of sources) {
    await refreshSource(source)
  }
  refreshBtn.disabled = false
  refreshBtn.textContent = 'Uuenda definitsioonid'
})

init()
