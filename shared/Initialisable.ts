export default class Initialisable {
  #initialised = false

  init(): void {
    if (this.#initialised) return
    this.#initialised = true
    this.onInit()
  }

  // Returns `undefined` instead of `void` on purpose: an async override (returning a Promise)
  // is assignable to `void` but not to `undefined`, so this keeps initialisation synchronous.
  // Don't change it to `void`.
  protected onInit(): undefined {}
}
