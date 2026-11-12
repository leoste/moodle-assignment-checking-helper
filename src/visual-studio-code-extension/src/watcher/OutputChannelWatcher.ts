import type * as vscode from 'vscode'
import BaseWatcher from '@shared/watcher/BaseWatcher'
import type { News } from '@shared/types/News'
import { LOG_LEVEL_INFO, NEWS_TYPE_LOG } from '@shared/constants/news'

export default class OutputChannelWatcher extends BaseWatcher {
  readonly #channel: vscode.OutputChannel

  constructor(channel: vscode.OutputChannel) {
    super()
    this.#channel = channel
  }

  watch(news: News): void {
    if (news.type !== NEWS_TYPE_LOG) return
    if (news.level === LOG_LEVEL_INFO) this.#writeInfo(news.line, news.details)
    else this.#writeError(news.line, news.details)
  }

  #writeInfo(line: string, data: unknown): void {
    this.#channel.appendLine(data === undefined ? line : `${line} ${JSON.stringify(data)}`)
  }

  #writeError(line: string, error: unknown): void {
    if (error === undefined) {
      this.#channel.appendLine(line)
      return
    }
    const details = error instanceof Error ? error.stack ?? error.message : String(error)
    this.#channel.appendLine(`${line} ${details}`)
  }
}
