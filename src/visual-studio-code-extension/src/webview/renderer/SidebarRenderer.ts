import BaseRenderer from '@shared/renderer/BaseRenderer'
import StatusLineRenderer from '@shared/renderer/StatusLineRenderer'
import { createAndAddChildElement } from '@shared/util/element-creation-helper'
import type { StatusSink } from '@shared/reporting/StatusSink'
import { translations } from '@shared/translations/translations'
import SettingToggleRenderer from './SettingToggleRenderer'
import type { Settings } from '../../shared/types/Settings'

export interface SidebarCallbacks {
  onOpenSubDirectoriesChanged: (openSubDirectories: boolean) => void
}

// Built like the Chrome popup: a frame with a scroll area and the status line in a bottom strip.
export default class SidebarRenderer extends BaseRenderer {
  readonly #parentElement: HTMLElement
  readonly #callbacks: SidebarCallbacks

  #openSubDirectoriesToggle: SettingToggleRenderer | undefined
  #statusLineRenderer: StatusLineRenderer | undefined

  constructor(parentElement: HTMLElement, callbacks: SidebarCallbacks) {
    super()
    this.#parentElement = parentElement
    this.#callbacks = callbacks
  }

  protected createRoot(): HTMLElement {
    return createAndAddChildElement(this.#parentElement, 'div', 'checking-helper-sidebar-frame')
  }

  protected async renderContent(root: HTMLElement) {
    const scrollArea = createAndAddChildElement(root, 'div', 'checking-helper-sidebar-scroll-area')
    createAndAddChildElement(scrollArea, 'h2', null, translations.sidebar.settingsTitle)
    this.#openSubDirectoriesToggle = new SettingToggleRenderer(
      scrollArea,
      translations.sidebar.openSubDirectories,
      this.#callbacks.onOpenSubDirectoriesChanged,
    )
    await this.#openSubDirectoriesToggle.render()

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
}
