import type { ExtensionMessage } from '../types/ExtensionMessage'
import BaseClient from '../../../../shared/client/BaseClient'

export default class ChromeExtensionMessageClient extends BaseClient {

    makeMessage<T>(type: string, content: T): ExtensionMessage<T> {
      return { type, content }
    }
}
