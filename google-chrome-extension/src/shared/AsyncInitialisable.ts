export default class AsyncInitialisable {
  #initialised = false
  #initPromise: Promise<void> | null = null

  async init(): Promise<void> {
    if (this.#initialised) return
    if (!this.#initPromise) {
      this.#initPromise = (async () => {
        await this.onInit()
        this.#initialised = true
      })()
    }
    return this.#initPromise
  }

  protected async onInit(): Promise<void> {}
}
