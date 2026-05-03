import type { ExtensionMessage } from '../types'

export default class BaseClient {

    makeMessage<T>(type: string, content: T): ExtensionMessage<T> {
      return { type, content }
    }
}
