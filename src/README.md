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
This file is used to verify all user-uploaded definition files when they're selected into the program.
All definition files should be with same structure as the sample definition file.

# Broad design choices

It's intentional that only one tab can do moodle stuff and one vscode can do vscode stuff at once, this is enforced by the extensions. They both have pathways to overtake from other window for user comfort.

The yellow-orange-turqoise theme is also intentional. It is designed to maximally differentiate from existing Moodle elements to make it clear to the user they're interacting with the extension, not Moodle itself. At the same time it is simple to use. The mild yellow tone calms the nerves during long grading sessions while the blue keeps you alert.

The user has to download all student submissions onto their local disk themselves, as the moodle functionality works very well and it's a one time operation too, so not submission time would be saved by handling it through the extension anyways while more confusion and complication would be introduced.

# Architecture

See [`/docs/architecture.md`](/docs/architecture.md) for a detailed breakdown.
It's crucial that you follow the architecture precisely when developing.