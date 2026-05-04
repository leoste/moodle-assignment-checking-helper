import * as vscode from 'vscode'
import BaseController from '@shared/controller/BaseController'

export default class VsCodeCommandController extends BaseController {
  #subscriptions: vscode.Disposable[] = []

  registerCommand(id: string, callback: (...args: any[]) => any): void {
    this.#subscriptions.push(vscode.commands.registerCommand(id, callback))
  }

  close(): void {
    this.#subscriptions.forEach(s => s.dispose())
    this.#subscriptions = []
  }
}
