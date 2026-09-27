import type * as vscode from 'vscode'
import type { LogSink } from '@shared/logging/LogSink'

export default class OutputChannelLogSink implements LogSink {
  readonly #channel: vscode.OutputChannel

  constructor(channel: vscode.OutputChannel) {
    this.#channel = channel
  }

  info(line: string, data?: unknown): void {
    this.#channel.appendLine(data === undefined ? line : `${line} ${JSON.stringify(data)}`)
  }

  error(line: string, error?: unknown): void {
    if (error === undefined) {
      this.#channel.appendLine(line)
      return
    }
    const details = error instanceof Error ? error.stack ?? error.message : String(error)
    this.#channel.appendLine(`${line} ${details}`)
  }
}
