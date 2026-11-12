import StatusListWatcher from '@shared/watcher/StatusListWatcher'
import type { Status } from '@shared/types/Status'
import { STATUS_LEVEL_PROBLEM } from '@shared/constants/status'
import { translations } from '@shared/translations/translations'
import { statusBarItemProvider } from '../infrastructure/StatusBarItemProvider'

const STATUS_SEPARATOR = ' · '

class StatusBarWatcher extends StatusListWatcher {
  protected show(statuses: readonly Status[]): void {
    const texts = statuses.map(status => status.text)
    const hasProblem = statuses.some(status => status.level === STATUS_LEVEL_PROBLEM)
    statusBarItemProvider.setContent([translations.statusBar.label, ...texts].join(STATUS_SEPARATOR), texts.join('\n'), hasProblem)
  }
}

export const statusBarWatcher = new StatusBarWatcher()
