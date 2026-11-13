import BaseTyper from '@shared/presentation/typer/BaseTyper'
import { statusWatcher } from '@shared/communication/watcher/StatusWatcher'
import type { Status } from '@shared/business/types/Status'
import { STATUS_LEVEL_PROBLEM } from '@shared/foundation/constants/status'
import { translations } from '@shared/business/translations/translations'
import { statusBarItemProvider } from '../../foundation/infrastructure/StatusBarItemProvider'

const STATUS_SEPARATOR = ' · '

class StatusBarTyper extends BaseTyper {
  protected override onInit(): undefined {
    statusWatcher.subscribe(this.#write)
  }

  readonly #write = (statuses: readonly Status[]): void => {
    const texts = statuses.map(status => status.text)
    const hasProblem = statuses.some(status => status.level === STATUS_LEVEL_PROBLEM)
    statusBarItemProvider.setContent([translations.statusBar.label, ...texts].join(STATUS_SEPARATOR), texts.join('\n'), hasProblem)
  }
}

export const statusBarTyper = new StatusBarTyper()
