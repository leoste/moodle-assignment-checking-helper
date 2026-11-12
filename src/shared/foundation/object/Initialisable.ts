import { announcer } from '../../communication/announcer/Announcer'

// This doesn't really belong in "object" due to it being used to create objects of other layers, not simply being
// used by them, but i didn't have a better idea.
export default class Initialisable {
  #initialised = false

  init(): void {
    if (this.#initialised) return
    this.#initialised = true
    this.onInit()
    announcer.announceLog(this, 'initialised')
  }

  // Returns `undefined` instead of `void` on purpose: an async override (returning a Promise)
  // is assignable to `void` but not to `undefined`, so this keeps initialisation synchronous.
  // Don't change it to `void`.
  protected onInit(): undefined {}
}
