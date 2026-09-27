# Moodle Assignment Checking Helper

TODO: the main readme needs to document project structure: what are services, repositories, controllers, clients etc.
what is the structure and talking between different services. maybe even add docs folder to add schemes and images.

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
- **Infrastructure** (`infrastructure/`) owns a platform resource and knows nothing about features. Message receivers (`ChromeMessageReceiver`, `VsCodeMessageReceiver`) listen for messages and pass them to handlers, `VsCodeConnectionProvider` sends requests to VS Code.
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
- **Renderers** (`renderer/`) only build the extension's own UI from the data they get and report user actions through callbacks.
- **Objects** (`object/`) are building blocks owned by another class, e.g. `MessageHandlerMap`, `WebSocketConnection`.
- **Utils** (`util/`) are stateless functions.

### Messages

A message is transport-specific: `ChromeMessage` (`{ type, content }` over `chrome.runtime`) or `VsCodeMessage` (`{ channel, content }` over WebSocket). Its `content` is a payload (`BasePayload`), the part that is the same in both extensions.
Everything around a message is named `<message type><role>`: `ChromeMessageClient`, `VsCodeMessageReceiver`, `QuizChromeMessageGenerator` etc.

### Lifecycle

The entry file of a context (`service-worker.ts`, `extension.ts`, ...) initialises the layers through their `init-*` lists: infrastructure, repositories, services, controllers. VS Code closes controllers and infrastructure through `close-*` lists. Initialisation is synchronous.

## Code conventions

### Singletons

Infrastructure, repositories, services, controllers, clients, generators and page listeners are singletons. Only the instance is exported, not the class: `export const quizService = new QuizService()`.
A class is exported only if it is a base class, has multiple instances (renderers, pages, presenters) or is an object owned by another class.
`static` fields are only for state shared by a whole class hierarchy.

## Future concerns

Known issues that are consciously left unsolved for now.

### Refactors

#### Business logic in repositories and renderers

Business logic is separated from rendering (presenters, rules), but some points are left:
- `ClickableListRenderer` and `ClickableListItemRenderer` have generic names but are tied to `FeedbackPart`. `ClickableListItemRenderer.clear()` crashes if `render()` never ran.
- `BaseRenderer` defines no real contract. Every renderer's `clear()` removes its elements one by one instead of removing its root.
- `FeedbackPart.enabled` is both the definition's default and the selection state, hence the presenter's `deepCopy`.
- The Chrome `PageInfoService` / `page-info` name hides what it does: open the student's submission in VS Code.
- `AssignmentService` and `QuizService` still mostly forward calls. See also the TODO in `service-worker/service/init-services.ts`.

#### Message payload types

A handler's payload type is chosen at registration and not checked against the message key. Only a key → payload type map would enforce it.

#### Page ready detection

`executeOnPageReady` runs the callback only after at least one DOM mutation followed by 1.2 s of silence. If the page is already quiet when the content script starts, or never gets quiet (e.g. a timer), the callback never runs. The URL polling interval runs forever and every navigation creates a new `MutationObserver`. So far it has always worked.

#### UI texts

UI texts are scattered and mixed Estonian and English (`'Tagasiside'`, `'Kaust valimata'`, `'Assign max points with no comment'`, the VS Code warnings). `'Uuenda definitsioonid'` is both in `popup.html` and `PopupRenderer.ts`. Needs a translations setup. However, this is incredibly low priority.

### Conceptual changes

#### Meaning of feedback

What `enabled`, `enabledText`, `disabledText` and `points` of a `FeedbackPart` mean is spread over `ClickableListItemRenderer#getDisplayText`, `FeedbackSectionRenderer#buildCommentText` and `FeedbackSectionRenderer#calculateAndSetTotalPoints`. A new field has to be added in three places. Needs rethinking of what feedback is. A single module turning the selected parts into points and a comment would follow from that.

#### Grade fallback and submit prevention

`FeedbackSectionRenderer` sets the grade to 100 when the sum of points is 0 or negative. This is deliberate: a mistake in the definition should rather give the student 100 than 0. But with negative points only (e.g. `python-cafe-assignment.json`) big deductions also end up as 100. The proper fix is submit prevention like in form validation, maybe building the whole panel as a form. Additionally, the whole grading system of how grades are calculated needs to be reviewed and made more robust.

#### Matching students and submissions

The VS Code `PageInfoService` finds the student's folder with `name.startsWith(studentName)`, so "Mari Maa" also matches "Mari Maasikas_…" and opens the wrong student's files. To be solved together with downloading submissions.

#### WebSocket origin check

The VS Code WebSocket server (`VsCodeMessageController`, `ws://127.0.0.1:54321`) accepts connections from anywhere. Any web page can open a WebSocket to localhost and send a `page-info` message, which closes all editors and terminals in VS Code and opens files. The server should check that the `Origin` header is `chrome-extension://<extension id>`.

#### UI and CSS

Colors `#FF7E2E`, `#2BFFFF` and `#FEEA9A` repeat in `assign-grader.css` and `quiz-review.css`. The panel's `left: 40%` depends on the two `20%` Moodle panel widths. Moodle selectors are repeated in `assign-grader.css` (`div[data-region="grade-panel"]`, `div.comment-area div.db textarea`), separately from the page objects. To be handled together with a UI redesign.

#### Database

The IndexedDB schema (`IndexedDBRepository`: `DB_NAME`, `STORE_NAME`, `DB_VERSION`) has no migrations. Postponed until it is clear what kind of storage the project needs. This is likely very low priority as in a project with so simple complexity it doesn't matter.

#### Opening sub-directories is a compile-time setting

`OPEN_SUB_DIRECTORIES` in the VS Code `config.ts` is hard-coded to `true`, so files are always collected recursively and the `false` branch (top-level files only) never runs. Changing it requires rebuilding. It could become a VS Code setting, as could `MAX_AUTO_OPENED_FILES` and `BLACKLISTED_FOLDER_NAMES`.
