import WebviewMessageGenerator from './WebviewMessageGenerator'
import { NEWS_REPORT, NEWS_SUBSCRIBE } from '../../foundation/constants/webview-messages'
import type { WebviewMessage } from '../../business/types/WebviewMessage'
import type { BasePayload } from '@shared/business/types/BasePayload'
import type { NewsPayload } from '@shared/business/types/NewsPayload'
import type { News } from '@shared/business/types/News'

class NewsWebviewMessageGenerator extends WebviewMessageGenerator {
  getSubscribeMessage(): WebviewMessage<BasePayload> {
    return this.makeMessage(NEWS_SUBSCRIBE, {})
  }

  getReportMessage(news: News): WebviewMessage<NewsPayload> {
    return this.makeMessage(NEWS_REPORT, { news })
  }
}

export const newsWebviewMessageGenerator = new NewsWebviewMessageGenerator()
