# Plan: ready for other lecturers

This plan takes the Moodle Assignment Checking Helper from "works for its author" to "another lecturer can install and use it without technical knowledge". It is self-contained: reading it doesn't require the conversation it came from.

---

## Background

On 2026-11-09 the whole project was analysed for obstacles between its current form and use by other lecturers. The author aggregated the findings into eight items:

| # | Item (author's summary) | Where in this plan |
|---|---|---|
| 1 | Distribution: installable packages, a dev guide for building them, shared version numbers | Step 1 |
| 2 | End-user guide | Written by the author after step 5. Key points: Appendix A |
| 3 | Safer grading: preview and an apply button instead of writing into Moodle immediately | Step 2 |
| 4 | Hints that the panel is used together with Moodle's buttons; clearer texts | Step 4 |
| 5 | Clickable things look clickable (whole box, hover glow) | Step 5 |
| 6 | Panel as a separate window instead of injecting it into the Moodle page | **Not in this plan.** Only when the author says so. |
| 7 | VS Code extension is active in every window | Note in the guide (Appendix A) |
| 8 | Status reports in both extensions | Step 3 |

Order: step 1 is independent. Steps 2–4 build on each other: the status line of step 3 lives in the bottom strip of step 2, and step 4 rewrites the texts of steps 2–3. Step 5 is last because it styles every UI, including the new ones.

## How to read this plan

**Work cycle per step:**
1. The solver implements the step.
2. The author reviews it.
3. The solver fixes until the author is satisfied.
4. The step is marked ✅ and a **Done** block records how it was actually solved and where it differed from the plan.

**Functionality rule.** Author:
> dont change functionality unless its explicitly agreed with me. i dont mean light "yeah sure" type agreement, but i explicitly have to tell you that you can edit this specfic functionality. and functionalities only need to change with very good reason, but i can tell you honestly, most of the functionality here is already good, i built this entire architecture and design.

Every step therefore lists its **functionality changes** separately. Each one is either **approved** (with the author's quote) or **pending** (it must be approved before it's implemented). Anything not listed doesn't change.

**Other rules:**
- Only the quotes are authentic. Everything else is the solver's interpretation. When in doubt, follow the quote or ask.
- Before solving, check the patterns that already exist in the project and use them. A new pattern has to be justified to the author.
- The solver doesn't run console commands. Builds, installs and key generation are run by the author.
- No code comments unless they add information the code itself can't show.
- File references are as of 2026-11-11 and may go stale. Find code by name.

---

## Step 1: Releases

**Goal:** one command builds both extensions into installable files in a versioned folder, and the dev guide explains it.

**Author's decisions:**
> build is fine to just have a zip of dist. [...] lets have a shared "releases" folder inside the main project root. into this dist, the zip of chrome extension is put and the vs code extension file. yes, i want fixed manifest key. yes i also want publisher name, put "karl aleksander leoste" (thats my name). other tags can probably be filled as default or empty even. to make this release, a separate build-release script is in the main root which automatically handles all the necessary things. inside the release folder, it puts another folder which is named after the version, and the two extensions go inside of it. this way in the future its possible to have multiple releases. for version numbers, bring both extensions to 1.0.1 and in the future it shall continue to be shared too. regarding version showing, if page and extension view already show it then its not necessary to code anything to show it.

Follow-up answers:
- `vsce` doesn't accept spaces in `publisher`, so the publisher ID is `karl-aleksander-leoste` and the author name "Karl Aleksander Leoste": "yes".
- Script language: "node".
- When the version folder already exists: "ask user yes/no for overwrite".
- Releases in git: "yes. and make it so vsix is only ignored inside other places but inside releases folder its seen by git".
- The VS Code README stays as it is until the end-user guide replaces it: "yes".

**Tasks:**
1. **Version 1.0.1** in `google-chrome-extension/package.json` and `visual-studio-code-extension/package.json`, including the version fields of their `package-lock.json`. The manifest ([manifest.config.ts](../google-chrome-extension/manifest.config.ts)) takes its version from the Chrome `package.json` (this needs `resolveJsonModule` in the Chrome tsconfig), so each extension holds its version in one place.
2. **Fixed extension ID.**
   - The author generates an RSA key once. The solver provides the two `openssl` commands; Git Bash includes `openssl`.
   - Only the public key goes into the manifest's `key`. The private key isn't needed for unpacked installs and isn't committed.
   - Side effect: the author's current install gets a new ID once, so the definitions folder has to be chosen again.
