import type { ChromeMessage } from '../types/ChromeMessage'
import BaseClient from '@shared/client/BaseClient'

export default class ChromeMessageClient extends BaseClient {

    protected async send<TResponse>(message: ChromeMessage): Promise<TResponse> {
      return chrome.runtime.sendMessage(message) as Promise<TResponse>
    }
}
