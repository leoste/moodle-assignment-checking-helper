import StatusListWatcher from '@shared/communication/watcher/StatusListWatcher'
import type { Status } from '@shared/business/types/Status'
import { STATUS_LEVEL_PROBLEM } from '@shared/foundation/constants/status'
import { translations } from '@shared/business/translations/translations'
import { statusBarItemProvider } from '../../foundation/infrastructure/StatusBarItemProvider'

const STATUS_SEPARATOR = ' · '

class StatusBarWatcher extends StatusListWatcher {
  protected show(statuses: readonly Status[]): void {
    const texts = statuses.map(status => status.text)
    const hasProblem = statuses.some(status => status.level === STATUS_LEVEL_PROBLEM)
    statusBarItemProvider.setContent([translations.statusBar.label, ...texts].join(STATUS_SEPARATOR), texts.join('\n'), hasProblem)
  }
}

export const statusBarWatcher = new StatusBarWatcher()
