import type { StatusSink } from './StatusSink'
import type { Status } from '../types/Status'

// Shows the statuses in several sinks at once, e.g. in VS Code's status bar and in the sidebar.
export default class StatusSinkGroup implements StatusSink {
  readonly #sinks: readonly StatusSink[]

  constructor(sinks: readonly StatusSink[]) {
    this.#sinks = sinks
  }

  show(statuses: readonly Status[]): void {
    this.#sinks.forEach(sink => sink.show(statuses))
  }
}
