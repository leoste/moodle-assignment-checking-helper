# Building release

Before building, update the version of the chrome and vscode plugins according to your changes.
Change it in two places:
- `src\visual-studio-code-extension\package.json` -> "version"
- `src\google-chrome-extension\package.json` -> "version"
Both versions must be the same.

Then, run `node build-release.mjs` in root folder.
You can specify `--no-type-checking` if you want to skip it.
The script builds both extensions and places a release in the releases folder.

# Definitions and sample definition

The user augments the functionality with definition files.
The sample definition file in `src/definitions/sample-definition.json` says what is possible to put in a definition file.
This file is also used to verify all user-uploaded definition files when they're selected into the program.
All definition files should be with same structure as the sample definition file.

# Project structure and architecture

Project architecture and structure is entirely thought up by me personally. No AI was involved in anything creative.

Follow the existing structure and architecture carefully. They purposefully create specific objects and categorisation.
The project consists of multiple parts. Below AI-generated babble roughly explains what we're dealing with:
```
- `google-chrome-extension/` is the main extension. It runs in three contexts:
  - `content-script/` runs on Moodle pages and adds the helper panel and buttons.
  - `service-worker/` runs in the background, holds the data and talks to VS Code.
  - `popup/` selects and refreshes the definitions folder, and can reload the panel in the active tab.
- `visual-studio-code-extension/` gets the student being graded from Chrome and opens their files. It runs in two contexts:
  - `background/` is the extension's app, which runs in VS Code's background.
  - `webview/` is the sidebar's page: the settings and a copy of the status bar, in the panel's look.
- `shared/` is code that has to be the same in both extensions. An extension's own `shared/` is code shared between its contexts.
```

## Project layers and components

The project is built around specific layers each with clear goals, sort of like domain-based apps.
Refer to below AI-generated babble to know what layers exist:
```
Each layer uses only the layers below it. Data goes through repositories and outgoing messages through clients; a service calls a provider directly only for what is neither, e.g. starting the server or closing the editors.
- `infrastructure/` owns a platform resource and knows nothing about features. Every platform resource the project uses is owned by one. Used directly are only the pages' DOM (by page managers and renderers), `vscode.Uri` values, language built-ins, and the console and `chrome.runtime.getURL()`, which own nothing.
  - Receivers listen for what the platform delivers and pass it on to the handler registered for its key. They all extend `BaseReceiver`: `ChromeMessageReceiver` (service worker, content script), `ChromePortReceiver` (the service worker's end of the ports), `VsCodeMessageReceiver`, `VsCodeCommandReceiver`, `SidebarViewProvider` (the VS Code app's end of the sidebar, which also sends) and `WebviewMessageReceiver` (the sidebar page's end).
  - Providers do things with their resource. `ChromeMessageProvider` and `ChromePortProvider` send to the service worker, `VsCodeConnectionProvider` sends requests to VS Code, `VsCodeWindowConnectionProvider` to the VS Code window that receives the students, `VsCodeApiProvider` from the sidebar's page to the VS Code app. `IndexedDBProvider`, `ChromeStorageProvider` and `SettingsProvider` store values, `FileSystemAccessProvider` reads the definitions folder, `WebLockProvider` holds the content script's Web Locks. `WorkspaceProvider`, `EditorProvider`, `TerminalProvider`, `NotificationProvider`, `OutputChannelProvider`, `StatusBarItemProvider` and `StatusBarButtonProvider` own VS Code's workspace folder, editors, terminals, popups, Output channel and status bar items.
- `repository/` store and load data. `WritableRepository` is the base of the repositories that store values under keys. A repository that only reads, e.g. `StudentSubmissionRepository`, extends `BaseRepository` directly.
- `service/` do what the application does.
- `controller/` register handlers on infrastructure and pass what arrives on to services: messages (`ChromeMessageController`, `ChromePortController`, `VsCodeMessageController`, `WebviewMessageController`), VS Code commands (`VsCodeCommandController`) or an infrastructure object's events, e.g. a lost lock (`GradingTabController`). The content script and the sidebar's page have no services, so their controllers pass it on to the page listener or to a watcher.
```

In each of the layers, live certain key component types. Anything in the application can be of these given types.
It's possible to add a type if it doesn't yet exist, but so far most types have already been found out.
Again, see the soulless AI generation for info:
```
- `client/` send the messages of one feature, e.g. `FeedbackClient`.
- `generator/` put messages together, e.g. `QuizChromeMessageGenerator.getBeginAutoGradeMessage()`.
- `listener/` hold the listeners. A page listener (`…PageListener`) starts a page: it creates its presenter and passes on to it what the controllers and watchers got. The content script's page listeners create a new page manager and presenter on every Moodle page load, the sidebar's page listener creates its presenter once. A content script page listener's `loadPage()` stops the previous presenter, if there is one, and starts a new one. It runs when `executeOnPageReady` finds the page ready, and when the popup's `panel/reload` skips that detection. Both take the same path.
- `presenter/` run the workflow of one page load: fetch data, create renderers, react to their events, apply rules and write the results to the page. A presenter holds the state of that page load. It hands the watchers the renderers they show news in, and decides when a watcher follows another context's reporter.
- `rules/` are the project's own decisions as plain functions, e.g. `calculateGrade()`, `isStudentFolder()`. In the service worker the services play this role.
- `manager/` hold the managers. The content script's page managers (`…PageManager`) and their helpers are the only place that knows Moodle's DOM, e.g. `AssignmentGraderPageManager.setGrade()`.
- `renderer/` only build the extension's own UI from the data they get and report user actions through callbacks. Each renderer owns one root element: `render()` creates it, `clear()` removes it.
- `object/` are building blocks owned by another class, e.g. `HandlerMap`, `WebSocketConnection`, the request trackers.
- `util/` are stateless functions.
- `announcer/`, `reporter/` and `watcher/` carry the news, see "News".
- `shared/styles/theme.css` hold the colours and the looks shared by all pages of both extensions, which all have the panel's look. The pages import the file in their code. It is loaded into Moodle pages as well, so its classes and variables have the `checking-helper-` prefix. Everything the user can interact with has the `checking-helper-interactive` class and glows when hovered.
- `shared/translations/translations.ts` hold every user-facing text of both extensions, grouped by concept. Texts with values are functions, e.g. `translations.studentSubmission.noStudentFolder(studentName)`. The texts of the VS Code `package.json` (name, descriptions, command title, setting, sidebar) are in `visual-studio-code-extension/package.nls.json`, VS Code's own file for them.
```

