import BaseWatcher from '@shared/communication/watcher/BaseWatcher'
import type { News } from '@shared/business/types/News'
import { LOG_LEVEL_INFO, NEWS_TYPE_LOG } from '@shared/foundation/constants/news'
import { outputChannelProvider } from '../../foundation/infrastructure/OutputChannelProvider'

class OutputChannelWatcher extends BaseWatcher {
  watch(news: News): void {
    if (news.type !== NEWS_TYPE_LOG) return
    if (news.level === LOG_LEVEL_INFO) this.#writeInfo(news.line, news.details)
    else this.#writeError(news.line, news.details)
  }

  #writeInfo(line: string, data: unknown): void {
    outputChannelProvider.appendLine(data === undefined ? line : `${line} ${JSON.stringify(data)}`)
  }

  #writeError(line: string, error: unknown): void {
    if (error === undefined) {
      outputChannelProvider.appendLine(line)
      return
    }
    const details = error instanceof Error ? error.stack ?? error.message : String(error)
    outputChannelProvider.appendLine(`${line} ${details}`)
  }
}

export const outputChannelWatcher = new OutputChannelWatcher()
