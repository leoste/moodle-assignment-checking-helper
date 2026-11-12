import { CHROME_EXTENSION_ORIGIN } from '@shared/business/config/connection'

// Checked before a connection's messages are handled, so web pages can't use the server.
// Browsers always send the page's Origin and pages can't change it, so a connection without one comes from a
// program on this computer: another VS Code window taking the reception over.
export function isAllowedOrigin(origin: string | undefined): boolean {
  return origin === CHROME_EXTENSION_ORIGIN || origin === undefined
}
