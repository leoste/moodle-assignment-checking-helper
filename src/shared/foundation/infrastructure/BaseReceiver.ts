import BaseInfrastructure from './BaseInfrastructure'
import type HandlerMap from '../object/HandlerMap'
import type { Handler } from '../../business/types/Handler'
import { announcer } from '../../communication/announcer/Announcer'

// Receives what the platform delivers for a key (a message, a command) and passes it on to the handler registered
// for that key. Every receiver of the project works this way.
export default abstract class BaseReceiver<TContent, THandler extends Handler<TContent>, TResponder> extends BaseInfrastructure {
  readonly #handlerMap: HandlerMap<THandler>

  constructor(handlerMap: HandlerMap<THandler>) {
    super()
    this.#handlerMap = handlerMap
  }

  protected abstract respondHandled(responder: TResponder, response: unknown): void
  protected abstract respondUnhandled(responder: TResponder): void
  protected abstract respondError(responder: TResponder): void

  addHandler<TKeyContent extends TContent>(key: string, handler: Handler<TKeyContent>): void {
    // The content type is chosen at registration; the map stores handlers of any content.
    this.#handlerMap.add(key, handler as unknown as THandler)
  }

  protected async dispatch(key: string, content: TContent, responder: TResponder): Promise<void> {
    announcer.announceLog(this, `received ${key}`, content)
    const handler = this.#handlerMap.get(key)
    if (!handler) {
      announcer.announceLogError(this, `no handler registered for ${key}`)
      this.respondUnhandled(responder)
      return
    }
    try {
      const response = await handler(content)
      announcer.announceLog(this, `handled ${key}`)
      this.respondHandled(responder, response)
    } catch (err) {
      announcer.announceLogError(this, `handler error for ${key}`, err)
      this.respondError(responder)
    }
  }
}
