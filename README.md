# Moodle Assignment Checking Helper

TODO: maybe add a docs folder with schemes and images of the structure and the talking between different parts.

The Moodle ASsignment Checking Helper consists of two extensions that interact to significantly speed up assignment checking in Moodle.
Automatically open necessary files in VSCode, run custom scripts, easily compose typical grades and responses.

## Project structure

### Extensions and contexts

- `google-chrome-extension/` is the main extension. It runs in three contexts:
  - `content-script/` runs on Moodle pages and adds the helper panel and buttons.
  - `service-worker/` runs in the background, holds the data and talks to VS Code.
  - `popup/` selects and refreshes the definitions folder.
- `visual-studio-code-extension/` gets the student being graded from Chrome and opens their files.
- `shared/` is code that has to be the same in both extensions. An extension's own `src/shared/` is code shared between its contexts.

Contexts talk only through messages: content script and popup send Chrome messages to the service worker, the service worker sends VS Code messages over a WebSocket.

### Layers

Each layer uses only the layers below it:
- **Infrastructure** (`infrastructure/`) owns a platform resource and knows nothing about features. Message receivers (`ChromeMessageReceiver`, `VsCodeMessageReceiver`) listen for messages and pass them to handlers, `VsCodeConnectionProvider` sends requests to VS Code, `IndexedDBProvider` owns the IndexedDB connection.
- **Repositories** (`repository/`) store and load data.
- **Services** (`service/`) do what the application does.
- **Controllers** (`controller/`) register message handlers and pass the messages on to services.

### Other building blocks

- **Clients** (`client/`) send the messages of one feature, e.g. `FeedbackClient`.
- **Generators** (`generator/`) put messages together, e.g. `QuizChromeMessageGenerator.getBeginAutoGradeMessage()`.
- **Page listeners** (`content-script/pagelistener/`) start a content script. On every page load they create a new page and presenter.
- **Presenters** (`presenter/`) run the workflow of one page load: fetch data, create renderers, react to their events, apply rules and write the results to the page. A presenter holds the state of that page load.
- **Rules** (`rules/`) are the project's own decisions as plain functions, e.g. `calculateGrade()`, `isStudentFolder()`. In the service worker the services play this role.
- **Pages** (`content-script/pagemanager/`) are the only place that knows Moodle's DOM, e.g. `AssignmentGraderPage.setGrade()`.
- **Renderers** (`renderer/`) only build the extension's own UI from the data they get and report user actions through callbacks. Each renderer owns one root element: `render()` creates it, `clear()` removes it.
- **Objects** (`object/`) are building blocks owned by another class, e.g. `MessageHandlerMap`, `WebSocketConnection`.
- **Utils** (`util/`) are stateless functions.
- **Translations** (`shared/translations/translations.ts`) hold every user-facing text of both extensions, grouped by concept. Texts with values are functions, e.g. `translations.studentSubmission.noStudentFolder(studentName)`. The VS Code command title is the only exception, it stays in `package.json`.

### Messages

A message is transport-specific: `ChromeMessage` (`{ type, content }` over `chrome.runtime`) or `VsCodeMessage` (`{ channel, content }` over WebSocket). Its `content` is a payload (`BasePayload`), the part that is the same in both extensions.
Every message key has exactly one payload type, listed in `ChromeMessagePayloads` and `VsCodeMessagePayloads`. Generators and controllers are type checked against these maps, so a new message is added there first.
Everything around a message is named `<message type><role>`: `ChromeMessageClient`, `VsCodeMessageReceiver`, `QuizChromeMessageGenerator` etc.

### Storage

The Chrome extension stores data in two backends:
- **IndexedDB** for what `chrome.storage` can't hold, e.g. the definitions folder's `FileSystemDirectoryHandle`. Each context that uses it (service worker, popup) has its own `IndexedDBProvider` and connection to the same database, and each key is written by one context only.
- **`chrome.storage.local`** for simple values.

Every stored key is in `shared/constants/storage.ts` and its value type in `StorageSchema`. Repositories are type checked against the schema, so new storage is added there first. Outside the repositories, code only uses their domain methods, e.g. `DirectoryHandleRepository.getDirectoryHandle()`, never keys.

### Lifecycle

The entry file of a context (`service-worker.ts`, `extension.ts`, ...) initialises the layers through their `init-*` lists: infrastructure, repositories, services, controllers. VS Code closes controllers and infrastructure through `close-*` lists. Initialisation is synchronous.

### Logging

