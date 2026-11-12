import * as vscode from 'vscode'
import * as path from 'path'
import { randomBytes } from 'crypto'
import BaseMessageReceiver from '@shared/infrastructure/BaseMessageReceiver'
import WebviewMessageHandlerMap from '../shared/object/WebviewMessageHandlerMap'
import WebviewRequestTracker from '../shared/object/WebviewRequestTracker'
import type { WebviewMessageHandler } from '../shared/types/WebviewMessageHandler'
import type { WebviewMessage, WebviewRequest, WebviewResponse } from '../shared/types/WebviewMessage'
import isWebviewResponse from '../shared/util/isWebviewResponse'
import { WEBVIEW_READY } from '../shared/constants/webview-messages'
import { SIDEBAR_VIEW_ID } from '../config'

// The extension's bundle lies in dist/, the sidebar page's bundle (webview/sidebar.ts) next to it in dist/webview/.
const WEBVIEW_ROOT = vscode.Uri.file(path.join(__dirname, 'webview'))
const WEBVIEW_SCRIPT = 'sidebar.js'
const WEBVIEW_STYLE = 'sidebar.css'

// Owns the sidebar's page: receives its messages and sends messages to it. Both ways, every request is answered.
class SidebarViewProvider extends BaseMessageReceiver<WebviewMessageHandler, string> implements vscode.WebviewViewProvider {
  readonly #lastMessages = new Map<string, WebviewMessage>()
  readonly #requests = new WebviewRequestTracker()
  #registration: vscode.Disposable | undefined
  #view: vscode.WebviewView | undefined

  constructor() {
    super(new WebviewMessageHandlerMap())
  }

  protected override onInit(): undefined {
    this.#registration = vscode.window.registerWebviewViewProvider(SIDEBAR_VIEW_ID, this)
  }

  override close(): void {
    this.#registration?.dispose()
    this.#registration = undefined
  }

  resolveWebviewView(view: vscode.WebviewView): void {
    this.#view = view
    view.webview.options = { enableScripts: true, localResourceRoots: [WEBVIEW_ROOT] }
    view.webview.html = this.#getHtml(view.webview)
    view.webview.onDidReceiveMessage((message: WebviewRequest | WebviewResponse) => this.#onMessage(message))
    view.onDidDispose(() => {
      if (this.#view === view) this.#view = undefined
    })
  }

  // The latest message of every type is kept: the page is reloaded whenever the sidebar is opened again,
  // and when it's ready, it gets them all, so it shows the current state at once.
  // A sidebar that isn't shown gets them then, so its answer is undefined straight away.
  post(message: WebviewMessage): Promise<unknown> {
    this.#lastMessages.set(message.type, message)
    if (!this.#view?.visible) return Promise.resolve(undefined)
    return this.#requests.post(message, request => this.#postToView(request))
  }

  protected respondHandled(requestId: string, response: unknown): void {
    this.#respond(requestId, response)
  }

  protected respondUnhandled(requestId: string): void {
    this.#respond(requestId, undefined)
  }

  protected respondError(requestId: string): void {
    this.#respond(requestId, undefined)
  }

  #onMessage(message: WebviewRequest | WebviewResponse): void {
    if (isWebviewResponse(message)) {
      this.#requests.handleResponse(message)
      return
    }
    if (message.type === WEBVIEW_READY) {
      this.#lastMessages.forEach(lastMessage => void this.post(lastMessage))
      this.#respond(message.id, undefined)
      return
    }
    void this.dispatch(message.type, message.content, message.id)
  }

  async #postToView(request: WebviewRequest): Promise<void> {
    const delivered = await this.#view?.webview.postMessage(request)
    if (!delivered) throw new Error('the sidebar did not take the message')
  }

  #respond(requestId: string, content: unknown): void {
    const response: WebviewResponse = { id: requestId, content }
    void this.#view?.webview.postMessage(response)
  }

  #getHtml(webview: vscode.Webview): string {
    const nonce = randomBytes(16).toString('base64')
    const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(WEBVIEW_ROOT, WEBVIEW_SCRIPT))
    const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(WEBVIEW_ROOT, WEBVIEW_STYLE))
    return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';" />
    <link rel="stylesheet" href="${styleUri}" />
  </head>
  <body>
    <script nonce="${nonce}" src="${scriptUri}"></script>
  </body>
</html>`
  }
}

export const sidebarViewProvider = new SidebarViewProvider()
