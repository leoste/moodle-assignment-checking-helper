import { announcer } from '../../communication/announcer/Announcer'

export default abstract class BaseRenderer {
  #root: HTMLElement | undefined

  get element(): HTMLElement {
    return this.#root!
  }

  async render(): Promise<void> {
    this.#root = this.createRoot()
    await this.renderContent(this.#root)
    announcer.announceLog(this, 'rendered')
  }

  async clear(): Promise<void> {
    this.#root?.remove()
    this.#root = undefined
    announcer.announceLog(this, 'cleared')
  }

  protected abstract createRoot(): HTMLElement

  protected async renderContent(_root: HTMLElement): Promise<void> {}
}
