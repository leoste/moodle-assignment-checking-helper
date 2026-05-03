import type { MessageHandler } from '@shared/types/MessageHandler'

// TODO: same structural typing caveat as ChromeMessageHandler - revisit when vscode message handling is more defined
export interface VsCodeMessageHandler extends MessageHandler {}
