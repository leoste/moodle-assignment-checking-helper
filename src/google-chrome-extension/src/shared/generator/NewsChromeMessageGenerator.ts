import ChromeMessageGenerator from './ChromeMessageGenerator'
import { NEWS_REPORT, NEWS_SUBSCRIBE } from '../constants/messages'
import type { BasePayload } from '@shared/types/payload/BasePayload'
import type { NewsPayload } from '@shared/types/payload/NewsPayload'
import type { News } from '@shared/types/News'
import type { ChromeMessage } from '../types/ChromeMessage'

class NewsChromeMessageGenerator extends ChromeMessageGenerator {
  getSubscribeMessage(): ChromeMessage<BasePayload> {
    return this.makeMessage(NEWS_SUBSCRIBE, {})
  }

  getReportMessage(news: News): ChromeMessage<NewsPayload> {
    return this.makeMessage(NEWS_REPORT, { news })
  }
}

export const newsChromeMessageGenerator = new NewsChromeMessageGenerator()
