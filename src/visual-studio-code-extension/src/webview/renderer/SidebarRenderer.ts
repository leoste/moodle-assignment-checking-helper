import BaseRenderer from '@shared/renderer/BaseRenderer'
import StatusLineRenderer from '@shared/renderer/StatusLineRenderer'
import { createAndAddChildElement } from '@shared/util/element-creation-helper'
import type { StatusSink } from '@shared/reporting/StatusSink'
import { translations } from '@shared/translations/translations'
import SettingToggleRenderer from './SettingToggleRenderer'
import type { Settings } from '../../shared/types/Settings'

export interface SidebarCallbacks {
  onOpenSubDirectoriesChanged: (openSubDirectories: boolean) => void
  onTakeOver: () => void
}

// Built like the Chrome popup: a frame with a scroll area and the status line in a bottom strip.
export default class SidebarRenderer extends BaseRenderer {
  readonly #callbacks: SidebarCallbacks

  #openSubDirectoriesToggle: SettingToggleRenderer | undefined
  #takeOverButton: HTMLButtonElement | undefined
  #statusLineRenderer: StatusLineRenderer | undefined

  constructor(callbacks: SidebarCallbacks) {
    super()
    this.#callbacks = callbacks
  }

  protected createRoot(): HTMLElement {
    return createAndAddChildElement(document.body, 'div', 'checking-helper-sidebar-frame')
  }

  protected async renderContent(root: HTMLElement) {
    const scrollArea = createAndAddChildElement(root, 'div', 'checking-helper-sidebar-scroll-area')

    const settingsSection = createAndAddChildElement(scrollArea, 'div', 'checking-helper-sidebar-section')
    createAndAddChildElement(settingsSection, 'h2', null, translations.sidebar.settingsTitle)
    this.#openSubDirectoriesToggle = new SettingToggleRenderer(
      settingsSection,
      translations.sidebar.openSubDirectories,
      this.#callbacks.onOpenSubDirectoriesChanged,
    )
    await this.#openSubDirectoriesToggle.render()

    const connectionSection = createAndAddChildElement(scrollArea, 'div', 'checking-helper-sidebar-section')
    createAndAddChildElement(connectionSection, 'h2', null, translations.sidebar.connectionTitle)
    this.#takeOverButton = createAndAddChildElement(
      connectionSection,
      'button',
      ['checking-helper-button', 'checking-helper-interactive'],
      translations.connection.takeOver,
    ) as HTMLButtonElement
    // Usable only once the extension has said that this window doesn't receive the students.
    this.#takeOverButton.disabled = true
    this.#takeOverButton.addEventListener('click', this.#callbacks.onTakeOver)

    const bottomStrip = createAndAddChildElement(root, 'div', 'checking-helper-sidebar-bottom-strip')
    this.#statusLineRenderer = new StatusLineRenderer(bottomStrip)
    await this.#statusLineRenderer.render()
  }

  get statusLine(): StatusSink {
    return this.#statusLineRenderer!
  }

  setSettings(settings: Settings): void {
    this.#openSubDirectoriesToggle?.setChecked(settings.openSubDirectories)
  }

  // Greyed out in the window that receives the students.
  setReceiving(receiving: boolean): void {
    if (this.#takeOverButton) this.#takeOverButton.disabled = receiving
  }
}
