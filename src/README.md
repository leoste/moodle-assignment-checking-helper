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
  - the extension's app (`src/` apart from `webview/`) runs in VS Code's background.
  - `webview/` is the sidebar's page: the settings and a copy of the status bar, in the panel's look.
- `shared/` is code that has to be the same in both extensions. An extension's own `src/shared/` is code shared between its contexts.
```

## Project layers and components

The project is built around specific layers each with clear goals, sort of like domain-based apps.
Refer to below AI-generated babble to know what layers exist:
```
Each layer uses only the layers below it:
- `infrastructure/` owns a platform resource and knows nothing about features. Message receivers (`ChromeMessageReceiver` in the service worker and the content script, `VsCodeMessageReceiver`) listen for messages and pass them to handlers, `VsCodeConnectionProvider` sends requests to VS Code, `VsCodeWindowConnectionProvider` sends requests to the VS Code window that receives the students, `IndexedDBProvider` owns the IndexedDB connection, `WebLockProvider` holds the content script's Web Locks, `StatusBarButtonProvider` owns VS Code's status bar button.
- `repository/` store and load data.
- `service/` do what the application does.
- `controller/` register message handlers and pass the messages on to services. The content script and the sidebar's page have no services, so their controllers pass them on to the page listener.
```

In each of the layers, live certain key component types. Anything in the application can be of these given types.
It's possible to add a type if it doesn't yet exist, but so far most types have already been found out.
Again, see the soulless AI generation for info:
```
- `client/` send the messages of one feature, e.g. `FeedbackClient`.
- `generator/` put messages together, e.g. `QuizChromeMessageGenerator.getBeginAutoGradeMessage()`.
- `pagelistener/` start a page: they create its presenter and pass the controllers' messages on to it. The content script's listeners create a new page and presenter on every Moodle page load, the sidebar's listener once. A content script listener's `loadPage()` stops the previous presenter, if there is one, and starts a new one. It runs when `executeOnPageReady` finds the page ready, and when the popup's `panel/reload` skips that detection. Both take the same path.
- `presenter/` run the workflow of one page load: fetch data, create renderers, react to their events, apply rules and write the results to the page. A presenter holds the state of that page load.
- `rules/` are the project's own decisions as plain functions, e.g. `calculateGrade()`, `isStudentFolder()`. In the service worker the services play this role.
- `content-script/pagemanager/` are the only place that knows Moodle's DOM, e.g. `AssignmentGraderPage.setGrade()`.
- `renderer/` only build the extension's own UI from the data they get and report user actions through callbacks. Each renderer owns one root element: `render()` creates it, `clear()` removes it.
- `object/` are building blocks owned by another class, e.g. `MessageHandlerMap`, `WebSocketConnection`.
- `util/` are stateless functions.
- `shared/styles/theme.css` hold the colours and the looks shared by all pages of both extensions, which all have the panel's look. The pages import the file in their code. It is loaded into Moodle pages as well, so its classes and variables have the `checking-helper-` prefix. Everything the user can interact with has the `checking-helper-interactive` class and glows when hovered.
- `shared/translations/translations.ts` hold every user-facing text of both extensions, grouped by concept. Texts with values are functions, e.g. `translations.studentSubmission.noStudentFolder(studentName)`. The texts of the VS Code `package.json` (name, descriptions, command title, setting, sidebar) are in `visual-studio-code-extension/package.nls.json`, VS Code's own file for them.
```

Many of these objects are introduced as singletons, that is they can only have one instance running ever. As more aren't needed.
Blabla AI you know it:
```
Infrastructure, repositories, services, controllers, clients, generators and page listeners are singletons. Only the instance is exported, not the class: `export const quizService = new QuizService()`.
A class is exported only if it is a base class, has multiple instances (renderers, pages, presenters) or is an object owned by another class.
`static` fields are only for state shared by a whole class hierarchy.
```

## Messages

Every major part of the app talks with each other through messages. Parts both in chrome talk with messages, in vscode talk with messages, and vscode and chrome talk with each other through messages as well.
Let AI take it away:
```
A message is transport-specific: `ChromeMessage` (`{ type, content }` over `chrome.runtime`), `VsCodeMessage` (`{ channel, content }` over WebSocket, from Chrome or from another VS Code window) or `WebviewMessage` (`{ type, content }` between the VS Code app and the sidebar's page). Its `content` is a payload (`BasePayload`), the part that is the same in both extensions.
Every message key has exactly one payload type, listed in `ChromeMessagePayloads`, `VsCodeMessagePayloads` and `WebviewMessagePayloads`. Generators and controllers are type checked against these maps, so a new message is added there first.
Everything around a message is named `<message type><role>`: `ChromeMessageClient`, `VsCodeMessageReceiver`, `QuizChromeMessageGenerator` etc.
A `VsCodeMessage` is a request that VS Code answers with a status. `VsCodeRequestTracker` (`shared/object/`) pairs the requests with their answers and times them out, for Chrome and for a VS Code window alike.
```

## Broad design choices

It's intentional that only one tab can do moodle stuff and one vscode can do vscode stuff at once, this is enforced by the extensions. They both have pathways to overtake from other window for user comfort.

The yellow-orange-turqoise theme is also intentional. It is designed to maximally differentiate from existing Moodle elements to make it clear to the user they're interacting with the extension, not Moodle itself. At the same time it is simple to use. The mild yellow tone calms the nerves during long grading sessions while the blue keeps you alert.

The user has to download all student submissions onto their local disk themselves, as the moodle functionality works very well and it's a one time operation too, so not submission time would be saved by handling it through the extension anyways while more confusion and complication would be introduced.