All logging goes through `logger` (`shared/logging/`), never directly through `console`. Every line starts with `[Moodle Helper][<class name>]`, so the console can be filtered by `Moodle Helper` or by a class.
- Chrome: content scripts log to the Moodle page's console, the service worker and the popup to their own DevTools.
- VS Code: the Output panel, channel "Moodle Assignment Checking Helper".

The entry file of a context calls `logger.init()` first. Base classes already log the lifecycle: initialisation, closing, page ready, presenters starting and stopping, renderers, sent and received messages, and Moodle elements that were not found. Features only add what the base classes can't see, e.g. the calculated grade.
Builds are not minified, so class names in logs and the code in the debugger stay readable.

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

The script stops if the two versions differ. Otherwise it installs the dependencies, builds both extensions and puts them into `releases/<version>/`: the Chrome extension as a zip of its `dist/`, the VS Code extension as a `.vsix`. If the release already exists, it asks whether to overwrite it. Releases are committed to git.

The Chrome extension's ID is fixed by the public `key` in `manifest.config.ts`, so it is the same wherever the extension is unpacked. The private key isn't needed and isn't in the repository.

## Future concerns

Known issues that are consciously left unsolved for now.

### Refactors

None at the moment.

### Conceptual changes

To do conceptual changes, proper debugging sessions with the browser are necessary to validate proper functionality, as these changes can't be implemented with simple rewrites.

#### Grade fallback and submit prevention

`calculateGrade()` in `grading-rules.ts` gives 100 when the sum of points is 0 or negative. This is deliberate: a mistake in the definition should rather give the student 100 than 0. But with negative points only (e.g. `python-cafe-assignment.json`) big deductions also end up as 100. The proper fix is submit prevention like in form validation, maybe building the whole panel as a form. Additionally, the whole grading system of how grades are calculated needs to be reviewed and made more robust.

#### Grade scale

The grade has no scale. `calculateGrade()` sums the points of the enabled parts, the `intended_max_points` of a `Feedback` group is only displayed, and the fallback is a hard-coded 100, even for assignments graded out of 15 (`python-cafe-assignment.json`). The maximum points should be the scale of the grade and replace the hard-coded fallback. Ideally the maximum isn't written in the definition at all but read from Moodle's grading page, so the definition can't disagree with Moodle.

#### Notifying Moodle's form of applied values

`AssignmentGraderPage.setGrade()` and `setComment()` set the values of Moodle's grade input and comment box directly, without the `input` and `change` events that Moodle's form scripts listen to. So Moodle's own change detection, e.g. its check for unsaved changes, may not notice an applied grade and comment. Applying should notify the form the same way typing the values does.

#### Matching students and submissions

`isStudentFolder()` in the VS Code `student-files-rules.ts` matches the student's folder with `folderName.startsWith(studentName)`, so "Mari Maa" also matches "Mari Maasikas_…" and opens the wrong student's files. To be solved together with downloading submissions.

#### WebSocket origin check

The VS Code WebSocket server (`VsCodeMessageReceiver`, `ws://127.0.0.1:54321`) accepts connections from anywhere. Any web page can open a WebSocket to localhost and send a `student-submission` message, which closes all editors and terminals in VS Code and opens files. The server should check that the `Origin` header is `chrome-extension://<extension id>`.

#### UI and CSS

Colors `#FF7E2E`, `#2BFFFF` and `#FEEA9A` repeat in `assign-grader.css` and `quiz-review.css`. The panel's `left: 40%` depends on the two `20%` Moodle panel widths. Moodle selectors are repeated in `assign-grader.css` (`div[data-region="grade-panel"]`, `div.comment-area div.db textarea`), separately from the page objects. To be handled together with a UI redesign.

#### Database

The IndexedDB database (`IndexedDBProvider`: `DB_NAME`, `STORE_NAME`, `DB_VERSION`) has no migrations. When the type of a stored value changes, its repository has to treat an old value as missing until it is stored again, e.g. by refreshing the definitions folder. This is likely very low priority as in a project with so simple complexity it doesn't matter.

#### Opening sub-directories is a compile-time setting

`OPEN_SUB_DIRECTORIES` in the VS Code `config.ts` (used by `shouldCollectSubFolders()`) is hard-coded to `true`, so files are always collected recursively and the `false` branch (top-level files only) never runs. Changing it requires rebuilding. It could become a VS Code setting, as could `MAX_AUTO_OPENED_FILES` and `BLACKLISTED_FOLDER_NAMES`.

#### Page ready detection

`executeOnPageReady` runs the callback only after at least one DOM mutation followed by 1.2 s of silence. If the page is already quiet when the content script starts, or never gets quiet (e.g. a timer), the callback never runs. The URL polling interval runs forever and every navigation creates a new `MutationObserver`. So far it has always worked.