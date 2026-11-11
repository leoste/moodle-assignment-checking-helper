# Plan: ready for other lecturers

This plan takes the Moodle Assignment Checking Helper from "works for its author" to "another lecturer can install and use it without technical knowledge". It is self-contained: reading it doesn't require the conversation it came from.

---

## Background

On 2026-11-09 the whole project was analysed for obstacles between its current form and use by other lecturers. The author aggregated the findings into eight items:

| # | Item (author's summary) | Where in this plan |
|---|---|---|
| 1 | Distribution: installable packages, a dev guide for building them, shared version numbers | Step 1 |
| 2 | End-user guide | Written by the author after step 6. Key points: Appendix A |
| 3 | Safer grading: preview and an apply button instead of writing into Moodle immediately | Step 2 |
| 4 | Hints that the panel is used together with Moodle's buttons; clearer texts | Step 4 |
| 5 | Clickable things look clickable (whole box, hover glow) | Step 5 |
| 6 | Panel as a separate window instead of injecting it into the Moodle page | Step 10: only the README, which becomes the sole owner of the idea |
| 7 | VS Code extension is active in every window | Note in the guide (Appendix A) |
| 8 | Status reports in both extensions | Step 3 |

Order: step 1 is independent. Steps 2–4 build on each other: the status line of step 3 lives in the bottom strip of step 2, and step 4 rewrites the texts of steps 2–3. Step 5 comes after them because it styles every UI, including the new ones. Step 6 tests everything steps 1–5 changed.

Steps 7–14 work through what was the README's "Future concerns" section (see "Part 2" below).

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

## Step 1: Releases ✅

> **Done:** solved as planned. The author built release 1.0.1 successfully. Details:
> - The `vsce` flags (`--no-dependencies --allow-missing-repository --skip-license`) are in a `package` script in the VS Code `package.json`. `build-release.mjs` calls `npm run package -- --out <file>`.
> - The script deletes an existing release folder only after both extensions have been built, so a failed build leaves the old release in place.
> - The Chrome zip contains the contents of `dist/`, not the folder itself.
> - `@vscode/vsce` resolved to 3.9.2, which requires Node.js 20 or later. The root README says so.
> - The public key is written inline as `key` in `manifest.config.ts`. The author keeps the private key outside the repository.
> - The lockfiles' version fields were updated by hand. The `vsce` entries were added to the VS Code lockfile by `npm install` during the first release run.
> - The development build and an installed release now have the same extension ID, so only one of them can be loaded in Chrome at a time.

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
1. **Version 1.0.1** in `google-chrome-extension/package.json` and `visual-studio-code-extension/package.json`, including the version fields of their `package-lock.json`. The manifest ([manifest.config.ts](../src/google-chrome-extension/manifest.config.ts)) takes its version from the Chrome `package.json` (this needs `resolveJsonModule` in the Chrome tsconfig), so each extension holds its version in one place.
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

## Step 2: Safer grading ✅

