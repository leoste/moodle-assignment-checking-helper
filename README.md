# Moodle Assignment Checking Helper

TODO: maybe add a docs folder with schemes and images of the structure and the talking between different parts.

The Moodle ASsignment Checking Helper consists of two extensions that interact to significantly speed up assignment checking in Moodle.
Automatically open necessary files in VSCode, run custom scripts, easily compose typical grades and responses.

## Project structure

### Folders

- `src/` holds the code of both extensions.
- `src/definitions/sample-definition.json` is the sample definition: every field a definition file can have. Definition files are checked against it when they're loaded (`checkAgainstSample()`), so changing the structure means changing the sample, together with the `Assignment` types.
- `definitions/` holds assignment definitions.
- `docs/` holds the user documentation.
- `releases/` holds the built releases, one folder per version (see "Releasing").
- `plans/` holds development plans.
- `build-release.mjs` builds a release.

Code paths in this README are relative to `src/`.

### Extensions and contexts

- `google-chrome-extension/` is the main extension. It runs in three contexts:
  - `content-script/` runs on Moodle pages and adds the helper panel and buttons.
  - `service-worker/` runs in the background, holds the data and talks to VS Code.
  - `popup/` selects and refreshes the definitions folder, and can reload the panel in the active tab.
- `visual-studio-code-extension/` gets the student being graded from Chrome and opens their files. It runs in two contexts:
  - the extension's app (`src/` apart from `webview/`) runs in VS Code's background.
  - `webview/` is the sidebar's page: the settings and a copy of the status bar, in the panel's look.
- `shared/` is code that has to be the same in both extensions. An extension's own `src/shared/` is code shared between its contexts.

The settings of the VS Code extension are stored by VS Code itself (`SettingsRepository`), so they can be changed in VS Code's Settings editor as well as in the sidebar.

### Type checking

Every context is type checked on its own, with only what its environment has: the content script, the popup and the sidebar's page with the DOM, the service worker with a worker's environment and the VS Code app with Node.js. Each context folder has its own `tsconfig.json`, which checks the context and everything it imports. `npm run typecheck` runs all of an extension's checks.
So shared code may contain page code (renderers, styles, DOM helpers), but a context without the DOM fails its check if it imports it.

Contexts talk only through messages: content script and popup send Chrome messages to the service worker, the service worker sends VS Code messages over a WebSocket. Three messages go the other way: after reloading the definitions, the popup tells the content scripts of all tabs (`assignments/updated`), so an open panel updates itself; the popup's "Lae sisupaneel uuesti" tells the content script of the active tab to load its panel (`panel/reload`); and the service worker sends its statuses to the panel and the popup over a port (see "Status").

### Layers

Each layer uses only the layers below it:
- **Infrastructure** (`infrastructure/`) owns a platform resource and knows nothing about features. Message receivers (`ChromeMessageReceiver` in the service worker and the content script, `VsCodeMessageReceiver`) listen for messages and pass them to handlers, `VsCodeConnectionProvider` sends requests to VS Code, `IndexedDBProvider` owns the IndexedDB connection, `WebLockProvider` holds the content script's Web Locks.
- **Repositories** (`repository/`) store and load data.
- **Services** (`service/`) do what the application does.
- **Controllers** (`controller/`) register message handlers and pass the messages on to services. The content script and the sidebar's page have no services, so their controllers pass them on to the page listener.

### Other building blocks

- **Clients** (`client/`) send the messages of one feature, e.g. `FeedbackClient`.
- **Generators** (`generator/`) put messages together, e.g. `QuizChromeMessageGenerator.getBeginAutoGradeMessage()`.
- **Page listeners** (`pagelistener/`) start a page: they create its presenter and pass the controllers' messages on to it. The content script's listeners create a new page and presenter on every Moodle page load, the sidebar's listener once. A content script listener's `loadPage()` stops the previous presenter, if there is one, and starts a new one. It runs when `executeOnPageReady` finds the page ready, and when the popup's `panel/reload` skips that detection. Both take the same path.
- **Presenters** (`presenter/`) run the workflow of one page load: fetch data, create renderers, react to their events, apply rules and write the results to the page. A presenter holds the state of that page load.
- **Rules** (`rules/`) are the project's own decisions as plain functions, e.g. `calculateGrade()`, `isStudentFolder()`. In the service worker the services play this role.
- **Pages** (`content-script/pagemanager/`) are the only place that knows Moodle's DOM, e.g. `AssignmentGraderPage.setGrade()`.
- **Renderers** (`renderer/`) only build the extension's own UI from the data they get and report user actions through callbacks. Each renderer owns one root element: `render()` creates it, `clear()` removes it.
- **Objects** (`object/`) are building blocks owned by another class, e.g. `MessageHandlerMap`, `WebSocketConnection`.
- **Utils** (`util/`) are stateless functions.
- **Styles** (`shared/styles/theme.css`) hold the colours and the looks shared by all pages of both extensions, which all have the panel's look. The pages import the file in their code. It is loaded into Moodle pages as well, so its classes and variables have the `checking-helper-` prefix. Everything the user can interact with has the `checking-helper-interactive` class and glows when hovered.
- **Translations** (`shared/translations/translations.ts`) hold every user-facing text of both extensions, grouped by concept. Texts with values are functions, e.g. `translations.studentSubmission.noStudentFolder(studentName)`. The texts of the VS Code `package.json` (name, descriptions, command title, setting, sidebar) are in `visual-studio-code-extension/package.nls.json`, VS Code's own file for them.

### Messages

