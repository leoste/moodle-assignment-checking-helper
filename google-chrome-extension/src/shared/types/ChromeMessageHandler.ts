import type { MessageHandler } from '@shared/types/MessageHandler'

// TODO: find a better solution for messagehandler/chromemessagehandler when starting to process vscode messages.
// then it becomes apparent how it should be
export interface ChromeMessageHandler extends MessageHandler {}
