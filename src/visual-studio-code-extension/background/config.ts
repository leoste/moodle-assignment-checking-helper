export const MAX_AUTO_OPENED_FILES = 20

export const BLACKLISTED_FOLDER_NAMES = new Set(['.idea', '.venv'])

export const SAFE_BINARY_EXTENSIONS = new Set([
  '.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.bmp', '.pdf',
])

// Number of editor columns that auto-opened student files are distributed across.
export const EDITOR_COLUMN_COUNT = 2

// Must match the command id declared in package.json (contributes.commands and menus).
export const RUN_PYTHON_IN_TERMINAL_COMMAND = 'moodle-helper.runPythonInTerminal'

// Not declared in package.json: only the status bar item runs it.
export const SHOW_LOG_COMMAND = 'moodle-helper.showLog'

// Not declared in package.json: only the status bar button runs it.
export const TAKE_OVER_COMMAND = 'moodle-helper.takeOver'

// Must match the prefix of the settings declared in package.json (contributes.configuration).
export const SETTINGS_SECTION = 'moodle-helper'

// Must match the view id declared in package.json (contributes.views).
export const SIDEBAR_VIEW_ID = 'moodle-helper.sidebar'

export const PYTHON_COMMAND = 'python'
