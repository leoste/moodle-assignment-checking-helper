import type { FileSourceInfo } from '../../shared/types/FileSourceInfo'
import BaseRenderer from '../../shared/renderer/BaseRenderer'
import { createAndAddChildElement } from '../../shared/util/element-creation-helper'

export interface PopupSource {
  source: FileSourceInfo
  folderName: string | null
}

export interface PopupCallbacks {
  onSelectFolder: (source: FileSourceInfo) => void
  onRefresh: () => void
}

export default class PopupRenderer extends BaseRenderer {
  readonly #sources: PopupSource[]
  readonly #callbacks: PopupCallbacks
  readonly #sourcesContainer: HTMLElement
  readonly #refreshBtn: HTMLButtonElement

  #sourceElements: HTMLElement[] = []
  readonly #folderNameElements = new Map<FileSourceInfo, HTMLElement>()

  constructor(sources: PopupSource[], callbacks: PopupCallbacks) {
    super()
    this.#sources = sources
    this.#callbacks = callbacks
    this.#sourcesContainer = document.getElementById('sources-container')!
    this.#refreshBtn = document.getElementById('refresh-btn') as HTMLButtonElement
  }

  async render(): Promise<void> {
    for (const source of this.#sources) {
      this.#sourceElements.push(this.#addSourceElement(source))
    }
    this.#refreshBtn.addEventListener('click', this.#callbacks.onRefresh)
  }

  async clear(): Promise<void> {
    this.#refreshBtn.removeEventListener('click', this.#callbacks.onRefresh)
    this.#sourceElements.forEach(element => element.remove())
    this.#sourceElements = []
    this.#folderNameElements.clear()
  }

  setFolderName(source: FileSourceInfo, folderName: string): void {
    const element = this.#folderNameElements.get(source)
    if (element) element.textContent = folderName
  }

  setRefreshing(refreshing: boolean): void {
    this.#refreshBtn.disabled = refreshing
    this.#refreshBtn.textContent = refreshing ? 'Uuendamine...' : 'Uuenda definitsioonid'
  }

  #addSourceElement({ source, folderName }: PopupSource): HTMLElement {
    const div = createAndAddChildElement(this.#sourcesContainer, 'div', 'source')
    const nameEl = createAndAddChildElement(div, 'div', 'source-folder-name', folderName ?? 'Kaust valimata')
    const selectBtn = createAndAddChildElement(div, 'button', null, `Vali ${source.displayName.toLowerCase()}`)

    this.#folderNameElements.set(source, nameEl)
    selectBtn.addEventListener('click', () => this.#callbacks.onSelectFolder(source))

    return div
  }
}
