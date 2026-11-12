import type { Assignment } from '../../shared/types/Assignment'
import type { FileSourceInfo } from '../../shared/types/FileSourceInfo'
import BaseRenderer from '@shared/renderer/BaseRenderer'
import DefinitionListRenderer from './DefinitionListRenderer'
import StatusLineRenderer from '@shared/renderer/StatusLineRenderer'
import { createAndAddChildElement } from '@shared/util/element-creation-helper'
import formatDateTime from '../../shared/util/formatDateTime'
import { translations } from '@shared/translations/translations'

export interface PopupSource {
  source: FileSourceInfo
  folderName: string | null
}

export interface PopupCallbacks {
  onSelectFolder: (source: FileSourceInfo) => void
  onRefresh: () => void
  onReloadPanel: () => void
}

export default class PopupRenderer extends BaseRenderer {
  readonly #sources: PopupSource[]
  readonly #callbacks: PopupCallbacks
  readonly #sourcesContainer: HTMLElement
  readonly #refreshBtn: HTMLButtonElement
  readonly #refreshTime: HTMLElement
  readonly #definitionsContainer: HTMLElement
  readonly #statusContainer: HTMLElement
  readonly #introHint: HTMLElement
  readonly #refreshHint: HTMLElement
  readonly #reloadPanelBtn: HTMLButtonElement
  readonly #reloadPanelHint: HTMLElement

  readonly #folderNameElements = new Map<FileSourceInfo, HTMLElement>()
  #definitionListRenderer: DefinitionListRenderer | undefined
  #statusLineRenderer: StatusLineRenderer | undefined

  constructor(sources: PopupSource[], callbacks: PopupCallbacks) {
    super()
    this.#sources = sources
    this.#callbacks = callbacks
    this.#sourcesContainer = document.getElementById('sources-container')!
    this.#refreshBtn = document.getElementById('refresh-btn') as HTMLButtonElement
    this.#refreshTime = document.getElementById('refresh-time')!
    this.#definitionsContainer = document.getElementById('definitions-container')!
    this.#statusContainer = document.getElementById('status-container')!
    this.#introHint = document.getElementById('intro-hint')!
    this.#refreshHint = document.getElementById('refresh-hint')!
    this.#reloadPanelBtn = document.getElementById('reload-panel-btn') as HTMLButtonElement
    this.#reloadPanelHint = document.getElementById('reload-panel-hint')!
  }

  protected createRoot(): HTMLElement {
    return createAndAddChildElement(this.#sourcesContainer, 'div')
  }

  protected async renderContent(root: HTMLElement): Promise<void> {
    this.#introHint.textContent = translations.popup.intro
    this.#refreshHint.textContent = translations.fileSource.refreshHint
    this.#reloadPanelBtn.textContent = translations.popup.reloadPanel
    this.#reloadPanelHint.textContent = translations.popup.reloadPanelHint
    for (const source of this.#sources) {
      this.#addSourceElement(root, source)
    }
    this.setRefreshing(false)
    this.#refreshBtn.addEventListener('click', this.#callbacks.onRefresh)
    this.#reloadPanelBtn.addEventListener('click', this.#callbacks.onReloadPanel)
    this.#statusLineRenderer = new StatusLineRenderer(this.#statusContainer)
    await this.#statusLineRenderer.render()
  }

  async clear(): Promise<void> {
    this.#refreshBtn.removeEventListener('click', this.#callbacks.onRefresh)
    this.#reloadPanelBtn.removeEventListener('click', this.#callbacks.onReloadPanel)
    this.#folderNameElements.clear()
    await this.#definitionListRenderer?.clear()
    await this.#statusLineRenderer?.clear()
    await super.clear()
  }

  get statusLine(): StatusLineRenderer {
    return this.#statusLineRenderer!
  }

  setFolderName(source: FileSourceInfo, folderName: string): void {
    const element = this.#folderNameElements.get(source)
    if (element) element.textContent = folderName
  }

  setRefreshing(refreshing: boolean): void {
    this.#refreshBtn.disabled = refreshing
    this.#refreshBtn.textContent = refreshing ? translations.fileSource.refreshing : translations.fileSource.refresh
  }

  setRefreshTime(refreshedAt: Date | null): void {
    this.#refreshTime.textContent = refreshedAt ? formatDateTime(refreshedAt) : translations.fileSource.notRefreshed
  }

  async renderDefinitions(assignments: Assignment[]): Promise<void> {
    await this.#definitionListRenderer?.clear()
    this.#definitionListRenderer = new DefinitionListRenderer(this.#definitionsContainer, assignments)
    await this.#definitionListRenderer.render()
  }

  #addSourceElement(root: HTMLElement, { source, folderName }: PopupSource): void {
    const div = createAndAddChildElement(root, 'div', 'row')
    const selectBtn = createAndAddChildElement(
      div,
      'button',
      ['checking-helper-button', 'checking-helper-interactive'],
      translations.fileSource.selectFolder(source.displayName),
    )
    const nameEl = createAndAddChildElement(div, 'div', 'text', folderName ?? translations.fileSource.folderNotSelected)

    this.#folderNameElements.set(source, nameEl)
    selectBtn.addEventListener('click', () => this.#callbacks.onSelectFolder(source))
  }
}
