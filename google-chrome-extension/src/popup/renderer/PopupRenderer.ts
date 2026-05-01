import { fileHandleRepository } from '../../shared/repository/FileHandleRepository'
import { FILES_GET_SOURCES } from '../../shared/constants/messages'
import type { FileSourceInfo } from '../../shared/types'
import { folderAccessService } from '../service/FolderAccessService'

export default class PopupRenderer {
  readonly #sourcesContainer: HTMLElement
  readonly #refreshBtn: HTMLButtonElement

  constructor() {
    this.#sourcesContainer = document.getElementById('sources-container')!
    this.#refreshBtn = document.getElementById('refresh-btn') as HTMLButtonElement
  }

  async init(): Promise<void> {
    const sources = await this.#getSources()
    for (const source of sources) {
      this.#sourcesContainer.appendChild(await this.#createSourceElement(source))
    }
    this.#refreshBtn.addEventListener('click', () => this.#onRefreshClick())
  }

  async #onRefreshClick(): Promise<void> {
    const sources = await this.#getSources()
    this.#refreshBtn.disabled = true
    this.#refreshBtn.textContent = 'Uuendamine...'
    for (const source of sources) {
      await folderAccessService.refreshSource(source)
    }
    this.#refreshBtn.disabled = false
    this.#refreshBtn.textContent = 'Uuenda definitsioonid'
  }

  async #createSourceElement(source: FileSourceInfo): Promise<HTMLElement> {
    const div = document.createElement('div')
    div.className = 'source'

    const nameEl = document.createElement('div')
    nameEl.className = 'source-folder-name'

    const handle = await fileHandleRepository.get<FileSystemDirectoryHandle>(source.directoryConfigKey)
    nameEl.textContent = handle ? handle.name : 'Kaust valimata'

    const selectBtn = document.createElement('button')
    selectBtn.textContent = `Vali ${source.displayName.toLowerCase()}`
    selectBtn.addEventListener('click', async () => {
      const newHandle = await folderAccessService.selectFolder(source)
      if (newHandle) nameEl.textContent = newHandle.name
    })

    div.appendChild(nameEl)
    div.appendChild(selectBtn)
    return div
  }

  async #getSources(): Promise<FileSourceInfo[]> {
    return chrome.runtime.sendMessage({ type: FILES_GET_SOURCES, content: {} }) as Promise<FileSourceInfo[]>
  }
}
