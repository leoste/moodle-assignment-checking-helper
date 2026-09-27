import type { FileSourceInfo } from '../../shared/types/FileSourceInfo'
import BaseRenderer from '../../shared/renderer/BaseRenderer'
import { createAndAddChildElement } from '../../shared/util/element-creation-helper'
import { translations } from '@shared/translations/translations'

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

  readonly #folderNameElements = new Map<FileSourceInfo, HTMLElement>()

  constructor(sources: PopupSource[], callbacks: PopupCallbacks) {
    super()
    this.#sources = sources
    this.#callbacks = callbacks
    this.#sourcesContainer = document.getElementById('sources-container')!
    this.#refreshBtn = document.getElementById('refresh-btn') as HTMLButtonElement
  }

  protected createRoot(): HTMLElement {
    return createAndAddChildElement(this.#sourcesContainer, 'div')
  }

  protected async renderContent(root: HTMLElement): Promise<void> {
    for (const source of this.#sources) {
      this.#addSourceElement(root, source)
    }
    this.setRefreshing(false)
    this.#refreshBtn.addEventListener('click', this.#callbacks.onRefresh)
  }

  async clear(): Promise<void> {
    this.#refreshBtn.removeEventListener('click', this.#callbacks.onRefresh)
    this.#folderNameElements.clear()
    await super.clear()
  }

  setFolderName(source: FileSourceInfo, folderName: string): void {
    const element = this.#folderNameElements.get(source)
    if (element) element.textContent = folderName
  }

  setRefreshing(refreshing: boolean): void {
    this.#refreshBtn.disabled = refreshing
    this.#refreshBtn.textContent = refreshing ? translations.definitions.refreshing : translations.definitions.refresh
  }

  #addSourceElement(root: HTMLElement, { source, folderName }: PopupSource): void {
    const div = createAndAddChildElement(root, 'div', 'source')
    const nameEl = createAndAddChildElement(div, 'div', 'source-folder-name', folderName ?? translations.fileSource.folderNotSelected)
    const selectBtn = createAndAddChildElement(div, 'button', null, translations.fileSource.selectFolder(source.displayName))

    this.#folderNameElements.set(source, nameEl)
    selectBtn.addEventListener('click', () => this.#callbacks.onSelectFolder(source))
  }
}
