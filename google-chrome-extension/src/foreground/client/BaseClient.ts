import type { ExtensionMessage } from '../../shared/types'

export default class BaseClient {

    makeMessage<T>(type: string, content: T): ExtensionMessage<T> {
      return { type, content }
    }
}