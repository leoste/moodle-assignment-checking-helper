import * as vscode from 'vscode'
import BaseInfrastructure from '@shared/foundation/infrastructure/BaseInfrastructure'

// VS Code's popups in the corner of the window.
class NotificationProvider extends BaseInfrastructure {
  showWarning(text: string): void {
    void vscode.window.showWarningMessage(text)
  }
}

export const notificationProvider = new NotificationProvider()
