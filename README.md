# Moodle Assignment Checking Helper

TODO: maybe add a docs folder with schemes and images of the structure and the talking between different parts.

The Moodle ASsignment Checking Helper consists of two extensions that interact to significantly speed up assignment checking in Moodle.
Automatically open files and run custom scripts in VSCode, easily compose typical grades and responses in Chrome.

# How to use

## Setup

### Installing

1. Choose suitable release from releases folder;
2. Install the vsix file in your visual studio code. In "Extensions" tab, from three dots menu choose "install from VSIX";
3. Unpack the zip file in a suitable place on your computer and install this as "unpacked" extension in google chrome.

### Create your definition files

WARNING. AI Text:
```
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
```

## Using

### Before grading an assignment

1. Make the assignment's definition file (see [Create your definition files](user%20setup.md#create-your-definition-files));
2. Download the students' submissions from Moodle;
3. Extract them from the zip into a folder on your computer and open this folder in VSCode.

### While grading

As you load the Grading page, a special panel is injected into Moodle with controls derived from your definitions file.
It's a clickable grading matrix that generates the comment and grade as you click. Optionally you can add custom text.
When you're ready, you press a button to apply these to real Moodle - so far you've only seen a preview.
And finally, to save the grade, you press the "save and next" button as you do with Moodle normally.

On the VS Code side, if you have the submissions folder open, the submissions of current student will open automatically.
With many files, it will be opened in 2-3 columns. This makes it easier to find and navigate the files.
As you open next student in Moodle, previous submission's files will be closed and new ones opened.