# System Architecture

I carefully thought up this concise system architecture over 1 and a half years to arrive at its current form.
This document serves as the highest authority on application architecture, which all implementation must follow.
The architecture, its concepts, the main parts, layers, the way they interact is all completely human-made, by me.
Besides, an AI couldn't even come up with half the stuff that is implemented in this project.

## 1. Main Parts
The user interacts with the main parts, everything below is already technical.
The main parts make use of the various layers described below to accomplish their functionality.

Chrome Extension
- service worker
- content script
- popup

VS Code Extension
- background
- webview

Definition files

Moodle website

## 2. Concepts

There are many concepts used by main parts, which are spread throughout main layers.
Many concepts are implemented as singletons, that is only one instance of them exists in a live program and other components make use of the singleton, rather than re-instanciating their own.
The concepts exist at different levels and interact in different ways, but here is a flat list of all the concepts:
- 🚧infrastructure
- 💘repository
- 💝service
- ❤controller
- ❤client
- 💞pagelistener
- 💞presenter
- 💲rules
- 💞pagemanager
- 💞renderer
- 🚧object
- 🚧util
- 💲types
- 🚧constants
- 💲config
- 💲translations
- ❤announcer
- ❤reporter
- ❤watcher

## 3. Layers

The layers form concepts together into cohesive units that interact with each other, making use of the concepts mentioned above.
The layers are:
- ❤Communication Layer❤
- 💞Presentation Layer💞
- 💝Service layer💝
- 💘Repository layer💘
- 🚧Foundation Layer🚧
- 💲Business Layer💲
Some layers involve many concepts inside them in a specific relationship, others are just single concepts.

### 3.1 💞Presentation Layer💞
Some components need to present info to the user. This also raises the necessity of accessing the page or other mediums.
This is accomplished through following parts:

Listener (presentation/listener):
- Listens to website changes and manages lifecycle of presenter and manager. Creates then applies and connects them together at the appropriate moment.
- owns the presenter and the manager

Manager (presentation/manager):
- Exposes functionality for interacting with the actual moodle page

Presenter (presentation/presenter):
- defines and implements system business logic for interacting with Moodle and definitions
- coordinates renderers to draw additional ui elements
- owns the renderer

Renderer (presentation/renderer):
- renders new ui components and manages their lifecycle

### 3.2 ❤Communication Layer❤
Components communicate with each other in two ways: messages and news.
Basically every major part of the app talks with each other using one or the other.
The communication layer exists to facilitate this communication between parts of the system.

#### Messages

Client sends a message at their own chosen time and expects a response from the controller.
A component can make use of different clients and different controllers to facilitate both asking and answering.
Parts:
- communication/client
- communication/controller

#### News
Announcer broadcasts news of something happening, they don't expect a response.
Reporter picks up news and distributes them.
Watchers see news from their chosen reporters and shows their selection somewhere.
This structure was inspired by how people watch news in real life.
Parts:
- communication/announcer
- communication/reporter
- communication/watcher

### 3.3 💝Service layer💝
service provides functionality to above layers. This can be storage, sending messages or something else.

### 3.4 💘Repository layer💘
repository provides storage functionality, any sort of storage.

### 3.5 🚧Foundation Layer🚧
foundation makes connections to external systems and provides abstract objects that other components use.
these are:
- foundation/infrastructure: provides connection to external systems
- foundation/object: defines custom objects and concepts used throughout the system
- foundation/util: generic helper functions without ties to a certain domain object, used everywhere
- foundation/generator: they generate messages and news for use between clients and controllers
- foundation/constants: common values shared throughout the system

### 3.6 💲Business Layer💲

business is the ultimate source of truth for decisions and structure, it's what everything is built around of.
it includes:
- business/rules: rules for how something works
- business/types: types defining objects, these objects are manipulated in other layers
- business/config: configuration of the application is technically independent of the app, but what is configurable is a decision
- business/translations: some would argue this is presentation, but translations hold key intent on how things are intended to work
- business/styles: looks is everything, so this is business