# Moodle Assignment Checking Helper

TODO: the main readme needs to document project structure: what are services, repositories, controllers, clients etc.
what is the structure and talking between different services. maybe even add docs folder to add schemes and images.

The Moodle ASsignment Checking Helper consists of two extensions that interact to significantly speed up assignment checking in Moodle.
Automatically open necessary files in VSCode, run custom scripts, easily compose typical grades and responses.

## Code conventions

### Singletons

Controllers, services, repositories, clients, providers and page listeners are singletons. Only the instance is exported, not the class: `export const quizService = new QuizService()`.
A class is exported only if it is a base class, has multiple instances (renderers) or is owned by another object (`WebSocketProvider`).
`static` fields are only for state shared by a whole class hierarchy, e.g. the handler map of a controller base class.

### Initialisation

Every service, repository and controller is initialised through the `init-*` list of its context.

## Future concerns

Known issues that are consciously left unsolved for now.

### Refactors

#### Business logic in repositories and renderers

Services mostly forward calls (`AssignmentService`, `QuizService`), the logic lives elsewhere:
- `AssignmentRepository` parses definitions and looks them up by Moodle id.
- `FeedbackSectionRenderer` renders, reads and writes Moodle's DOM, calculates the grade, builds the comment and keeps state.
- `CheckingHelperPanelRenderer` renders, fetches data and finds its anchor in Moodle's DOM. It doesn't await its child renderer's `render()`.
- `ClickableListRenderer` and `ClickableListItemRenderer` have generic names but are tied to `FeedbackPart`. `ClickableListItemRenderer.clear()` crashes if `render()` never ran.
- `BaseRenderer` defines no real contract. Every renderer's `clear()` removes its elements one by one instead of removing its root.
- `Feedback._id` is runtime state in the definition type. `FeedbackPart.enabled` is both the definition's default and UI state, hence the `deepCopy`.
- The Chrome `PageInfoService` / `page-info` name hides what it does: open the student's submission in VS Code.

Business logic should live in separate classes that drive the renderers, in one folder and named by one standard. Renderers should only render. See also the TODO in `service-worker/service/init-services.ts`.

#### Message system roles

`ChromeMessageController` and `VsCodeMessageController` are at once base classes of the feature controllers, global listeners and dispatchers with a static handler map. The VS Code one also owns the WebSocket server, which any instance's `close()` closes. Splitting the roles (e.g. a separate router) would make ownership clear.
A handler's payload type is chosen at registration and not checked against the message key. Only a key → payload type map would enforce it.

#### Page ready detection

`executeOnPageReady` runs the callback only after at least one DOM mutation followed by 1.2 s of silence. If the page is already quiet when the content script starts, or never gets quiet (e.g. a timer), the callback never runs. The URL polling interval runs forever and every navigation creates a new `MutationObserver`. So far it has always worked.

#### Opening sub-directories is a compile-time setting

`OPEN_SUB_DIRECTORIES` in the VS Code `config.ts` is hard-coded to `true`, so files are always collected recursively and the `false` branch (top-level files only) never runs. Changing it requires rebuilding. It could become a VS Code setting, as could `MAX_AUTO_OPENED_FILES` and `BLACKLISTED_FOLDER_NAMES`.

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
