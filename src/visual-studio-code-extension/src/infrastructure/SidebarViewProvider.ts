import * as vscode from 'vscode'
import * as path from 'path'
import { randomBytes } from 'crypto'
import BaseMessageReceiver from '@shared/infrastructure/BaseMessageReceiver'
import WebviewMessageHandlerMap from '../shared/object/WebviewMessageHandlerMap'
import type { WebviewMessageHandler } from '../shared/types/WebviewMessageHandler'
import type { WebviewMessage } from '../shared/types/WebviewMessage'
import { WEBVIEW_READY } from '../shared/constants/webview-messages'
import { SIDEBAR_VIEW_ID } from '../config'

// The extension's bundle lies in dist/, the sidebar page's bundle (webview/sidebar.ts) next to it in dist/webview/.
const WEBVIEW_ROOT = vscode.Uri.file(path.join(__dirname, 'webview'))
const WEBVIEW_SCRIPT = 'sidebar.js'
const WEBVIEW_STYLE = 'sidebar.css'

// Owns the sidebar's page: receives its messages and sends messages to it.
// Messages from the page have no responses, so the respond methods do nothing.
class SidebarViewProvider extends BaseMessageReceiver<WebviewMessageHandler, undefined> implements vscode.WebviewViewProvider {
  readonly #lastMessages = new Map<string, WebviewMessage>()
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
    view.webview.onDidReceiveMessage((message: WebviewMessage) => this.#onMessage(message))
    view.onDidDispose(() => {
      if (this.#view === view) this.#view = undefined
    })
  }

  // The latest message of every type is kept: the page is reloaded whenever the sidebar is opened again,
  // and when it's ready, it gets them all, so it shows the current state at once.
  post(message: WebviewMessage): void {
    this.#lastMessages.set(message.type, message)
    void this.#view?.webview.postMessage(message)
  }

  protected respondHandled(): void {}

  protected respondUnhandled(): void {}

  protected respondError(): void {}

  #onMessage(message: WebviewMessage): void {
    if (message.type === WEBVIEW_READY) {
      this.#lastMessages.forEach(lastMessage => void this.#view?.webview.postMessage(lastMessage))
      return
    }
    void this.dispatch(message.type, message.content, undefined)
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