3. **VS Code `package.json`:** `"publisher": "karl-aleksander-leoste"`, `"author": "Karl Aleksander Leoste"` and the devDependency `@vscode/vsce`.
4. **`build-release.mjs` in the project root** (Node). It:
   - reads both versions and stops if they differ;
   - asks yes/no whether to overwrite if `releases/<version>/` already exists;
   - runs `npm install` and the production build in both extensions;
   - zips the Chrome `dist/` into `releases/<version>/`;
   - packages the `.vsix` into the same folder with `vsce package`. It uses `--no-dependencies` because `ws` is bundled, and `--allow-missing-repository` and `--skip-license` so it doesn't stop to ask.

   Technical note: zipping uses the `tar` that comes with Windows 10+ and macOS. On Windows the script must call `%SystemRoot%\System32\tar.exe` explicitly, because Git Bash's GNU `tar` can come first in `PATH` and can't make zip files.
5. **`.gitignore`:** `*.vsix` stays ignored everywhere except under `releases/`.
6. **Docs:**
   - A "Releasing" section in the root README.
   - In the extension READMEs, fix the `chrome-extension` paths (the folder is `google-chrome-extension`) and the claims that production builds are minified (both builds use `minify: false`).

**Functionality changes:** none. Only the build, packaging and version number change.

**Notes:**
- Proposed file names: `moodle-assignment-checking-helper-chrome-<version>.zip`, and `vsce`'s default `moodle-assignment-checking-helper-<version>.vsix`.
- The VS Code README is packed into the `.vsix` and shown inside VS Code as the extension's details page. It stays the dev guide until the author's end-user guide replaces it.

---

## Step 2: Safer grading

**Goal:** the panel shows the grade and comment as they're generated, and writes them into Moodle only when the lecturer presses a button.

**Author's decisions:**
> instead a safer approach is needed, where the comment and grade is reported in the custom window as it gets generated, and a button exists to commit it into moodle, after which the user can press moodle continue button.

> preview is read-only. theres already built-in mechanic for adding custom text to comments. allowing preview to be edited would create only confusion when afterwards people press buttons to change the state. so read-only. comment section should still expand [...]

> preview and button should go to bottom, but it should be always visible, it shouldnt be so you scroll the bottom to see it. if grading info becomes too long it becomes scrollable right now yes, but that just meqans that the scrollable panel is like a separate panel, under which the preview comes. the preview isnt very tall at all, cause panel is wide, so the preview is probably just very long and thin.

> dont call it committing to the user, its complicated to average person who isnt familiar with source control. call it applying. and yeah it should show to user that there are unapplied changes. regarding warning about existing grade in moodle: dont warn, ill create this functionality when it becomes necessary. commit telling moodles form that the fields changed: add this to the readme as a future development, a conceptual one, theres already a place in readme for this. dont implement this.

**Tasks:**
1. **Layout:** the feedback area scrolls on its own. Below it is a strip that is always visible, wide and thin.
2. **The strip** shows:
   - the read-only grade and comment preview;
   - an apply button;
   - an "unapplied changes" indicator. It is on from page open until the first apply, and again after any toggle or "Kommentaari algus" edit.
3. **Apply** writes the grade and comment into Moodle with the existing `AssignmentGraderPage.setGrade()` and `setComment()`.
4. Moodle's comment section is still expanded when the page opens (unchanged).
5. **README "Conceptual changes":** a new entry. The grade and comment are set directly, without the input/change events that Moodle's form scripts listen to, so Moodle's own change detection may not notice them.
6. The user-facing word is "apply". Proposed Estonian wording: "Rakenda". The final wording is decided in step 4.

