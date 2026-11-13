import Initialisable from '../../foundation/object/Initialisable'

// Writes what a watcher gives it to a medium that has no page: the console, VS Code's output channel, status bar
// or popups. Does what a listener, a manager and a presenter do on a page, as far as such a medium needs it.
export default abstract class BaseTyper extends Initialisable {}
