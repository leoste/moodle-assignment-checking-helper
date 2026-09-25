export default class AsyncInitialisable {
  static readonly #oneTimeInits = new WeakMap<Function, Promise<void>>()
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
    let promise = AsyncInitialisable.#oneTimeInits.get(method)
    if (!promise) {
      promise = this.onOneTimeInit()
      AsyncInitialisable.#oneTimeInits.set(method, promise)
    }
    // Every instance waits for the same one-time init to finish, not only the first one.
    await promise
  }

  /** Runs once per instance. */
  protected async onInit(): Promise<void> {}

  /**
   * Runs once per implementation of this method, not once per instance.
   * All subclasses that don't override it share the same run. Meant for setting up
   * infrastructure shared by a class hierarchy, e.g. a singleton dispatcher in a base class.
   */
  protected async onOneTimeInit(): Promise<void> {}
}