**Functionality changes:**
- **2a. Approved.** The grade and comment are written into Moodle only on apply, no longer on page open or on every change. (Author's item 3, quoted above.)
- **2b. Approved.** When no definition is found, the preview and apply button aren't shown, because there's nothing to apply. The strip itself stays, because step 3 puts the status line there. ("2b: yes", "agree with the two things you adjusted")

---

## Step 3: Status bars

**Goal:** both extensions have their own status bar that shows the current state: connection, the latest events and problems. Both behave the same way, so they feel like one tool.

**Author's decisions:**
> i want them to act same way in both vscode and chrome to bring familiarity and recognisability to the user. so in vscode, i would want to put it in the status ba. and in chrome, the equivalent i guess is status line in the panel. successes happening on every student switch how would that be noisy? if status just reflects current status then theres no noise, thats the purpose of it instead fulfilled. show all status updates and if it gets noisy for some reason then thats another thing i will handle it another time [...]

> vscode results: good call, its time to add a different type of "not found" response. at the same time, chrome extension needs the addition of reporting status that it got from vscode, probably on the same status bar. that way the two really feel cohesive unit, right now its only known by user that theyre connected but it doesnt feel like it through ui. broken definition files: yeah include it, but i think chrome doesnt give full filename. if it gives just filename thats enough though. port already in use: we can use the status bar that i mentioned earlier for this. basically here the vision draws clearer, the extension needs its own status bar that shows all the necessary info: connection status, log report etc. how messages are produced: yeah i agree with notification layer.

Follow-up answers:
> no, just show disconnected and when user is opened then show "reconnecting" and "connected". it will be good to visually track the lifecycle.

> sure why not if its basically oneliner. if its complicated then no.

(about clicking the VS Code status bar item to open the Output log)

> yes there should be separate no workspace folder open status. number of opened files doesnt need to be reported, only if something was opened or no.

> add structure checking also into todo. i dont want to implement it right now cause this is actually sort of a business rule level thing andto avoid duplicate definitions, it would ideally be declared only once somewhere and other places are derivative, but i dont know how to do it right now so only add this into the readme future concerns list.

> yeah popup too. im sure you can find many opportunities for shared components here too, but remember to keep in line with how the rest of the project already is built and be reasonable about it.

> yes it should, though hopefully that never happens.

(about showing "Moodle element not found" in the status line)

**Tasks:**
1. **Notification layer** in both extensions, separate from the logger. Its texts go in `shared/translations/translations.ts`, in Estonian. The logger stays as it is.
2. **VS Code status bar item:**
   - **Connection:** disconnected / connected, and "port in use" when another window is receiving. VS Code only sees a connection once it's open, so "reconnecting" exists only on the Chrome side. ("agree with the two things you adjusted")
   - **Latest request:** student name → files opened / nothing opened / student folder not found / no workspace folder open / error.
   - The tooltip shows details. Clicking the item opens the "Moodle Assignment Checking Helper" Output channel.
3. **Protocol:** new VS Code response statuses next to the existing ones in `shared/constants/vscode-message.ts`: student folder not found, no workspace folder, nothing opened. The VS Code handler returns the result instead of always answering "ok".
4. **Chrome panel status line**, in the bottom strip from step 2. It shows:
   - **VS Code connection:** disconnected / reconnecting / connected;
   - **VS Code's answer:** the same results as in task 2;
   - **Definition:** found ("name") / none for this assignment ID / definitions folder not chosen / broken files (file names);
   - **Moodle element not found.**
5. **Chrome popup status line:** the result of choosing or reloading the folder — loaded / broken files (names) / permission refused / folder not chosen.
6. **Shared renderer:** the panel and popup status lines share one renderer in Chrome's `src/shared/renderer/`, next to `BaseRenderer`. Other parts are shared only where the existing structure clearly supports it.
7. **Broken definition files by name:**
   - The folder reader keeps each file's name (`entry.name`, the file name only).
   - The stored copy holds the names together with the contents.
   - The repository reports which files it skipped.
   - The stored format changes, so an old stored copy counts as missing until the definitions are reloaded once (as described under README "Database").
8. **VS Code WebSocket server** handles a busy port and reports it in the status bar, instead of failing with an uncaught error.
9. **README "Conceptual changes":** a new entry about definition structure validation. Currently only JSON syntax is checked, and a file with the wrong shape (e.g. no `moodleIds`) can break the popup list and the lookups. It's a business-rule-level concern: the definition structure should ideally be declared once and everything else derived from it.

**Open design point (proposed to the author at the start of the step):**
- Showing the live connection state in the panel needs messages from the service worker to the panel. Today messages only go from the panel or popup to the service worker, as request and response.
- This is a new message direction, so the mechanism is proposed and justified before it's built.
- Related: Chrome's service worker closes the WebSocket about 30 s after the last message. That is when "disconnected" appears.

**Functionality changes:**
- **3a. Approved.** VS Code answers with new statuses: student folder not found, no workspace folder, nothing opened. ("its time to add a different type of "not found" response", "yes there should be separate no workspace folder open status", "only if something was opened or no")
- **3b. Approved.** When VS Code can't be reached or doesn't answer in time, the service worker answers the panel with a status. Today it answers nothing. ("3b: ok")
- **3c. Approved.** Definition file names are stored with their contents. ("broken definition files: yeah include it")
- **3d. Approved.** The VS Code server handles a busy port and reports it. ("port already in use: we can use the status bar")
- **3e. Approved.** Status line in the popup. ("yeah popup too")
- **3f. Approved.** "Moodle element not found" in the status line. ("yes it should")
- **3g. Approved.** Clicking the VS Code status bar item opens the Output channel. ("sure why not if its basically oneliner")
- **3h. Approved.** The connection lifecycle is shown in both status bars. ("just show disconnected and when user is opened then show "reconnecting" and "connected"")

---

## Step 4: Texts and hints

**Goal:** the panel and popup tell the lecturer how they're used together with Moodle, and every text says what to do next.

**Author's decisions:**
> make it more intuitive that the custom panel is meant to be used alongside moodle buttons. a simple text such as "use moodle's "agree and next" button to submit" would work okay for this purpose. identify other such cases and report it to me. alongside this, make existing texts more intuitive, for example the one that reports that grading matrix wasnt found, could include text saying what to do about it.

Follow-up answers:
- All texts in Estonian: "yes all estonian".
- Moodle's buttons are referred to "just [in] general terms".

**Hints (all seven chosen: "all 7 hints are good"):**

| # | Hint | Where |
|---|---|---|
| 1 | After applying, save with Moodle's save button. | Next to the apply button |
| 2 | Applying replaces the grade and comment in Moodle; free text goes into "Kommentaari algus". | Next to the apply button |
| 3 | Moving to another student starts fresh: selections and "Kommentaari algus" don't carry over. | Panel |
| 4 | After reloading definitions, reload the Moodle page (or open the next student) to use them. | Popup, at the reload button |
| 5 | Where the panel appears: an assignment's grading page in Moodle. | Popup |
| 6 | The panel's left edge can be dragged to resize it. | Panel |
| 7 | The quiz button saves by itself; no Moodle button is needed. | Quiz button |

**Texts to rewrite** (in [translations.ts](../shared/translations/translations.ts)), together with the new texts from steps 2–3:

| Text | What it should add |
|---|---|
| "Hindamismaatriksit ei leitud…" | What to do (popup → folder → reload) and this assignment's ID |
| "Definitsioone ei leitud" | Choose a folder or reload; invalid files may be the reason |
| "Kaust valimata" / "Pole laetud" | That the button above is the next step |
| "Lae failidest uuesti" | That it's needed after editing files, and that the Moodle page then needs reloading |
| "Kommentaari algus" | That it's free text placed before the generated lines, and resets per student |
| "label:" / "enabled:" / "disabled:" | "Panel only" / "when on" / "when off", instead of field names |
| "Assign max points with no comment" | Estonian wording, and that it saves on its own |
| VS Code "No folder found for…" | Where it looked, and the expected folder structure |
| VS Code "No workspace folder open." | Which folder to open |
| Extension descriptions (Chrome manifest, VS Code `package.json`) and the VS Code command title | Estonian wording |

The solver proposes the Estonian wording and the author decides.

The extension name "Moodle Assignment Checking Helper" stays in English as a proper name ("4. yes").

**Functionality changes:** none. Only texts change.

---

## Step 5: One UI style and hover feedback

**Goal:** every UI of the extensions looks like the grader panel, and everything clickable reacts to the mouse.

**Author's decisions:**
> make clickable things clearer. only the thumbsup emoji is clickable, make the entire box clickable and make it get slight underglow, the entire box, when hovered, so its clear it can be clickable. make all interactable things interact with the mouse when hovered like so.

> ok dont use ghostwhite, use the same hover background that is used for the emojis when theyre clicked. the bright blue shiny one, that exact color and that type of glow. all interactable things means everything inside my module's uis. and this is a good chance here, to do as a separate thing, but i will want you to do it, just as a separate step and do the hovers in the same step: all of the uis of this extension need to be turned into the same. the main panel's ui, the one with emojis, yellow etc, thats my custom ui, thats exactly how i want it. every other part of the ui such as the popup etc needs to become the same. currently i think many uis are blank and plain. and yes, the thumbsup should stay exactly how it is with the glow as indicator, im very proud of it.

> yes one shared place. and yes youre right this will solve the ui and css concern.

(about the colours)

**Tasks:**
1. **Colours** move into one shared place (CSS variables) that the panel, quiz and popup styles use.
2. **Same look everywhere:** the popup, quiz button, bottom strip and status lines get the panel's look.
3. **Whole part box clickable:** it toggles exactly like the thumbs-up does now. The thumbs-up and its glow stay unchanged.
4. **Hover glow** in cyan `#2BFFFF`, the same colour and kind of glow as the active thumbs-up, on every interactable element:
   - part boxes;
   - "Kommentaari algus";
   - the apply button;
   - popup buttons;
   - the quiz button;
   - the panel's resize edge.

   The size is scaled to each element and tuned in review, because the thumbs-up's own values (3.73em blur, 1.83em spread) would cover the neighbouring boxes.
5. **README "UI and CSS":** the colour part is solved by task 1. The concern's two other parts aren't solved by this step and belong with the separate panel window (item 6):
   - the panel's `left: 40%` depends on Moodle's two 20% panel widths;
   - Moodle selectors are repeated in `assign-grader.css`, separately from the page objects.

   They move into a new README "Conceptual changes" entry for the separate panel window, and the "UI and CSS" entry is removed. ("regarding the remaining ui and css concerns: move them into the separate window thing as you suggested yes.") The README has no entry for the separate window yet; the new entry describes it with the author's words from item 6:
   > layout as a separate popup control panel. this is a massive undertaking as it involves insane refactors so id like to do it completely separately only when i say its time. it needs implementing a new system for controlling such a popup potentially, and transferring the injection into this, and implementing communication between them.

**Functionality changes:**
- **5a. Approved.** Clicking anywhere in a part box toggles it. ("make the entire box clickable")

---

## Appendix A: points for the end-user guide

This is what the project declares as of 2026-11-11, collected for the author's guide. Nothing here is invented. The panel parts change with steps 2–5, so update them when the guide is written.

**Installing (after step 1):**
- **Chrome:** unzip the zip, open `chrome://extensions`, turn on Developer mode, then Load unpacked.
- **VS Code:** in the Extensions view open the "…" menu and choose Install from VSIX.

**Requirements:**
- The Chrome extension works on its own. The VS Code extension is an optional companion that opens the student's files ([README](../google-chrome-extension/README.md)).
- It only runs on `https://moodle.taltech.ee`, on three kinds of page: the assignment grader, quiz review and quiz comment pages ([manifest.config.ts](../google-chrome-extension/manifest.config.ts), [config.ts](../google-chrome-extension/src/config.ts)).
- VS Code 1.90 or newer is required ([package.json](../visual-studio-code-extension/package.json)).
- The extensions talk over `ws://127.0.0.1:54321`, so that port must be free ([connection.ts](../shared/config/connection.ts)).

**Popup and definitions folder:**
- "Vali definitsioonide kaust" opens a folder picker with read-only access. The popup then shows the folder name, or "Kaust valimata" ([FolderAccessService.ts](../google-chrome-extension/src/popup/service/FolderAccessService.ts)).
- Definitions load as soon as a folder is chosen.
- "Lae failidest uuesti" reads the files again. The popup then shows the time of the last load, or "Pole laetud" ([PopupRenderer.ts](../google-chrome-extension/src/popup/renderer/PopupRenderer.ts)).
- When reloading, Chrome may ask for permission to read the folder. If the lecturer refuses, nothing loads.
- The whole folder is read, including subfolders. Files that aren't valid JSON are skipped.
- The extension keeps a stored copy of the definitions:
  - editing a file has no effect until the lecturer reloads in the popup;
  - the panel reads the definition when a student's page opens, so after a reload the Moodle page has to be reloaded, or the next student opened.
- The popup lists definitions as "course code - name (ids)", grouped by course code. It shows "?" when there's no course code and "Definitsioone ei leitud" when there are none ([DefinitionListRenderer.ts](../google-chrome-extension/src/popup/renderer/DefinitionListRenderer.ts)).

**Definition file format** ([Assignment.ts](../google-chrome-extension/src/shared/types/Assignment.ts), [Feedback.ts](../google-chrome-extension/src/shared/types/Feedback.ts), [FeedbackPart.ts](../google-chrome-extension/src/shared/types/FeedbackPart.ts)):
- `name` is shown in the popup.
- `moodleIds` is a list of IDs, each compared with the `id` in the grader page's URL. One definition can serve several assignments. If two definitions share an ID, the first one found is used.
- `course_code` is optional and only used for grouping in the popup.
- `feedback` is a list of groups. Each group has `title`, `intended_max_points` (shown as "(Xp)" next to the title, not used in the grade) and `parts`.
- Each part has:
  - `enabled`: whether it's on when a student page opens;
  - `points`: added when the part is on, can be negative, 0 if missing;
  - `enabledText`: the comment line when the part is on;
  - `disabledText`: the comment line when it's off;
  - `labelText`: shown only in the panel, never in the comment.

  Empty or null texts add no line.
- The grade is the sum of the points of the parts that are on. If the sum is 0 or less, the grade is 100 ([grading-rules.ts](../google-chrome-extension/src/content-script/rules/grading-rules.ts)).
- The comment is the "Kommentaari algus" text first, then each part's line in file order, one per line.

**Grader panel** (changes with steps 2–5):
- The panel appears on the assignment's grader page. Moodle's review panel and grade panel are squeezed to 20% width each ([assign-grader.css](../google-chrome-extension/src/content-script/assign-grader.css)).
- It's rebuilt for every student, about 1.2 s after the page stops changing. Selections and "Kommentaari algus" start over for each student.
- The thumbs-up toggles a part: glowing means on, grey means off.
- Moodle's comment section is expanded when the page opens.
- When no definition matches, the panel says "Hindamismaatriksit ei leitud…".
- Dragging the left edge resizes the panel (a 10 px strip; minimum width 200 px).
- The panel switches to two columns when it's at least 1000 px wide.
- Moodle's save button also saves the comment written into Moodle's comment box.

**VS Code:**
- The extension starts in every VS Code window. Its logs are in the Output panel under "Moodle Assignment Checking Helper", with an "activated" line on start ([extension.ts](../visual-studio-code-extension/src/extension.ts)).
- Expected setup: submissions downloaded from Moodle all at once into separate folders, and that folder opened in VS Code ([README](../visual-studio-code-extension/README.md)). Only the top level of the first workspace folder is searched.
- When a student's grader page opens, it first closes all terminals and all editors and collapses the explorer. Only then does it look for the student's folder ([StudentSubmissionService.ts](../visual-studio-code-extension/src/service/StudentSubmissionService.ts)).
- A folder matches if its name starts with the student's name as Moodle shows it ([student-files-rules.ts](../visual-studio-code-extension/src/rules/student-files-rules.ts)).
- It opens at most 20 files ([config.ts](../visual-studio-code-extension/src/config.ts)):
  - subfolders are included except `.idea` and `.venv`;
  - files alternate between two editor columns;
  - images and PDFs open as previews.
- Right-clicking a `.py` file gives "Run Python script in a new terminal". It opens a terminal called "Python Runner" in the file's folder and runs `python "file"`.
- **Item 7:** every VS Code window starts the extension, but there is only one port. Only the window that started first receives students, and that is the window whose editors and terminals get closed. This follows from the code: `activationEvents` and the fixed port.

**Quiz:**
- On the quiz review page, every manually graded question in the "complete" state gets an "Assign max points with no comment" button ([QuizPage.ts](../google-chrome-extension/src/content-script/pagemanager/QuizPage.ts)).
- Clicking it opens the question's comment page, which fills in the maximum mark and saves on its own ([QuizCommentPresenter.ts](../google-chrome-extension/src/content-script/presenter/QuizCommentPresenter.ts)).

**Troubleshooting** ([README](../README.md), "Logging"):
- Every log line starts with `[Moodle Helper]`.
- In Chrome, panel logs are in the Moodle page's console. Definition and VS Code connection logs are in the service worker's DevTools.
- In VS Code, logs are in the Output channel.