> **Done:** solved as planned. Details:
> - The new `ApplySectionRenderer` follows the existing renderer and callbacks pattern: `CheckingHelperPanelCallbacks` extends both `FeedbackSectionCallbacks` and the new `ApplySectionCallbacks`. It reuses the part rows' classes (`item-container`, `text-section`), so the strip looks like a part row.
> - `CheckingHelperPanelRenderer` splits the panel into a scroll area (feedback) and a bottom strip. The strip holds the apply section and, from step 3, the status line. The panel frame itself no longer scrolls.
> - The comment preview is at most 6em tall and scrolls on its own beyond that.
> - The provisional texts are in a new `apply` group in `translations.ts`. Step 4 settles the wording.
> - Testing is done once at the end of the plan, not per step (author's decision).

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

## Step 3: Status bars ✅

> **Done:** built according to the approved design (below). Details:
> - **`BaseReporter`** has `setSink()`, `hasSink()` and a fallback sink. The logger's behaviour is unchanged: its sink is still set once, with the console as fallback. `statusReporter.setSink()` is public and immediately shows the current statuses in the new sink; its fallback sink shows nothing.
> - **Folders:** the logger moved from `shared/logging/` to `shared/reporting/`; the author deleted the old files. The extensions' own reporting files are in `reporting/` folders: VS Code `src/reporting/`, Chrome `service-worker/reporting/` and `src/shared/reporting/`. Which status a situation gets is decided in two new `rules/` folders: root `shared/rules/` and Chrome's `src/shared/rules/`.
> - **Requests without a response:** `VsCodeConnectionProvider` now resolves them with a status (`unreachable` / `no-answer`) instead of rejecting.
> - **New response shapes:** `feedback/get` answers with a `DefinitionLookup`, `assignments/get-all` with `Definitions` (assignments plus broken file names).
> - **Stored definitions:** they now keep file names. A copy stored in the old format counts as not loaded, so definitions have to be reloaded once after updating.
> - **Non-JSON files are reported as broken:** every file in the definitions folder is read. This is documented in the README entry "Definition structure validation"; the author accepted it as is.
> - **Late answers:** a stopped presenter's late answers don't overwrite the next page's statuses. Only the status reports are guarded; the page flow is unchanged.
> - **Smaller decisions:** an empty student name is answered with "not found". VS Code's existing warning pop-ups stay unchanged.

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

**Design (proposed at the start of the step, approved by the author):**
1. **Notification layer:** a `statusReporter` in every context, built like the `logger`. Every status belongs to a topic, and a new status replaces the old one in its topic, so the bar always shows the current state.
2. **Service worker → panel and popup:** a long-lived port. The panel opens it on every student page and the popup when it opens. The service worker sends its connection statuses over it. When Chrome stops the idle service worker, the WebSocket and the port close together, so a closed port means "disconnected". The port isn't reopened until the next page, so it doesn't keep waking the service worker up.
3. **Per-request results stay in responses:** VS Code's answer and the definition state come back in the response to that tab's request, so two open tabs don't show each other's results.

Author's answers: "2. ok", "3. ok". About the logger and the status reporter sharing a parent class:
> ok good answer and yes i still want that shared class, even if it is small, as even the mere existence of the class already communicates important details to future developers. it should go in shared. but here i want to make it a bit different than you say. instead of three folders in shared, lets merge them all into shared/reporting.

So `BaseReporter`, the logger and the status reporter are all in `shared/reporting/`. The extensions' own reporting files are in `reporting/` folders as well, following the same naming.

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

## Step 4: Texts and hints ✅

> **Done:** the solver proposed Estonian wording; the author changed parts of it and approved the result. Details:
> - **Hint 3** ("moving to another student starts fresh") was left out: "see hint pole üldse vajalik sain just aru, jätame selle välja".
> - **Hint 1** became the apply state. Before applying it reads "Rakenda muudatused Moodle'isse", after applying "Rakendatud. Salvesta Moodle'i nupuga."
> - **Hint 4** is the author's own text: "Pärast definitsioonifailide muutmist on vaja käsitsi vajutada värskendamise nuppu. Muudatused võetakse kasutusele Moodle'i lehe värskendamisel."
> - **Hint 7** is the quiz button's own label: "Anna maksimumpunktid ilma kommentaarita (salvestab kohe)".
> - **Where the hints are:** the resize hint is under the panel title, hint 2 under the apply preview, and the intro (hint 5) and the reload hint (hint 4) are in the popup.
> - **Other text changes:** the "label:" prefix is gone, so its translation entry was removed. The "Kommentaari algus" box got a placeholder text.
> - **VS Code `package.json`:** the description and the Python command title are in Estonian.

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

**Texts to rewrite** (in [translations.ts](../src/shared/translations/translations.ts)), together with the new texts from steps 2–3:

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

## Step 5: One UI style and hover feedback ✅

> **Done:** solved as planned. Details:
> - **One shared stylesheet:** `src/google-chrome-extension/src/shared/styles/theme.css` holds the three colours as CSS variables, the frame, the hover glow, and the button, hint and status line looks.
>   - The manifest loads it into Moodle pages before each content script's own CSS; the popup loads it with a `<link>`.
>   - Because it is loaded into Moodle pages, all its classes and variables have the existing `checking-helper-` prefix. The `hint` and `status` classes from steps 3–4 were renamed to match.
> - **Popup:** it was rebuilt like the panel: a frame, a scroll area, and a bottom strip with the status line.
> - **Hover glow:** everything interactable has the `checking-helper-interactive` class and a cyan glow on hover: part boxes, "Kommentaari algus", the apply button, popup buttons and the quiz button. The panel's left edge glows on the inside when the mouse is on it.
> - **Glow size:** smaller than the thumbs-up's (1em blur, 0.25em spread). Near the scroll area's edges it is partly cut off, as the thumbs-up's glow already was. To be tuned in testing if needed.
> - **Whole box clickable:** clicking anywhere in a part's box toggles it. Known side effect: selecting text in a box by dragging also toggles it. Avoiding that would be a behaviour change, so it's left as it is.
> - **Quiz button:** it has the yellow button look with an orange frame.
> - **README:** a new "Styles" building block. The "UI and CSS" entry was replaced by "Panel as a separate window".

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

## Step 6: Testing ✅

> **Done:** the author tested release 1.0.1, reported ten findings (see "Findings" below), and the fixes were released as 1.0.2. The re-test of 1.0.2 passed:
> > i fixed this stuff and i tested everything again, current version everything works pretty well.
>
> One more issue came up while building 1.0.2: the VS Code icon had been copied into the extension's `src/images/` instead of `images/`. The author moved it.

**Goal:** test everything steps 1–5 changed, once and as a whole, then fix what the test finds. The steps weren't tested one by one, so this step is where they are verified.

**Author's decisions:**
> i wont test things in the go right now and you dont need to either, ill test it all in the end as were doing so comprehensive and widespread changes each time that wed have to test the whole system each time, waste of time. much better is to test it once in the end and do one test-fix-test-fix cycle in the end.

> mark 5 done and add step between 5 and 6 called testing and explain that its purpose is to test all steps 1-5. this way knowledge exists in a real file not only between us two

**How:**
1. The author tests the installed release, not the development builds. Steps 1–5 were never built or run by the solver, so this is their first real run.
2. The author reports what failed, with the error output of the build or the browser console.
3. The solver fixes it. As in every step, a fix that would change functionality is approved by the author first.
4. Steps 2–3 repeat until everything works. Each finding and its fix is recorded under "Findings" below.

**Before building:**
- Run `npm run typecheck` in `src/google-chrome-extension/` and in `src/visual-studio-code-extension/`. Vite and esbuild only remove TypeScript types and don't check them, so a type error doesn't stop the build.
- `releases/1.0.1/` already exists from step 1, built before steps 2–5. It was never handed out, so it is overwritten (answer `y`). The version is raised once a release is actually handed out.

**Installing for the test:**
- **Chrome:**
  - Remove the development copy (`src/google-chrome-extension/dist`) and any earlier install. They have the same ID, so only one can be loaded.
  - Unzip the release into a folder that stays, because Chrome loads the extension from it every time.
  - Load that folder with Developer mode → Load unpacked.
- **VS Code:**
  - Uninstall an earlier 1.0.1 if there is one.
  - Install the `.vsix` (Extensions view → "…" → Install from VSIX) and reload the window.
- **After installing:**
  - Choose the definitions folder again. The new ID starts with empty storage.
  - Refresh any Moodle tabs that were already open.
- **VS Code windows:** the installed extension runs in every window, and only the first one receives students; its editors and terminals get closed. Open the window with the downloaded submissions first, and don't run the F5 development host at the same time.

**What to check:**

**Release and install (step 1)**
1. `node build-release.mjs` builds `releases/1.0.1/` with the zip and the `.vsix`. Running it again asks whether to overwrite.
2. Both releases install. Afterwards choose the definitions folder and reload once, because the extension ID changed and old stored definitions count as not loaded.

**Popup (steps 3–5)**

3. The popup has the panel's look: frame, colours, hints, and the status line at the bottom. The buttons glow on hover.
4. Choosing a folder and reloading shows how many definitions are loaded in the status line. Broken files are named there too.
5. Refusing the folder permission shows the no-permission status. Without a folder, the status says the folder isn't chosen.
6. The status line shows the VS Code connection.

**Panel (steps 2–5)**

7. Opening a student leaves Moodle's grade and comment fields untouched. The preview shows the default values and the state says "Rakenda muudatused Moodle'isse".
8. Clicking anywhere in a part's box toggles it. The part boxes, "Kommentaari algus", the apply button and the left edge glow on hover.
9. "Rakenda Moodle'isse" fills in Moodle's fields and the state changes. Moodle's save button saves both the grade and the comment.
10. With a long definition the feedback scrolls and the strip stays visible.
11. Without a definition, the panel shows what to do, the status line shows the reason and the assignment ID, and there's no apply section.
12. The connection statuses go reconnecting → connected, then "ühendus puudub" about 30 s later. VS Code's answer shows for the student. With VS Code closed, the status says "VS Code pole avatud või laiendus pole paigaldatud".
13. Switching students quickly: the statuses belong to the current student.
14. Resizing from the left edge still works.

**VS Code (step 3)**

15. The status bar item shows the connection and the latest student. Clicking it opens the Output log. Problems give it the warning background.
16. With a second VS Code window open, its status bar says the port is taken, and the first window receives the students.
17. No folder open, or a student's folder missing, show the status plus the Estonian warning.
18. The Python command and terminal names are in Estonian.

**Quiz (steps 4–5)**

19. The quiz button has its new label, the look and the hover glow, and it still gives the maximum points and saves.

**Findings:**

The author sends findings during the test and the solver records them here. Nothing is fixed until the author says the testing is finished, because findings may be related and are fixed together:
> until i say that i have actually finished testing, do not implement fixes for any of them. i suspect that many of the things i find can be connected and fixed much easier together, or be related

1. **VS Code shows the publisher ID instead of the author's name.** The Extensions list shows "karl-aleksander-leoste", while e.g. the Mermaid extension shows its author's real name. Author: "please fix so name is shown as real."
   - *Analysis:* the real name shown for Marketplace extensions is the publisher's display name from their Marketplace account. VS Code gets it from the Marketplace, not from `package.json`. For an extension installed from a `.vsix` it falls back to the `publisher` field, which must be an ID without spaces. The `author` field holds the real name but isn't shown in that list.
   - *Options:*
     - (a) A more name-like ID, e.g. `KarlAleksanderLeoste` or `Karl-Aleksander-Leoste`. The ID allows capital letters and should be shown as written; this needs confirming. The extension's ID (`publisher.name`) changes, so an installed copy has to be uninstalled once.
     - (b) Publish to the Marketplace, which was ruled out in step 1.
     - (c) Leave it as is.
   - **Decided:** leave it as is (c).

2. **"Port in use": switching the receiving VS Code window.** Today the only way around it is to close both windows and reopen VS Code in the right folder. Author's idea: in the window that doesn't receive, the status bar offers a button "switch to this window". The windows then swap: the first window shows what the second one showed before, closes its connection, and the second one opens it. The author's conditions:
   > kui seda on võrdlemisi lihtne teha, siis ma tahaks sellist asja teha, aga sellega peaks kindlasti kaasas käima ka teatav struktuuri lisamine-loomine, et ei tekiks spaghetti codei. olen valmis et see võib ka future concerns alla liikuda, kui see pole megalihtne asi mida teha.
   - *Analysis:* VS Code has no API for windows to talk to each other; each window runs its own extension host. They can still talk through the WebSocket port they compete for:
     1. The window without the port connects to the receiving window as a WebSocket client (`ws` includes a client) and sends a new "hand over" message.
     2. The receiving window answers, closes its server and shows "port in use".
     3. The asking window starts its server, retrying for a moment until the port is free.
     4. Chrome's connection closes with the old server and reconnects to the new one on the next student.
   - *Size:* medium, not "mega lihtne". It needs a new role in the VS Code extension (a WebSocket client next to the server), a new message channel, a status bar command and a retry while the port frees up. It fits the existing message system (channel, payload, handler), so the structure can follow existing patterns.
   - *Decision in the fix phase:* build it, or move it to README "Future concerns".
   - **Decided:** "switching the vscode window: future concern, not right now." It is described in README "Future concerns" under a new "Extra features" section.

3. **The panel's orange divider runs to the right edge** (img1). The author wants a gap on the right like on the left.
   - *Analysis:* the bottom strip's top border starts after the panel's left padding but has no right gap. A CSS fix: give the strip the same gap on the right.
   - **Fixed:** the strip has a right margin equal to the panel's left padding (2.3em). Its contents no longer have their own right padding.

4. **Show the assignment's Moodle ID in the status line.** The panel's "not found" text sends the user to the popup and the ID. The extension already knows the ID, so when the status says "Definitsioonide kaust valimata" or that no definition was found, it should add "Ülesande MoodleID on: <moodleid>".
   - *Analysis:* a text and rule change in `getDefinitionStatus()`. Today only the "not found" status contains the ID, in a different wording. Probably "not loaded" should get it too. The panel's long "not found" text ("ID on näha all olekureal") may need adjusting to match.
   - **Fixed:** the statuses "Definitsioonide kaust valimata", "Definitsioonid laadimata" and "Sellele ülesandele definitsiooni ei leitud" all end with ". Ülesande MoodleID on: <id>". "Not loaded" is included because it's the same situation. The panel's long text stays as it is, because it already points to the status line for the ID.

5. **Refresh the panel when definitions are reloaded.** Today the lecturer reloads the definitions in the popup and then also has to refresh the Moodle page. The panel should update right away, using the existing message architecture. The panel's state has to survive this: the selections and the "Kommentaari algus" text, except for parts that no longer exist in the new definition.
   - *Analysis:* the status port from step 3 can't carry this. The panel's port closes when the service worker idles (about 30 s), on purpose, and the lecturer usually reloads minutes after the last student. The message has to reach the panel without a port that's already open. Options:
     - (a) The popup, or the service worker, broadcasts a new Chrome message to the tabs (`chrome.tabs.sendMessage`), and the content script gets a receiver for it. This fits the message system, but the content script is a new receiving side.
     - (b) A "definitions updated" value in `chrome.storage.local`, which content scripts can listen to (`chrome.storage.onChanged`). This is simpler, but not the message system.
   - *Keeping the state:* old selections have to be matched to the new definition's parts, either by position (simple, but wrong if parts are reordered) or by the parts' texts. To be decided in the fix phase.
   - *Functionality change:* approved by the author's request.
   - **Decided:** option (a), the Chrome message, and matching by texts. On the matching:
     > match by texts as you recommended, but please definitely make this a separate helper or class or something, cause i can already see how this could take a bunch of room in the original file while not really being relevant to the overall structure and logic of it, so its best suited to live in a helper
   - **Fixed:**
     - **The message:** `assignments/updated`. After a successful reload, the popup's `AssignmentClient.notifyAssignmentsUpdated()` sends it to all tabs with the new `ChromeMessageClient.sendToTabs()`. Tabs without a listening content script reject it, which is ignored.
     - **The content script's receiving side:** `ChromeMessageReceiver` and `ChromeMessageController` moved from `service-worker/` to Chrome's `src/shared/`, following the `IndexedDBProvider` pattern (shared code, one instance per context). The service worker's imports were updated. The author deletes the old files.
     - **The handler:** the assignment grader content script initialises its own receiver and a content-script `AssignmentController`. The controller passes the message on to `AssignmentGraderListener.refreshDefinition()`, which forwards it to the current presenter.
     - **The presenter:** `AssignmentGraderPresenter.refreshDefinition()` looks the definition up again and reports its status. It carries the selections over and renders the feedback and the apply section again. "Kommentaari algus" is rendered again with its text, and the apply state goes back to "Rakenda muudatused Moodle'isse".
     - **The matching:** a separate rule, `carryOverSelection()` in `content-script/rules/selection-rules.ts`. A part is identified by its group title and its three texts; new and edited parts get their default selection.
     - **Re-rendering:** `FeedbackSectionRenderer.renderFeedback()` replaces the feedback it rendered before, and `CommentPrefixRenderer` takes the current text. `CheckingHelperPanelRenderer` got `clearApplySection()`.
     - **README:** "Extensions and contexts" and "Layers" describe the new message direction, and controllers in the content script.
     - **The popup's reload hint:** its second sentence said changes take effect when the Moodle page is refreshed, which is no longer true. The solver proposed: "Pärast definitsioonifailide muutmist on vaja käsitsi vajutada värskendamise nuppu. Avatud hindamislehtedel võetakse muudatused kohe kasutusele." Approved: "i checked and did what you said and its fine". The fixes are released as 1.0.2.

6. **Grade 0 becomes 100** (img2). The lecturer turns all parts off to give 0 points, and the grade shows 100. The author removes the fallback grade:
   > see pärines ajast, mil commit mõiste puudus ja oli vaja vältida olukorda, kus kogemata antakse tudengile hinne 0. aga nüüd on tegelikult see funktsionaalsus iganenud, kuna on võimalik committida rakenda nupuga. seega, kaotame selle default skoori mõiste täiesti projektist välja.
   - *Analysis:* `FALLBACK_GRADE` in `grading-rules.ts` goes away, and the grade is the plain sum of points. The README entries "Grade fallback and submit prevention" and "Grade scale" have to be updated. *Open question:* definitions with negative points only (e.g. `python-cafe-assignment.json`) can now sum below 0. Should the grade then be 0, or the negative sum as it is? Moodle probably rejects a negative grade when saving.
   - *Functionality change:* approved (quote above).
   - **Decided:** "6: 0 is lowest grade possible".
   - **Fixed:** `FALLBACK_GRADE` was replaced by `MIN_GRADE = 0`, so the grade is the sum of points but never below 0. In the README, "Grade fallback and submit prevention" became "Grade calculation", and "Grade scale" now says that a definition with only deductions needs a scale to work at all.

7. **"VS Code: ühendus puudub" after an idle period is misleading.** It should be "VS Code: ühendus ootel" when the connection closed only because the service worker idled. "Ühendus puudub" should appear only when the WebSocket can't connect. This is what the solver suggested in step 3.
   - *Analysis:*
     - Chrome: a connection that closes after it was open, the panel's port closing, or a fresh service worker that hasn't tried yet → "ootel". A failed connection attempt → "puudub".
     - VS Code: it never sees a failed attempt, so it shows "ootel" while listening without a client, plus "ühendatud" and "port hõivatud".
   - **Fixed:** new text "VS Code: ühendus ootel" and rule `getWaitingStatus()`.
     - `WebSocketConnection` tells whether a closed socket had been connected.
     - The service worker reports "ootel" at start and when a connected socket closes, and "puudub" only when connecting fails.
     - The panel's and popup's port closing means "ootel".
     - VS Code reports "ootel" while it listens without a client.
     - The README "Status" section explains the difference.

8. **"Laiendus ei leidnud Moodle'i lehelt: a.comment-link" when no students are left** (img3: "No users selected", 0 of 0). The extension should recognise that no student is selected and show something calmer, such as "Kasutajat ei leitud". Telling that apart from real errors has to be robust, so for now it goes to the README:
   > nii et lükka praegu see asi future concerns ekstra feature alla.
   - *In the fix phase:* a new entry in README "Future concerns".
   - **Done:** described in README "Future concerns" → "Extra features" → "No student selected".

9. **VS Code extension icon** (answers the solver's question about finding 1): use the Chrome extension's icon, the yellow square.
   - *Analysis:* VS Code needs an `icon` in `package.json`, a PNG of at least 128×128 px inside the VS Code extension's own folder. `vsce` doesn't package files from outside it.
     - The simplest way: the author copies `src/google-chrome-extension/images/128.png` into the VS Code extension (the solver can't copy image files), and the solver adds the `icon` field.
     - A single shared image used by both would need the Chrome build to take the image from outside its own folder.
   - **Fixed:** the VS Code `package.json` has `"icon": "images/icon.png"`. The author copies `src/google-chrome-extension/images/128.png` to `src/visual-studio-code-extension/images/icon.png`; until then the release build fails, because `vsce` can't find the icon.

10. **Noticed by the solver in img2: the grade preview box is too wide.** The grade box should be only as wide as its text, but it takes about half of the strip.
    - *Cause:* in `assign-grader.css`, `div.text-section { flex: 1 }` comes after `div.apply-grade { flex: none }` and has the same specificity, so it wins. A CSS ordering bug from step 2.
    - **Fixed:** the selector is now `div.text-section.apply-grade`, which is more specific, so it wins regardless of order.

---

# Part 2: Future concerns

After step 6 the author went through the README's "Future concerns" one by one: each is either done or dropped.
> now its time to solve the future concerns pile. i will either decide things need doing and we will do them or i will remove them from pile. [...] each block marks one step basically, so one block can be done all at once, but other blocks need to come one by one. [...] reorder the tasks too in a way that the ones where theres multiple ones at once, we do all of these steps first, and after that we do all the lone ones. also further rearrange the single ones so that the ones which require no input from me, are done first, and leave last the ones which i mentioned inside of that i want to decide something based on your further input before actual development. we will be developing the same way like we did with steps earlier.

| README future concern | Decision | Step |
|---|---|---|
| Grade calculation | Dropped | 7 |
| Grade scale | Dropped | 7 |
| No student selected | A text addition instead of detection | 7 |
| Notifying Moodle's form of applied values | Do it | 8 |
| Matching students and submissions | User docs; downloading isn't the app's job | 8 |
| WebSocket origin check | Do it | 8 |
| Definition structure validation | Do it, with a sample definition | 9 |
| Panel as a separate window (item 6) | Only the README, with the new requirement | 10 |
| Opening sub-directories is a compile-time setting | A VS Code settings UI; options first | 11 |
| Page ready detection | A manual reload as a failsafe; discussion first | 12 |
| Switching the receiving VS Code window | Analysis and discussion first | 13 |
| Database | Not decided yet; not in the author's breakdown | — |

The author then removed the README's "Future concerns" section altogether, so this plan is now the only place for these items. Each step below keeps the README entry's technical details under "From the README".
> as you moved these things to the plan file, you can remove them from the readme already, you can remove the entire section from readme infact as i dont want such a section in readme anymore.

**Undecided: Database.** From the README: the IndexedDB database (`IndexedDBProvider`: `DB_NAME`, `STORE_NAME`, `DB_VERSION`) has no migrations. When the type of a stored value changes, its repository has to treat an old value as missing until it is stored again, e.g. by reloading the definitions folder. Likely very low priority in a project this simple.

**Order:**
- Steps 7–8 are the blocks with several items.
- Steps 9–10 are single items that need no input from the author.
- Steps 11–13 are single items where the author decides after the solver's input.
- Step 14 tests steps 7–13 in one round, as step 6 did for steps 1–5.

---

## Step 7: Dropped concerns and the "no work" text ✅

> **Done:** solved as planned. The proposed text is in use, and the README entries went away with the whole "Future concerns" section.

**Goal:** remove the two future concerns the author dropped, and replace the "no student selected" idea with a text addition.

**Author's decisions:**
> grade calculation: remove from future concerns. its robust enough with the professor being able to do simple mathematics and logic in their head to understand how them clicking the visual things adds or removes points, and them themselves building the sort of system they want to use, that we cant feasibly make it better without making it annoying and it would be of no benefit. we will just drop this. if in the future it becomes a problem, then it resurfaces anyways, we dont need to keep it logged.

> grade scale: this also isnt a real issue, professor already creates custom definition files for every assignment so they know what grade sum will be so its not a real issue, we will remove this entirely.

> no student selected: combine this with one of the above blocks where there are multiple already, cause this is an easy one. we wont be doing the detection. instead we'll just add a bit of text to the error: "või pole tööd, mida kontrollida."

**Tasks:**
1. **README:** the three entries went away with the whole "Future concerns" section (see the start of Part 2).
2. **Text:** "Moodle element not found" gets the addition. Proposed: "Laiendus ei leidnud Moodle'i lehelt: X (Moodle'i leht võib olla ümber arendatud või pole tööd, mida kontrollida)".

**Functionality changes:**
- **7a. Approved.** The text addition (quote above).

---

## Step 8: Moodle form events, preparing submissions, WebSocket origin check ✅

> **Done:** solved as planned, with the answers below. Details:
> - **Form events:** `MoodlePage.notifyValueChanged()` dispatches bubbling `input` and `change` events. `setGrade()` and `setComment()` call it after setting the value; otherwise they're unchanged.
> - **Name matching:** `isStudentFolder()` requires the whole name. The character after it must not continue a name; letters, digits, `-` and `'` count as name characters.
> - **`docs/user using.md`:** a "Before grading an assignment" section. Its link to the definition files section of `docs/user setup.md` works once step 9 writes that section.
> - **Origin check:**
>   - `CHROME_EXTENSION_ID` and `CHROME_EXTENSION_ORIGIN` are in `shared/config/connection.ts`.
>   - `VsCodeMessageReceiver` closes a connection from any other origin with code 1008, before any message handling is attached, and logs it.
>   - The README's "Releasing" section explains the dependency on the key.
>   - Step 13's VS Code-to-VS Code connection will have to take this check into account.

**Goal:**
- Moodle's form notices the applied grade and comment.
- The user docs say how to prepare the submissions.
- VS Code accepts connections only from the Chrome extension.

**Author's decisions:**
> notifying moodle's form of applied values: explore how is the best and most robust way to make get the input and change events to trigger after updating the texts programmatically. ideally id want to keep my logic and functioning same, but just add one call there to cause the events to happen, after the text has been filled in.

> matching students and submissions: text says to be solved with downloading, however i will drop the download requirement, this application wont deal with downloading itself. because of this, we create new docs file called user using.md. in it a section, short, which mentions that before grading an assignment, the definition file needs to be made and the student submissions need to be downloaded and extracted into a folder from their zip on the local pc. earlier i said that you will add the definition files docs in user setup.md - create a link from the section in user usage i described right now, into the definition files tutorial section in user setup.md.

> websocket origin check: add the check mentioned in the text already, it should be relatively simple i think.

**Tasks:**
1. **Form events:**
   - After `AssignmentGraderPage` sets the grade and the comment, the element dispatches bubbling `input` and `change` events, so Moodle's form scripts treat the values as typed.
   - It's one added call in the page object; the logic stays the same.
   - The step starts by checking which events Moodle's grader actually listens to.
   - *From the README:* `setGrade()` and `setComment()` set the values directly, without the `input` and `change` events that Moodle's form scripts listen to. So Moodle's own change detection, e.g. its check for unsaved changes, may not notice an applied grade and comment.
2. **Preparing submissions:**
   - New file `docs/user using.md` with a short section: before grading an assignment, make its definition file, download the submissions from Moodle, and extract them from the zip into a folder on the computer.
   - The section links to the definition files section of `docs/user setup.md`. That section is written in step 9, so either the link or the section heading is added in step 9.
   - *From the README:* `isStudentFolder()` in the VS Code `student-files-rules.ts` matches the student's folder with `folderName.startsWith(studentName)`, so "Mari Maa" also matches "Mari Maasikas_…" and opens the wrong student's files. The README said this was to be solved together with downloading submissions, which the author has now dropped.
3. **Origin check:**
   - The VS Code server accepts connections only with the origin `chrome-extension://<extension id>`. Others are refused and logged.
   - *From the README:* the server (`VsCodeMessageReceiver`, `ws://127.0.0.1:54321`) accepts connections from anywhere. Any web page can open a WebSocket to localhost and send a `student-submission` message, which closes all editors and terminals in VS Code and opens files.

**Open questions at the start of the step:**
- **Prefix matching:** does the problem stay recorded in this plan as a known issue, or is it dropped? `isStudentFolder()` matches by `startsWith`, so "Mari Maa" also matches "Mari Maasikas".
- **Where VS Code gets the extension ID from:**
  - a constant written once, read from `chrome://extensions`;
  - or computed in VS Code from the manifest's `key`. The key would move to shared config; the ID is the first 32 hex digits of the key's SHA-256, written with the letters a–p.

**Answers:**
- **Prefix matching:** fix it.
  > name matching: just implement it as a match that after the students name some sort of character should come, like space or underscore or whatever. [...] so just add thing that makes sure its the full name.
- **The extension ID:**
  > option b but what does it mean to compute it? can we use some actual real thing meant for it or is this going to be sort of hackfixy? i cant be the only person who needs to verify that its the right extension sending the message so here id like it to be solved very conventionally. if were going to hackfix something then id rather not do it at all.

  The solver's answer:
  - Checking the `Origin` header is the conventional mechanism: Chrome itself sets it to `chrome-extension://<id>` for the extension's WebSocket, and a web page can't fake it.
  - Computing the ID (b) would reimplement Chrome's internal derivation of the ID from the key. That works, but it isn't an official API.
  - The conventional way is a constant (a). Chrome's native messaging does exactly that: its host manifest lists `allowed_origins` with the extension's ID written out.
  - So the recommendation changed to (a), pending the author's confirmation and the ID.

  The author's follow-up:
  > if im gonna have other users use this extension, then are they gonna have a different id? if i make a new version, is the extension id gonna change? or is this reading from chrome://extensions a legit one time thing that i do legit only now and never again? id is bhbkljcagkcajmgijfnmigphbldhidhm btw

  The answer: the ID comes from the public `key` in the manifest. So it's the same for every user and every version, and changes only if the key changes. Reading it was a one-time thing. Solved with (a): `CHROME_EXTENSION_ID` in `shared/config/connection.ts`.

**Functionality changes:**
- **8a. Approved.** The events after applying.
- **8b. Approved.** The origin check.
- **8c. Approved.** A student's folder must start with the whole name (quote above).

---

## Step 9: Definition validation and the sample definition

**Goal:** a definition file with a wrong structure is recognised when the definitions are loaded and reported as broken. A sample definition shows everything a definition can contain.

**Author's decisions:**
> definition structure validation: explore the repository to see how easy or hard would it be to implement a validator with clear rules. i think validator only needs to exist at one point: loading the definition files. it can then immediately alert if the definitions are wrongly made. this definition validation logic will dually serve as documentation on what is possible to put inside of a validator, so i want to implement it in two parts: first is the code, second is a dummy json file which has every possible field of the structure in it. things in array only need one entry, as the fact its in an array points to the possibility that there could be multiple of it anyways. all text fields are marked with an "example" text as its value, while all boolean fields are marked with true as their value. all optional text fields are marked with "" as their value while all optional boolean fields are marked with false as their value. the code part reference-checks the loaded definition file against this demo json and if it has wrong value type or wrong fields that arent allowed by the demo, forbids them. this file will live inside src, however in docs under user setup.md you will add a section, "create your definition files" and you will add a link to the file in "src/definitions", explaining that its the sample and how its to be interpreted. file name will be sample-definition.json.

**Tasks:**
1. **The sample:** `src/definitions/sample-definition.json` with every possible field.
   - Arrays have one entry.
   - Required texts are "example", required booleans `true`.
   - Optional texts are "", optional booleans `false`.
2. **The validator:**
   - When the definitions are loaded, each one is checked against the sample.
   - A field the sample doesn't have, or a value of the wrong type, makes the file broken: it's skipped and named in the status line, like a file with a JSON error today.
   - It runs in one place, where the definition files are read as JSON.
3. **User docs:**
   - `docs/user setup.md` gets a section "create your definition files" that links to the sample and explains how to read it.
   - The link from `docs/user using.md` (step 8) points there.
4. *From the README:*
   - Only the JSON syntax of a definition file is checked. A file with valid JSON but the wrong structure, e.g. without `moodleIds`, isn't reported as broken and can break the popup's list and the lookup of every assignment.
   - To avoid defining the structure twice, it should ideally be declared once and everything else derived from it: the `Assignment` type and the check.
   - Every file in the definitions folder is read, so files that aren't definitions at all, e.g. a `README.md`, are reported as broken too.

**Open questions at the start of the step:**
- **Numbers:** `intended_max_points` (required) and `points` (optional) are numbers, but the sample's rules only cover texts and booleans. Which values do numbers get in the sample?
- **`null`:** existing definitions use `null` for an empty text (`"enabledText": null`). Is `null` allowed?
- **Missing fields:** must every required field be present? Can an optional one be left out?
- **`moodleIds` as numbers:** they work today, because ids are compared as strings. The sample says strings.
- **Two declarations:** the TypeScript types (`Assignment`, `Feedback`, `FeedbackPart`) remain a second declaration of the same structure.

**Answers:**
> numbers: agree
> null: the ones which currently use null could have those removed altogether. they explicitly wrote null cause the files needed to carry the info on what is possible, but now this sample file will contain the info whats possible so you can update those definitions and remove null. regarding moodleids as numbers: we could convert into numbers instead of text tbh, cause to my knowledge moodleids cant be text ever. this adds some conversion into where its compared but this makes it better.
> and saying whats wrong: yeah thats good enough how you mentioned it

- Numbers: 1 for a required number, 0 for an optional one.
- `null` isn't allowed; the repo's definitions no longer use it.
- `moodleIds` are numbers. The ID from the page's URL is converted where it's compared.
- The status line names the first problem of each broken file, and the log lists all of them.
- Missing fields weren't asked about separately; they follow the sample's rule: a required field must be present, an optional one may be missing.

**Functionality changes:**
- **9a. Approved.** Wrongly built definitions are reported as broken and skipped (author's request).
- **9b. Approved.** `moodleIds` are numbers; text IDs are reported as broken (quote above).

---

## Step 10: The separate panel window ✅

> **Done:** it was meant to update the README entry, but the author then removed the README's "Future concerns" section. So this step holds the idea instead, and item 6 is done with it.

**Author's decision:**
> panel as a separate window: this one we will not do right now, this is step 6 in your terms. i realise that it needs a toggle option: you can choose if you want it as separate window, or integrated like it is right now. this is complex functionality. so instead just update the readme with my new requirement, with info from step 6 if needed so that this readme section becomes the sole owner of this idea, and then consider your step 6 done.

("Step 6 in your terms" means item 6 of this plan.)

**The idea**, the only place where it is recorded:
- **Today:** the panel is injected into Moodle's grading page, because it relies on page functions being visible to the lecturer. It squeezes Moodle's own panels and ties the extension's layout to Moodle's.
- **The author's requirement:** a toggle lets the lecturer choose whether the panel is a separate window or integrated as it is now.
- **What it needs:** a new system for controlling such a window, moving the injected UI into it, and communication between the window and the Moodle page. It's a large change, done separately and only when the author decides.
- **Item 6 in the author's original words:**
  > layout as a separate popup control panel. this is a massive undertaking as it involves insane refactors so id like to do it completely separately only when i say its time. it needs implementing a new system for controlling such a popup potentially, and transferring the injection into this, and implementing communication between them.
- **Until then, two layout issues stay tied to the injection:**
  - the panel's `left: 40%` depends on the two `20%` Moodle panel widths;
  - Moodle selectors are repeated in `assign-grader.css` (`div[data-region="grade-panel"]`, `div.comment-area div.db textarea`), separately from the page objects.

**Functionality changes:** none.

---

## Step 11: VS Code settings (opening sub-directories)

**Goal:** the VS Code extension gets a place for its settings, like the Chrome popup. Opening sub-directories becomes a true/false setting there.

**Author's decision:**
> opening sub-directories is a compile-time setting: the vscode extension needs a panel similar to the chrome popup, where the extension settings could be toggled. sub-directories open becomes a true-false toggle in this settings popup. im not sure if vscode would allow such a separate panel, so when were at this step tell me what the standard ways in vscode are for enabling plugins such functionality, their drawbacks and good sides, suitability into my situation, and i will decide from there.

**How:**
1. The solver presents VS Code's standard ways for an extension's settings, with their strengths, drawbacks and fit for this project.
2. The author decides.
3. Then `OPEN_SUB_DIRECTORIES` becomes the setting.

*From the README:* `OPEN_SUB_DIRECTORIES` in the VS Code `config.ts` (used by `shouldCollectSubFolders()`) is hard-coded to `true`. So files are always collected recursively, the `false` branch (top-level files only) never runs, and changing it requires rebuilding. `MAX_AUTO_OPENED_FILES` and `BLACKLISTED_FOLDER_NAMES` could become settings too.

---

## Step 12: Manual panel reload

**Goal:** if the panel never appears, the lecturer can load it manually from the popup. The page-ready detection itself stays as it is.

**Author's decision:**
> page ready detection: this is actually robust enough right now and lets not change the detection itself, however lets add a failsafe: manual opening. in the case it never opens, the user should be able to cause it to open manually. we already have a link between popup and main panel thanks to previously implemented definitions update, lets use it or do something similar: we will have a manual button "lae sisupaneel uuesti" which will basically manually toggle the panel. this is more involved than it sounds, cause right now the mutationobserver is deeply tied to the loading of the panel, i think at least. so wed need to separate them a bit more from each other. but actually when we get to this step, you remind and explain to me how you currently implemented the automatic refresh when definitions are loaded, cause thats a similar functionality and we should ensure both of them share a mutual well-defined robust way of approaching this same goal.

**How:**
1. The solver explains how the automatic panel update after reloading definitions works (step 6, finding 5) and proposes one common approach for both.
2. The author decides.
3. Then the popup gets the button "Lae sisupaneel uuesti", and loading the panel is separated further from the page-ready detection.

*From the README:* `executeOnPageReady` runs the callback only after at least one DOM mutation followed by 1.2 s of silence. If the page is already quiet when the content script starts, or never gets quiet (e.g. a timer), the callback never runs. The URL polling interval runs forever, and every navigation creates a new `MutationObserver`. So far it has always worked.

---

## Step 13: Switching the receiving VS Code window

**Goal:** the VS Code window that doesn't receive students can take the reception over.

*From the README:*
- **The problem:** every VS Code window starts the extension, but only the first one gets the port and receives the students. The others show "port in use", and the only way to move the reception is to close the windows and open VS Code again in the right folder. The window without the port could offer a status bar button "switch to this window", after which the two windows swap.
- **The proposed mechanism:** VS Code has no API for windows to talk to each other, but they can talk over the port they compete for.
  1. The window without the port connects to the receiving window as a WebSocket client and asks it to hand over.
  2. The receiving window closes its server.
  3. The asking window starts its own, retrying until the port is free.
  4. Chrome reconnects on the next student.
- **What it needs:** a WebSocket client in the VS Code extension next to the server, a new message channel and a status bar command, built along the existing message system.

**Author's decision:**
> switching the receiving vs code window: communicating through the competing port is perhaps the best way to approach this. this maybe means creation of some additional controller and client for the vscode to vscode talking. maybe this also needs some additional service-layer tier piping. the way i want to do this is you analyse code and figure out what changes need to be done, then you present them to me together with questions if you have them, we discuss it and then you work.

**How:**
1. The solver analyses the code and presents the changes needed, with questions.
2. The author and the solver discuss them.
3. Then the solver implements it.

---

## Step 14: Testing

**Goal:** test everything steps 7–13 changed, once and as a whole, then fix what the test finds. This works like step 6: the author reports findings, and nothing is fixed until the author says the testing is finished.

---

## Appendix A: points for the end-user guide

This is what the project declares after step 5, collected for the author's guide. Nothing here is invented. Fixes in step 6 may change some of it.

**Installing (after step 1):**
- **Chrome:** unzip the zip, open `chrome://extensions`, turn on Developer mode, then Load unpacked.
- **VS Code:** in the Extensions view open the "…" menu and choose Install from VSIX.

**Requirements:**
- The Chrome extension works on its own. The VS Code extension is an optional companion that opens the student's files ([README](../src/google-chrome-extension/README.md)).
- It only runs on `https://moodle.taltech.ee`, on three kinds of page: the assignment grader, quiz review and quiz comment pages ([manifest.config.ts](../src/google-chrome-extension/manifest.config.ts), [config.ts](../src/google-chrome-extension/src/config.ts)).
- VS Code 1.90 or newer is required ([package.json](../src/visual-studio-code-extension/package.json)).
- The extensions talk over `ws://127.0.0.1:54321`, so that port must be free ([connection.ts](../src/shared/config/connection.ts)).

**Popup and definitions folder:**
- The popup opens with the hint "Abipaneel ilmub Moodle'is ülesande hindamislehele. Selleks vali siin kõigepealt definitsioonide kaust."
- "Vali definitsioonide kaust" opens a folder picker with read-only access. The popup then shows the folder name, or "Kaust valimata" ([FolderAccessService.ts](../src/google-chrome-extension/src/popup/service/FolderAccessService.ts)).
- Definitions load as soon as a folder is chosen.
- "Lae failidest uuesti" reads the files again. The popup then shows the time of the last load, or "Definitsioonid puuduvad" ([PopupRenderer.ts](../src/google-chrome-extension/src/popup/renderer/PopupRenderer.ts)). The hint under the button: "Pärast definitsioonifailide muutmist on vaja käsitsi vajutada värskendamise nuppu. Avatud hindamislehtedel võetakse muudatused kohe kasutusele."
- When reloading, Chrome may ask for permission to read the folder. If the lecturer refuses, nothing loads.
- The whole folder is read, including subfolders. Files that aren't valid JSON are skipped and named in the status line as broken. This includes files that aren't definitions at all, e.g. a `README.md`.
- The extension keeps a stored copy of the definitions:
  - editing a file has no effect until the lecturer reloads in the popup;
  - after a reload, open grading pages update their panel right away. The selections and the "Kommentaari algus" text are kept, except for parts that were removed or whose texts changed.
- The popup lists definitions as "course code - name (ids)", grouped by course code. It shows "?" when there's no course code and "Definitsioone ei leitud. Vali kaust või vajuta värskenda nuppu." when there are none ([DefinitionListRenderer.ts](../src/google-chrome-extension/src/popup/renderer/DefinitionListRenderer.ts)).
- The status line at the bottom shows:
  - the VS Code connection;
  - the folder state: folder not chosen / not loaded / how many definitions are loaded / no permission to read the folder;
  - the names of broken files.

**Definition file format** ([Assignment.ts](../src/google-chrome-extension/src/shared/types/Assignment.ts), [Feedback.ts](../src/google-chrome-extension/src/shared/types/Feedback.ts), [FeedbackPart.ts](../src/google-chrome-extension/src/shared/types/FeedbackPart.ts)):
- `name` is shown in the popup.
- The structure is shown by `src/definitions/sample-definition.json`, and every file is checked against it when loaded. `docs/user setup.md` explains how to read it.
- `moodleIds` is a list of numbers, each compared with the `id` in the grader page's URL. One definition can serve several assignments. If two definitions share an ID, the first one found is used.
- `course_code` is optional and only used for grouping in the popup.
- `feedback` is a list of groups. Each group has `title`, `intended_max_points` (shown as "(Xp)" next to the title, not used in the grade) and `parts`.
- Each part has:
  - `enabled`: whether it's on when a student page opens;
  - `points`: added when the part is on, can be negative, 0 if missing;
  - `enabledText`: the comment line when the part is on;
  - `disabledText`: the comment line when it's off;
  - `labelText`: shown only in the panel, never in the comment.

  Empty or missing texts add no line. `null` isn't allowed.
- The grade is the sum of the points of the parts that are on, and never below 0 ([grading-rules.ts](../src/google-chrome-extension/src/content-script/rules/grading-rules.ts)).
- The comment is the "Kommentaari algus" text first, then each part's line in file order, one per line.

**Grader panel:**
- The panel appears on the assignment's grader page. Moodle's review panel and grade panel are squeezed to 20% width each ([assign-grader.css](../src/google-chrome-extension/src/content-script/assign-grader.css)).
- It's rebuilt for every student, about 1.2 s after the page stops changing. Selections and "Kommentaari algus" start over for each student.
- Clicking anywhere in a part's box toggles it. The thumbs-up shows the state: glowing means on, grey means off. Everything clickable glows when the mouse is over it.
- A part's box shows its panel-only text, then "Kommentaar valituna: …" and "Kommentaar valimata: …", and its points.
- Text written into "Kommentaari algus" goes at the beginning of the comment (the box's placeholder says so).
- Moodle's comment section is expanded when the page opens. Nothing is written into Moodle's fields until the lecturer applies.
- The strip at the bottom is always visible:
  - It shows the grade and the comment, read-only, as they're generated.
  - The button "Rakenda Moodle'isse" writes them into Moodle's grade field and comment box.
  - The state next to the button: "Rakenda muudatused Moodle'isse" before applying, "Rakendatud. Salvesta Moodle'i nupuga." after it, and again "Rakenda muudatused Moodle'isse" after any change.
  - The hint below the button: "Rakendamine asendab Moodle'i hinde ja kommentaari. Kirjuta soovi korral oma tekst „Kommentaari algus“ lahtrisse."
  - Moodle's save button saves both the grade and the comment.
- The status line under the strip shows:
  - the VS Code connection: waiting ("ootel") / reconnecting / connected, or "puudub" when connecting failed. The connection closes about 30 s after the last student and then shows "ootel", which is normal.
  - VS Code's answer for the student: files opened / nothing opened / student's folder not found / no folder open in VS Code / VS Code not open or the extension not installed / no answer;
  - the definition: found ("name") / no definition for this assignment / folder not chosen / not loaded. The last three end with "Ülesande MoodleID on: <id>", the ID to add to a definition's `moodleIds`;
  - the names of broken definition files;
  - Moodle page elements the extension didn't find.
- When no definition matches, the panel says what to do: choose and load the folder in the popup, or add the assignment's ID (shown in the status line) to a definition's `moodleIds`.
- Dragging the left edge resizes the panel (a 10 px strip that glows on hover; minimum width 200 px). A hint under the title says so.
- The panel switches to two columns when it's at least 1000 px wide.

**VS Code:**
- The extension starts in every VS Code window. Its logs are in the Output panel under "Moodle Assignment Checking Helper", with an "activated" line on start ([extension.ts](../src/visual-studio-code-extension/src/extension.ts)).
- Its status bar item, "Moodle Helper", shows the same as Chrome's status line:
  - the connection: waiting ("ootel") / connected, or that the port is taken because another VS Code window receives the students;
  - the latest student's result.

  When there's a problem, the item gets a warning background. Clicking it opens the Output log.
- Expected setup: submissions downloaded from Moodle all at once into separate folders, and that folder opened in VS Code ([README](../src/visual-studio-code-extension/README.md)). Only the top level of the first workspace folder is searched.
- When a student's grader page opens, it first closes all terminals and all editors and collapses the explorer. Only then does it look for the student's folder ([StudentSubmissionService.ts](../src/visual-studio-code-extension/src/service/StudentSubmissionService.ts)).
- A folder matches if its name starts with the student's name as Moodle shows it ([student-files-rules.ts](../src/visual-studio-code-extension/src/rules/student-files-rules.ts)).
- It opens at most 20 files ([config.ts](../src/visual-studio-code-extension/src/config.ts)):
  - subfolders are included except `.idea` and `.venv`;
  - files alternate between two editor columns;
  - images and PDFs open as previews.
- When no folder is open, or a student's folder isn't found, VS Code also shows a warning explaining what's expected.
- Right-clicking a `.py` file gives "Käivita Pythoni skript uues terminalis". It opens a terminal called "Pythoni käivitaja" in the file's folder and runs `python "file"`.
- **Item 7:** every VS Code window starts the extension, but there is only one port. Only the window that started first receives students, and that is the window whose editors and terminals get closed. The other windows' status bar says the port is taken. This follows from the code: `activationEvents` and the fixed port.

**Quiz:**
- On the quiz review page, every manually graded question in the "complete" state gets an "Anna maksimumpunktid ilma kommentaarita (salvestab kohe)" button ([QuizPage.ts](../src/google-chrome-extension/src/content-script/pagemanager/QuizPage.ts)).
- Clicking it opens the question's comment page, which fills in the maximum mark and saves on its own ([QuizCommentPresenter.ts](../src/google-chrome-extension/src/content-script/presenter/QuizCommentPresenter.ts)).

**Troubleshooting** ([README](../README.md), "Reporting"):
- First look at the status lines: the panel's, the popup's, and the VS Code status bar.
- Every log line starts with `[Moodle Helper]`.
- In Chrome, panel logs are in the Moodle page's console. Definition and VS Code connection logs are in the service worker's DevTools.
- In VS Code, logs are in the Output channel.
