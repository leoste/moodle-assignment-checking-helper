import type { ExtensionMessage } from '../types/ExtensionMessage'

export default class ChromeExtensionMessageClient {

    makeMessage<T>(type: string, content: T): ExtensionMessage<T> {
      return { type, content }
    }
}
