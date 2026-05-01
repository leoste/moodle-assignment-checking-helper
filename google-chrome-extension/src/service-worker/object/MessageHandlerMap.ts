type MessageHandler = (content: Record<string, unknown>) => Promise<unknown>

export default class MessageHandlerMap {
  readonly #handlers = new Map<string, MessageHandler>()

  add(messageType: string, handler: MessageHandler): void {
    if (!this.#handlers.has(messageType)) {
      this.#handlers.set(messageType, handler)
    }
  }

  get(messageType: string): MessageHandler | undefined {
    return this.#handlers.get(messageType)
  }
}

/*
TODO: important todo before new features can be added!

messagehandler is used by chrome serviceworker controllers, but the idea of handling messages and storing them in messagehandlers is useful elsewhere too.
therefore in preparation both concepts should be moved into shared folder in chrome extension.
then, because vscode will also need to be handling messages and storing them in messagehandlermaps, the concept should move into universal shared.
however, messagehandler itself is likely going to be different in vscode than in chrome.
therefore we will probably have: shared/messagehandler, chrome/shared/chromemessagehandler, vscode/vscodemessagehandler. something like that.

this also has to be done before the other TODO for implementing controllers in vscode extension.
*/
