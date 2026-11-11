import BaseReporter from './BaseReporter'
import ConsoleLogSink from './ConsoleLogSink'
import type { LogSink } from './LogSink'

const PREFIX = '[Moodle Helper]'

type LogSource = object | string

// Its sink is chosen once, by the entry file of the context.
class Logger extends BaseReporter<LogSink> {
  init(sink: LogSink): void {
    if (this.hasSink()) return
    this.setSink(sink)
  }

  info(source: LogSource, message: string, data?: unknown): void {
    this.sink.info(this.#format(source, message), data)
  }

  error(source: LogSource, message: string, error?: unknown): void {
    this.sink.error(this.#format(source, message), error)
  }

  protected createFallbackSink(): LogSink {
    const sink = new ConsoleLogSink()
    sink.error(`${PREFIX}[Logger] Used before init, logging to the console.`)
    return sink
  }

  #format(source: LogSource, message: string): string {
    const name = typeof source === 'string' ? source : source.constructor.name
    return `${PREFIX}[${name}] ${message}`
  }
}

export const logger = new Logger()
