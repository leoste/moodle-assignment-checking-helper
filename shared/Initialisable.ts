export default class Initialisable {
  static readonly #oneTimeInitiatedMethods = new WeakSet<Function>()
  #initialised = false

  init(): void {
    if (this.#initialised) return
    this.#initialised = true
    this.#tryOneTimeInit()
    this.onInit()
  }

  #tryOneTimeInit(): void {
    const method = this.onOneTimeInit
    if (!Initialisable.#oneTimeInitiatedMethods.has(method)) {
      Initialisable.#oneTimeInitiatedMethods.add(method)
      this.onOneTimeInit()
    }
  }

  // The hooks return `undefined` instead of `void` on purpose: an async override (returning a Promise)
  // is assignable to `void` but not to `undefined`, so this keeps initialisation synchronous.
  // Don't change it to `void`.

  /** Runs once per instance. */
  protected onInit(): undefined {}

  /**
   * Runs once per implementation of this method, not once per instance.
   * All subclasses that don't override it share the same run. Meant for setting up
   * infrastructure shared by a class hierarchy, e.g. a singleton dispatcher in a base class.
   */
  protected onOneTimeInit(): undefined {}
}
