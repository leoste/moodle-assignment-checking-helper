export default class AsyncInitialisable {
  static readonly #oneTimeInitiatedMethods = new WeakSet<Function>()
  #initialised = false
  #initPromise: Promise<void> | null = null

  async init(): Promise<void> {
    if (this.#initialised) return
    if (!this.#initPromise) {
      this.#initPromise = (async () => {
        await this.#tryOneTimeInit()
        await this.onInit()
        this.#initialised = true
      })()
    }
    return this.#initPromise
  }

  async #tryOneTimeInit(): Promise<void> {
    const method = this.onOneTimeInit
    if (!AsyncInitialisable.#oneTimeInitiatedMethods.has(method)) {
      AsyncInitialisable.#oneTimeInitiatedMethods.add(method)
      await this.onOneTimeInit()
    }
  }

  protected async onInit(): Promise<void> {}
  protected async onOneTimeInit(): Promise<void> {}
}
