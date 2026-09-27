import BaseInfrastructure from './BaseInfrastructure'
import type MessageHandlerMap from '../object/MessageHandlerMap'
import type { MessageHandler } from '../types/MessageHandler'
import type { BasePayload } from '../types/payload/BasePayload'
import { logger } from '../logging/logger'

export default abstract class BaseMessageReceiver<THandler extends MessageHandler, TResponder> extends BaseInfrastructure {
  readonly #handlerMap: MessageHandlerMap<THandler>

  constructor(handlerMap: MessageHandlerMap<THandler>) {
    super()
    this.#handlerMap = handlerMap
  }

  protected abstract respondHandled(responder: TResponder, response: unknown): void
  protected abstract respondUnhandled(responder: TResponder): void
  protected abstract respondError(responder: TResponder): void

  addHandler<TPayload extends BasePayload>(key: string, handler: MessageHandler<TPayload>): void {
    // The payload type is chosen at registration; the map stores handlers of any payload.
    this.#handlerMap.add(key, handler as unknown as THandler)
  }

  protected async dispatch(key: string, content: BasePayload, responder: TResponder): Promise<void> {
    logger.info(this, `received ${key}`, content)
    const handler = this.#handlerMap.get(key)
    if (!handler) {
      logger.error(this, `no handler registered for ${key}`)
      this.respondUnhandled(responder)
      return
    }
    try {
      const response = await handler(content)
      logger.info(this, `handled ${key}`)
      this.respondHandled(responder, response)
    } catch (err) {
      logger.error(this, `handler error for ${key}`, err)
      this.respondError(responder)
    }
  }
}
