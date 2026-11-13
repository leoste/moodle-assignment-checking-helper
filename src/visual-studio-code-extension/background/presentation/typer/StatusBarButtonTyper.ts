import BaseTyper from '@shared/presentation/typer/BaseTyper'
import { receptionWatcher } from '@shared/communication/watcher/ReceptionWatcher'
import { translations } from '@shared/business/translations/translations'
import { statusBarButtonProvider } from '../../foundation/infrastructure/StatusBarButtonProvider'
import { TAKE_OVER_COMMAND } from '../../config'

// The take-over button next to the status bar item, shown only in a window that doesn't receive the students.
class StatusBarButtonTyper extends BaseTyper {
  protected override onInit(): undefined {
    receptionWatcher.subscribe(this.#write)
  }

  readonly #write = (receiving: boolean): void => {
    if (receiving) statusBarButtonProvider.hide()
    else statusBarButtonProvider.show(translations.connection.takeOver, TAKE_OVER_COMMAND)
  }
}

export const statusBarButtonTyper = new StatusBarButtonTyper()
