import ConsoleLogSink from './ConsoleLogSink'
import type { LogSink } from './LogSink'

const PREFIX = '[Moodle Helper]'

type LogSource = object | string

// Every extension bundle has its own logger. Its sink is chosen once, by the entry file of the context.
class Logger {
  #sink: LogSink | undefined

  init(sink: LogSink): void {
    if (this.#sink) return
    this.#sink = sink
  }

  info(source: LogSource, message: string, data?: unknown): void {
    this.#getSink().info(this.#format(source, message), data)
  }

  error(source: LogSource, message: string, error?: unknown): void {
    this.#getSink().error(this.#format(source, message), error)
  }

  #format(source: LogSource, message: string): string {
    const name = typeof source === 'string' ? source : source.constructor.name
    return `${PREFIX}[${name}] ${message}`
  }

  #getSink(): LogSink {
    if (!this.#sink) {
      this.#sink = new ConsoleLogSink()
      this.#sink.error(`${PREFIX}[Logger] Used before init, logging to the console.`)
    }
    return this.#sink
  }
}

export const logger = new Logger()
