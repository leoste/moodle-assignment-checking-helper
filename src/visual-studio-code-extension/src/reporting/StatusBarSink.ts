import * as vscode from 'vscode'
import type { StatusSink } from '@shared/reporting/StatusSink'
import type { Status } from '@shared/types/Status'
import { STATUS_LEVEL_PROBLEM } from '@shared/constants/status'
import { translations } from '@shared/translations/translations'

const STATUS_SEPARATOR = ' · '
const PROBLEM_BACKGROUND_COLOR = 'statusBarItem.warningBackground'

export default class StatusBarSink implements StatusSink {
  readonly #item: vscode.StatusBarItem

  constructor(item: vscode.StatusBarItem) {
    this.#item = item
    this.#item.show()
  }

  show(statuses: readonly Status[]): void {
    const texts = statuses.map(status => status.text)
    this.#item.text = [translations.statusBar.label, ...texts].join(STATUS_SEPARATOR)
    this.#item.tooltip = texts.join('\n')
    const hasProblem = statuses.some(status => status.level === STATUS_LEVEL_PROBLEM)
    this.#item.backgroundColor = hasProblem ? new vscode.ThemeColor(PROBLEM_BACKGROUND_COLOR) : undefined
  }
}
