import WebviewMessageGenerator from './WebviewMessageGenerator'
import { NEWS_REPORT, NEWS_SUBSCRIBE } from '../constants/webview-messages'
import type { WebviewMessage } from '../types/WebviewMessage'
import type { BasePayload } from '@shared/types/BasePayload'
import type { NewsPayload } from '@shared/types/NewsPayload'
import type { News } from '@shared/types/News'

class NewsWebviewMessageGenerator extends WebviewMessageGenerator {
  getSubscribeMessage(): WebviewMessage<BasePayload> {
    return this.makeMessage(NEWS_SUBSCRIBE, {})
  }

  getReportMessage(news: News): WebviewMessage<NewsPayload> {
    return this.makeMessage(NEWS_REPORT, { news })
  }
}

export const newsWebviewMessageGenerator = new NewsWebviewMessageGenerator()
