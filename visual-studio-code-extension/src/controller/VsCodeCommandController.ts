import * as vscode from 'vscode'
import CloseableBaseController from './CloseableBaseController'

export default class VsCodeCommandController extends CloseableBaseController {
  #subscriptions: vscode.Disposable[] = []

  registerCommand(id: string, callback: (...args: any[]) => any): void {
    this.#subscriptions.push(vscode.commands.registerCommand(id, callback))
  }

  close(): void {
    this.#subscriptions.forEach(s => s.dispose())
    this.#subscriptions = []
  }
}
