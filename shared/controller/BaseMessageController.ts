import BaseController from './BaseController'
import type MessageHandlerMap from '../object/MessageHandlerMap'
import type { MessageHandler } from '../types/MessageHandler'
import type { BasePayload } from '../types/payload/BasePayload'

export default abstract class BaseMessageController<THandler extends MessageHandler, TResponder> extends BaseController {
  protected abstract getHandlerMap(): MessageHandlerMap<THandler>
  protected abstract respondHandled(responder: TResponder, response: unknown): void
  protected abstract respondUnhandled(responder: TResponder): void
  protected abstract respondError(responder: TResponder): void

  addMessageHandler<TPayload extends BasePayload>(key: string, handler: MessageHandler<TPayload>): void {
    // The payload type is chosen at registration; the map stores handlers of any payload.
    this.getHandlerMap().add(key, handler as unknown as THandler)
  }

  protected async dispatch(key: string, content: BasePayload, responder: TResponder): Promise<void> {
    const handler = this.getHandlerMap().get(key)
    if (!handler) {
      console.error(`[BaseMessageController] No handler registered for: "${key}"`)
      this.respondUnhandled(responder)
      return
    }
    try {
      this.respondHandled(responder, await handler(content))
    } catch (err) {
      console.error(`[BaseMessageController] Handler error for: "${key}"`, err)
      this.respondError(responder)
    }
  }
}