Many of these objects are introduced as singletons, that is they can only have one instance running ever. As more aren't needed.
Blabla AI you know it:
```
Infrastructure, repositories, services, controllers, clients, generators, page listeners, the announcer, the reporter and the watchers are singletons. Only the instance is exported, not the class: `export const quizService = new QuizService()`.
A class is exported only if it is a base class, has multiple instances (renderers, page managers, presenters) or is an object owned by another class.
`static` fields are only for state shared by a whole class hierarchy.
```

## Messages

Every major part of the app talks with each other through messages. Parts both in chrome talk with messages, in vscode talk with messages, and vscode and chrome talk with each other through messages as well.
Let AI take it away:
```
A message is transport-specific: `ChromeMessage` (`{ type, content }` over `chrome.runtime`, or over a port between the service worker and the panel or the popup), `VsCodeMessage` (`{ channel, content }` over WebSocket, from Chrome or from another VS Code window) or `WebviewMessage` (`{ type, content }` between the VS Code app and the sidebar's page). Its `content` is a payload (`BasePayload`), the part that is the same in both extensions.
Every message key has exactly one payload type, listed in `ChromeMessagePayloads`, `VsCodeMessagePayloads` and `WebviewMessagePayloads`. Generators and controllers are type checked against these maps, so a new message is added there first. VS Code commands are typed the same way in `VsCodeCommandArguments`, with the arguments VS Code calls a command with instead of a payload.
Everything around a message is named `<message type><role>`: `ChromeMessageClient`, `VsCodeMessageReceiver`, `QuizChromeMessageGenerator` etc.
Every message is answered. Over `chrome.runtime`, Chrome pairs a message with its answer itself. Over the ports, the WebSocket and the webview, a request tracker does it (`BaseRequestTracker` with `ChromeRequestTracker`, `VsCodeRequestTracker` and `WebviewRequestTracker`): it gives the request an id, pairs the answer with it and times it out after 5 seconds. A `VsCodeMessage` is answered with a status, the other messages with what their handler returned, or undefined when it couldn't be handled.
A page opens its port to the service worker with the first message it sends over it. When Chrome stops the idle service worker, the port closes, and it's opened again only by the page's next message: otherwise it would keep waking the service worker up.
```

## News

```
What the code has to tell about the running program, logs and statuses included, is news. News stands outside the layers: any code may announce it, infrastructure too.
- `announcer/`: the `announcer` is what the code calls: `announceLog()`, `announceLogError()`, `announceStatus()`, `announceStatusCleared()`, `announceStatusesCleared()`, `announceReception()`, `announceSettingsUpdated()`. Every piece of news goes to the reporter of its context.
- `reporter/`: every context has one `reporter`. It hands every piece of news to the context's watchers, and the news that may leave the context to the watchers of other contexts through its clients (`WatcherClient`). It remembers what is still true, the current status of every topic and the latest piece of news of every other kind, to brief the watchers that come later.
- `watcher/`: watchers show the news to the lecturer, or to whoever reads the log: the console, VS Code's Output channel, status bar and popups, the status lines, the take-over buttons. A watcher gets all the news of the reporters it follows and decides itself which kinds it watches. It keeps what it needs itself, e.g. the status list. Renderers and providers are used only inside watchers.
The entry file of every context chooses its reporter's watchers and clients.
A watcher can also follow another context's reporter (`follow()`): it subscribes through a `ReporterClient` and gets the briefing as the answer. After that, the reporter's news comes in through the context's controllers. The panel and the popup follow the service worker's reporter, the panel only while it grades. The sidebar follows the VS Code app's reporter.
Log news never leaves its context.
News tells whoever watches what is now true, a message asks someone to do something or to answer. Stored data is fetched with messages: when it changes, its holder says so (the popup's `assignments/updated` message, the VS Code app's `settings-updated` news), and whoever shows it asks for it again.
A status can carry a `popupText`, which VS Code also shows as a popup.
```

## Broad design choices

It's intentional that only one tab can do moodle stuff and one vscode can do vscode stuff at once, this is enforced by the extensions. They both have pathways to overtake from other window for user comfort.

The yellow-orange-turqoise theme is also intentional. It is designed to maximally differentiate from existing Moodle elements to make it clear to the user they're interacting with the extension, not Moodle itself. At the same time it is simple to use. The mild yellow tone calms the nerves during long grading sessions while the blue keeps you alert.

The user has to download all student submissions onto their local disk themselves, as the moodle functionality works very well and it's a one time operation too, so not submission time would be saved by handling it through the extension anyways while more confusion and complication would be introduced.