export default abstract class BaseRenderer {
  #root: HTMLElement | undefined

  get element(): HTMLElement {
    return this.#root!
  }

  async render(): Promise<void> {
    this.#root = this.createRoot()
    await this.renderContent(this.#root)
  }

  async clear(): Promise<void> {
    this.#root?.remove()
    this.#root = undefined
  }

  protected abstract createRoot(): HTMLElement

  protected async renderContent(_root: HTMLElement): Promise<void> {}
}
