# Installing

1. Choose suitable release from releases folder;
2. Install the vsix file in your visual studio code. In "Extensions" tab, from three dots menu choose "install from VSIX";
3. Unpack the zip file in a suitable place on your computer and install this as "unpacked" extension in google chrome.

# Create your definition files

Every assignment you grade needs a definition file: a JSON file in your definitions folder, which you choose in the extension's popup. What a definition file can contain is shown by the sample definition, [sample-definition.json](../src/definitions/sample-definition.json). When the definitions are loaded, every file is checked against it. A file that doesn't match is skipped, and the status line names it together with its first problem.

How to read the sample:
- It contains every field a definition can have. Fields that aren't in it aren't allowed.
- A field's value in the sample shows its type and whether it's required:
  - `"example"` is required text, `""` is optional text;
  - `true` is a required true/false, `false` is an optional true/false;
  - `1` is a required number, `0` is an optional number.
- Optional fields can be left out. `null` isn't allowed.
- A list (`[...]`) has one entry in the sample, but a definition can have any number of entries, each built like the sample's one.
- `moodleIds` lists the Moodle IDs of the assignments the definition is for. When no definition is found for an assignment, the status line shows its ID.