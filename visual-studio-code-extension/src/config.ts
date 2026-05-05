/*
TODO: websocket port on hetkel dual-confitud nii chrome kui vscodes. peaks liigutama shared-isse
see tekitaks ka pretsedendi mingite asjade hiljem koos confimisele
*/

export const WEBSOCKET_PORT = 54321
export const WEBSOCKET_HOST = '127.0.0.1'

export const OPEN_SUB_DIRECTORIES = true

export const MAX_AUTO_OPENED_FILES = 20

export const BLACKLISTED_FOLDER_NAMES = new Set(['.idea', '.venv'])

export const SAFE_BINARY_EXTENSIONS = new Set([
  '.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.bmp', '.pdf',
])
