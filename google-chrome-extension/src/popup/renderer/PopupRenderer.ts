import { fileHandleRepository } from '../../shared/repository/FileHandleRepository'
import { FILES_GET_SOURCES } from '../../shared/constants/messages'
import type { FileSourceInfo } from '../../shared/types/FileSourceInfo'
import BaseRenderer from '../../shared/renderer/BaseRenderer'
import { createAndAddChildElement } from '../../shared/util/element-creation-helper'
import { folderAccessService } from '../service/FolderAccessService'

export default class PopupRenderer extends BaseRenderer {
  readonly #sourcesContainer: HTMLElement
  readonly #refreshBtn: HTMLButtonElement

  #sourceElements: HTMLElement[] = []

  constructor() {
    super()
    this.#sourcesContainer = document.getElementById('sources-container')!
    this.#refreshBtn = document.getElementById('refresh-btn') as HTMLButtonElement
  }

  async render(): Promise<void> {
    const sources = await this.#getSources()
    for (const source of sources) {
      this.#sourceElements.push(await this.#addSourceElement(source))
    }
    this.#refreshBtn.addEventListener('click', this.#onRefreshClick)
  }

  async clear(): Promise<void> {
    this.#refreshBtn.removeEventListener('click', this.#onRefreshClick)
    this.#sourceElements.forEach(element => element.remove())
    this.#sourceElements = []
  }

  #onRefreshClick = async (): Promise<void> => {
    const sources = await this.#getSources()
    this.#refreshBtn.disabled = true
    this.#refreshBtn.textContent = 'Uuendamine...'
    for (const source of sources) {
      await folderAccessService.refreshSource(source)
    }
    this.#refreshBtn.disabled = false
    this.#refreshBtn.textContent = 'Uuenda definitsioonid'
  }

  async #addSourceElement(source: FileSourceInfo): Promise<HTMLElement> {
    const handle = await fileHandleRepository.get<FileSystemDirectoryHandle>(source.directoryConfigKey)

    const div = createAndAddChildElement(this.#sourcesContainer, 'div', 'source')
    const nameEl = createAndAddChildElement(div, 'div', 'source-folder-name', handle ? handle.name : 'Kaust valimata')
    const selectBtn = createAndAddChildElement(div, 'button', null, `Vali ${source.displayName.toLowerCase()}`)

    selectBtn.addEventListener('click', async () => {
      const newHandle = await folderAccessService.selectFolder(source)
      if (newHandle) nameEl.textContent = newHandle.name
    })

    return div
  }

  async #getSources(): Promise<FileSourceInfo[]> {
    return chrome.runtime.sendMessage({ type: FILES_GET_SOURCES, content: {} }) as Promise<FileSourceInfo[]>
  }
}
