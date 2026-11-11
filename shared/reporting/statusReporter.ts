import BaseReporter from './BaseReporter'
import type { StatusSink } from './StatusSink'
import type { Status, StatusTopic } from '../types/Status'
import { STATUS_TOPICS } from '../constants/status'

// Keeps the current status of every topic: a new status replaces the old one of its topic.
// The sink can change, e.g. the panel's status line is new on every page, and always shows the current statuses.
class StatusReporter extends BaseReporter<StatusSink> {
  readonly #statuses = new Map<StatusTopic, Status>()

  override setSink(sink: StatusSink): void {
    super.setSink(sink)
    sink.show(this.#getStatuses())
  }

  report(status: Status): void {
    this.#statuses.set(status.topic, status)
    this.sink.show(this.#getStatuses())
  }

  clear(topic: StatusTopic): void {
    this.#statuses.delete(topic)
    this.sink.show(this.#getStatuses())
  }

  protected createFallbackSink(): StatusSink {
    return { show: () => {} }
  }

  #getStatuses(): Status[] {
    return STATUS_TOPICS
      .map(topic => this.#statuses.get(topic))
      .filter(status => status !== undefined)
  }
}

export const statusReporter = new StatusReporter()
