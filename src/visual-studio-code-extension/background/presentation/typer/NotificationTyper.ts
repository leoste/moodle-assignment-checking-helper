import BaseTyper from '@shared/presentation/typer/BaseTyper'
import { popupTextWatcher } from '@shared/communication/watcher/PopupTextWatcher'
import { notificationProvider } from '../../foundation/infrastructure/NotificationProvider'

class NotificationTyper extends BaseTyper {
  protected override onInit(): undefined {
    popupTextWatcher.subscribe(this.#write)
  }

  readonly #write = (popupText: string): void => {
    notificationProvider.showWarning(popupText)
  }
}

export const notificationTyper = new NotificationTyper()