A message is transport-specific: `ChromeMessage` (`{ type, content }` over `chrome.runtime`), `VsCodeMessage` (`{ channel, content }` over WebSocket) or `WebviewMessage` (`{ type, content }` between the VS Code app and the sidebar's page). Its `content` is a payload (`BasePayload`), the part that is the same in both extensions.
Every message key has exactly one payload type, listed in `ChromeMessagePayloads`, `VsCodeMessagePayloads` and `WebviewMessagePayloads`. Generators and controllers are type checked against these maps, so a new message is added there first.
Everything around a message is named `<message type><role>`: `ChromeMessageClient`, `VsCodeMessageReceiver`, `QuizChromeMessageGenerator` etc.

### Storage

The Chrome extension stores data in two backends:
- **IndexedDB** for what `chrome.storage` can't hold, e.g. the definitions folder's `FileSystemDirectoryHandle`. Each context that uses it (service worker, popup) has its own `IndexedDBProvider` and connection to the same database, and each key is written by one context only.
- **`chrome.storage.local`** for simple values.

Every stored key is in `shared/constants/storage.ts` and its value type in `StorageSchema`. Repositories are type checked against the schema, so new storage is added there first. Outside the repositories, code only uses their domain methods, e.g. `DirectoryHandleRepository.getDirectoryHandle()`, never keys.

### One grading tab

Only one Moodle tab grades at a time, much like only one VS Code window receives the students. The grading panel holds a Web Lock (`WebLockProvider`), which all tabs of the Moodle site share. It keeps the lock for as long as its page lives, so moving to the next student keeps it too.
- A panel that starts while another tab holds the lock shows only a message (`translations.feedback.gradingElsewhere`). It doesn't open the student's files in VS Code, look the definition up or connect to the service worker's statuses.
- The browser frees the lock when the grading tab closes or leaves the grading page. The other tab then takes it over on its next page load or "Lae sisupaneel uuesti".
- A full refresh frees the lock for a moment. A tab that loads its panel in that moment takes it over.

### Lifecycle

The entry file of a context (`service-worker.ts`, `extension.ts`, ...) initialises the layers through their `init-*` lists: infrastructure, repositories, services, controllers. VS Code closes controllers and infrastructure through `close-*` lists. Initialisation is synchronous.

### Reporting

Reporters (`shared/reporting/`, base class `BaseReporter`) pass what the code reports on to a sink chosen by the context: the logger is for developers, the status reporter for the user. Every extension bundle has its own reporters.

#### Logging

All logging goes through `logger`, never directly through `console`. Every line starts with `[Moodle Helper][<class name>]`, so the console can be filtered by `Moodle Helper` or by a class.
- Chrome: content scripts log to the Moodle page's console, the service worker and the popup to their own DevTools.
- VS Code: the Output panel, channel "Moodle Assignment Checking Helper".

The entry file of a context calls `logger.init()` first. Base classes already log the lifecycle: initialisation, closing, page ready, presenters starting and stopping, renderers, sent and received messages, and Moodle elements that were not found. Features only add what the base classes can't see, e.g. the calculated grade.
Builds are not minified, so class names in logs and the code in the debugger stay readable.

#### Status

Both extensions have their own status bar that shows the current state: in VS Code a status bar item (clicking it opens the log) and a copy in the sidebar (`StatusSinkGroup` shows the statuses in both), in Chrome a status line in the panel and in the popup. They show the same things the same way.
`statusReporter` keeps the current status of every topic (connection, VS Code result, definition, ...), a new status replaces the old one of its topic. The topics and their order are in `shared/constants/status.ts`, the texts in the translations, and which status a situation gets is decided in the `status-rules.ts` rules.
The status line's sink is set by the presenter, so the panel's new status line shows the current statuses on every page.

The service worker's statuses (the VS Code connection) reach the panel and the popup over a long-lived port: `PortStatusSink` sends them, `PortStatusReceiver` passes them on to the context's own status reporter. When Chrome stops the idle service worker, its WebSocket to VS Code and the ports close together, so a closed port means the connection is waiting ("ootel"): it's closed but can be made again. "Disconnected" ("puudub") is shown only when connecting fails. The panel opens the port again only on the next page, otherwise it would keep waking the service worker up.
Results of one tab's request (VS Code's answer, the definition) come back in the response to that request, not over the port, so that open tabs don't show each other's results.

## Code conventions

### Singletons

Infrastructure, repositories, services, controllers, clients, generators and page listeners are singletons. Only the instance is exported, not the class: `export const quizService = new QuizService()`.
A class is exported only if it is a base class, has multiple instances (renderers, pages, presenters) or is an object owned by another class.
`static` fields are only for state shared by a whole class hierarchy.

## Releasing

Both extensions share one version number. It is set in both `package.json` files, the Chrome manifest takes it from there.
To build a release, run in the project root (Node.js 20 or later, needed by `vsce`):

```bash
node build-release.mjs
```

The script stops if the two versions differ. Otherwise it installs the dependencies, runs the type checks (`npm run typecheck` of both extensions) and stops on errors, builds both extensions and puts them into `releases/<version>/`: the Chrome extension as a zip of its `dist/`, the VS Code extension as a `.vsix`. If the release already exists, it asks whether to overwrite it. Releases are committed to git.
`node build-release.mjs --no-type-checking` skips the type checks.

The Chrome extension's ID is fixed by the public `key` in `manifest.config.ts`, so it is the same for every user and every version, wherever the extension is unpacked. The private key isn't needed and isn't in the repository.
VS Code accepts WebSocket connections only from this extension: it checks the `Origin` header against `CHROME_EXTENSION_ID` in `shared/config/connection.ts`. If the key ever changes, that ID has to be updated too.