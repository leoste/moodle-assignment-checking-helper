import * as vscode from 'vscode'
import BaseInfrastructure from '@shared/infrastructure/BaseInfrastructure'
import { SHOW_LOG_COMMAND } from '../config'

const WARNING_BACKGROUND_COLOR = 'statusBarItem.warningBackground'

// The extension's item in VS Code's status bar. Clicking it shows the log.
class StatusBarItemProvider extends BaseInfrastructure {
  #item: vscode.StatusBarItem | undefined

  protected override onInit(): undefined {
    this.#item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left)
    this.#item.command = SHOW_LOG_COMMAND
    this.#item.show()
  }

  setContent(text: string, tooltip: string, warning: boolean): void {
    if (!this.#item) return
    this.#item.text = text
    this.#item.tooltip = tooltip
    this.#item.backgroundColor = warning ? new vscode.ThemeColor(WARNING_BACKGROUND_COLOR) : undefined
  }

  override close(): void {
    this.#item?.dispose()
    this.#item = undefined
  }
}

export const statusBarItemProvider = new StatusBarItemProvider()
