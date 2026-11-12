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
Every assignment you grade needs a definition file: a JSON file in your definitions folder, which you choose in the extension's popup. What a definition file can contain is shown by the sample definition, [sample-definition.json](src/definitions/sample-definition.json). When the definitions are loaded, every file is checked against it. A file that doesn't match is skipped, and the status line names it together with its first problem.

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

1. Make the assignment's definition file (see [Create your definition files](#create-your-definition-files));
2. Download the students' submissions from Moodle;
3. Extract them from the zip into a folder on your computer and open this folder in VSCode.

### While grading

As you load the Grading page, a special panel is injected into Moodle with controls derived from your definitions file.
It's a clickable grading matrix that generates the comment and grade as you click. Optionally you can add custom text.
When you're ready, you press a button to apply these to real Moodle - so far you've only seen a preview.
And finally, to save the grade, you press the "save and next" button as you do with Moodle normally.

On the VS Code side, if you have the submissions folder open, the submissions of current student will open automatically.
With many files, it will be opened in 2 columns. This makes it easier to find and navigate the files.
As you open next student in Moodle, previous submission's files will be closed and new ones opened.

### Everything else you can do

WARNING. AI Text:
```
In Chrome:
- Only one Moodle tab grades at a time. In another tab, the panel says that grading happens elsewhere and offers to take the grading over.
- Text typed into the panel's comment start box goes to the beginning of the comment.
- Drag the panel's left edge to make it wider or narrower.
- If the panel doesn't appear, reload it from the extension's popup.
- After changing definition files, reload them from the popup. An open panel keeps the selections of the parts that didn't change.
- On a quiz attempt's review page, every manually graded question gets a button that gives it full points without a comment and saves at once.

In VS Code:
- Only one VS Code window receives the students. Another window can take that over with its take-over button, in the status bar or in the extension's sidebar.
- At most 20 of the student's files are opened. In the extension's sidebar you can choose whether the files in the student's subfolders are opened too (on by default).
- Right-click a .py file to run it in a new terminal.
- Click the extension's item in the status bar to see its log.

The status line of the panel and of the popup, and VS Code's status bar and sidebar, show what's going on, e.g. whether Chrome and VS Code are connected and whether the student's files were opened.
```