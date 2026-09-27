export const OPEN_SUB_DIRECTORIES = true

export const MAX_AUTO_OPENED_FILES = 20

export const BLACKLISTED_FOLDER_NAMES = new Set(['.idea', '.venv'])

export const SAFE_BINARY_EXTENSIONS = new Set([
  '.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.bmp', '.pdf',
])

// Number of editor columns that auto-opened student files are distributed across.
export const EDITOR_COLUMN_COUNT = 2

// Must match the command id declared in package.json (contributes.commands and menus).
export const RUN_PYTHON_IN_TERMINAL_COMMAND = 'moodle-helper.runPythonInTerminal'

export const PYTHON_COMMAND = 'python'
