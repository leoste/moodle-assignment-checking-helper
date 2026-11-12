# Moodle Assignment Checking Helper

TODO: maybe add a docs folder with schemes and images of the structure and the talking between different parts.

The Moodle ASsignment Checking Helper consists of two extensions that interact to significantly speed up assignment checking in Moodle.
Automatically open files and run custom scripts in VSCode, easily compose typical grades and responses in Chrome.

It works only on "Assignment" type tasks in Moodle, but honestly why would you use other types for manual work anyways.

## 1. AI Disclaimer

Every creative concept in this project is completely thought up by me, a human, by myself with zero AI involvement.
The architecture, the UI, the "business requirements", everything, I drew it up on pieces of paper like a normal person.
Besides, an AI couldn't even come up with half the stuff that is implemented in this project.

I 100% hand-wrote every part of code leading up to a functional working prototype until end of 2025.
All of the documentation and translations are hand-written.
Regretfully I must report that since 2026, AI has been used as a code refactoring or generation tool as I really didn't have time. However, architecture is still 100% mine.

## 2. How to use

I tried to keep it pretty intuitive, but there's some things you just have to read to get started. If you're lacking time, then read:
- Install guide
- Creating your definition files guide

### 2.1 Install

To get the system running and operational, you need to install the two extensions in chrome and vscode.
Technically, the system works only on chrome too, but vscode extension adds very useful file preview functionality, greatly superior to Moodle's file viewing system.

And of course for the vscode extension you need to install vscode. If you're not familiar with it don't worry, it's only like a fancy notepad.

Installation guide:
1. Choose suitable release from releases folder and download it in your computer;
2. Install the vsix file in your visual studio code. In "Extensions" tab, from three dots menu choose "install from VSIX";
3. Unpack the chrome zip file in a suitable permanent location on your computer and install this as "unpacked" extension in google chrome. The extension will always be loaded from these files, so make sure it's an undisturbed location.

### 2.2 Creating Definition files for the Grading matrix

The main functionality of this module is clickable grading matrices, which automatically generate the comment and grade.
For this to work you, the person reading this, have to create definition files which define how grading works for your assignments.
Don't worry, it's really easy.

First, look at the sample definition file which defines everything that is possible to write into a definition file. At: [`src/definitions/sample-definition.json`](src/definitions/sample-definition.json)

Some fields are mandatory and some optional. Optional fields you can leave out completely from your file. Legend:
- Mandatory number: 1
- Optional number: 0
- Mandatory text: "example"
- Optional text: ""
- Mandatory true/false value: true
- Optional true/false value: false

The broad idea is that you can create sections and individually clickable grading parts.
- You can specify the text that is added to the student feedback comment for both cases: some condition is met, or isn't met;
- You can also specify how many points each gradable part of the matrix is responsible for;
- You can even specify some parts to be enabled or disabled by default;
- You can provide one or multiple Assignment moodleId's on which this matrix will be active on. The extension will show it to you while looking at an assignment or you can also see it in the moodle URL while looking at an assignment.

For example if whole Assignment consists of 4 tasks, and each task has 3 individual parts, then this is how that definition file might look like:
```json
{
  "name": "Fruit and Color Assignment",
  "moodleIds": [523453492, 3244232],
  "course_code": "FCA2761",
  "feedback": [
    {
      "title": "Task 1",
      "intended_max_points": 25,
      "parts": [
        {
          "labelText": "Apples counted properly",
          "enabledText": "You have counted every apple with the correct technique.",
          "disabledText": "You regretfully didn't count the apples for which I must deduct points.",
          "points": 5,
          "enabled": false
        },
        {
          "labelText": "Pears cooked",
          "points": 10,
          "enabled": true
        },
        {
          "labelText": "Colors created",
          "enabledText": "You invented at least 3 new colors, this is great.",
          "disabledText": "You regretfully didn't invent enough new colors, so I must deduct points.",
          "points": 10,
          "enabled": true
        }
      ]
    },
    {
        "title": "Task 2",
        "intended_max_points": 25,
        ... (repeat for tasks 2, 3, 4)
    },
    {
        "title": "Task 3",
        "intended_max_points": 25,
        ... (repeat for tasks 2, 3, 4)
    },
    {
        "title": "Task 4",
        "intended_max_points": 25,
        ... (repeat for tasks 2, 3, 4)
    }
  ]
}
```

You would create such a file for every assignment you want to grade using this system. As you can see, it's really not too complex.

### 2.3 Daily use

#### Before grading an assignment

1. Make the assignment's definition file (see [Create your definition files](#create-your-definition-files));
2. Download the students' submissions from Moodle;
3. Extract them from the zip into a folder on your computer and open this folder in VSCode.

#### While grading

As you load the Grading page, a special panel is injected into Moodle with controls derived from your definitions file.
It's a clickable grading matrix that generates the comment and grade as you click. Optionally you can add custom text.
When you're ready, you press a button to apply these to real Moodle - so far you've only seen a preview.
And finally, to save the grade, you press the "save and next" button as you do with Moodle normally.

On the VS Code side, if you have the submissions folder open, the submissions of current student will open automatically.
With many files, it will be opened in 2 columns. This makes it easier to find and navigate the files.
As you open next student in Moodle, previous submission's files will be closed and new ones opened.

## 3. For developers

Check the readme in `src`: [`/src/README.md`](/src/README.md)