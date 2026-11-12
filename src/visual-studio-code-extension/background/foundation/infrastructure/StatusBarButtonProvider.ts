import * as vscode from 'vscode'
import BaseInfrastructure from '@shared/foundation/infrastructure/BaseInfrastructure'

// A button next to the status bar item. A status bar item can't be greyed out, so it's shown only while it can be used.
class StatusBarButtonProvider extends BaseInfrastructure {
  #item: vscode.StatusBarItem | undefined

  protected override onInit(): undefined {
    this.#item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left)
  }

  show(text: string, command: string): void {
    if (!this.#item) return
    this.#item.text = text
    this.#item.command = command
    this.#item.show()
  }

  hide(): void {
    this.#item?.hide()
  }

  override close(): void {
    this.#item?.dispose()
    this.#item = undefined
  }
}

export const statusBarButtonProvider = new StatusBarButtonProvider()
