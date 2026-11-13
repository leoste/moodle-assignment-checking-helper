import BaseTyper from '@shared/presentation/typer/BaseTyper'
import { logWatcher } from '@shared/communication/watcher/LogWatcher'
import type { LogNews } from '@shared/business/types/News'
import { LOG_LEVEL_INFO } from '@shared/foundation/constants/news'
import { outputChannelProvider } from '../../foundation/infrastructure/OutputChannelProvider'

class OutputChannelTyper extends BaseTyper {
  protected override onInit(): undefined {
    logWatcher.subscribe(this.#write)
  }

  readonly #write = (news: LogNews): void => {
    if (news.level === LOG_LEVEL_INFO) outputChannelProvider.appendLine(this.#formatInfo(news.line, news.details))
    else outputChannelProvider.appendLine(this.#formatError(news.line, news.details))
  }

  #formatInfo(line: string, data: unknown): string {
    return data === undefined ? line : `${line} ${JSON.stringify(data)}`
  }

  #formatError(line: string, error: unknown): string {
    if (error === undefined) return line
    const details = error instanceof Error ? error.stack ?? error.message : String(error)
    return `${line} ${details}`
  }
}

export const outputChannelTyper = new OutputChannelTyper()
