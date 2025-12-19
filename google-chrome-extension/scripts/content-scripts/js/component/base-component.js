// TODO: merge ClickableList and ClickableListManager

class ClickableList {
  
  #parentElement
  #contentCreated = false
  properties
  items
  onClickCallback

  setParentElement(parentElement) {
    this.#parentElement = parentElement
  }

  createContent() {
    if (this.#contentCreated) return

    const manager = new ClickableListManager()
    manager.setParameters(
      this.onClickCallback,
      this.items,
      this.properties)
    const clickableList = manager.create()
    this.#parentElement.appendChild(clickableList)

    this.#contentCreated = true
  }
}

class ClickableListManager {
  
  #states
  #list
  #onClickCallback
  #properties

  setParameters(onClickCallback, items, properties) {
    this.#onClickCallback = onClickCallback
    this.#states = items
    this.#properties = properties
  }
  
  create() {
    const section = createElementWithClasses("div", [this.#properties.sectionDivClass])  
    createAndAddChildElement(section, "h3", null, this.#properties.sectionTitle)
    this.#list = createAndAddChildElement(section, "ul", this.#properties.listItemClass)  
    this.#states.forEach(this.#createItem)
    this.#ItemUpdatedCallback()
    return section
  }

  destroy() {
    // TODO: implement
  }

  #createItem = (item) => {
    const manager = new ClickableListItemManager()
    manager.setParameters(this.#list, item)
    manager.setItemUpdatedCallback(this.#ItemUpdatedCallback)
    manager.createItem()
  }

  #ItemUpdatedCallback = () => {
    this.#onClickCallback(this.#states)
  }
}

class ClickableListItemManager {

  #list
  #listItem
  #listItemUpdatedCallback

  #addButton
  #buttonsSection
  
  setParameters(list, item) {
    this.#list = list
    this.#listItem = item
  }

  setItemUpdatedCallback(callback) {
    this.#listItemUpdatedCallback = callback
  }

  createItem() {
    const item = createAndAddChildElement(this.#list, "li", "clickable-list-item")
    const container = createAndAddChildElement(item, "div", "item-container")
    createAndAddChildElement(container, "div", "text-section", this.#listItem.text)
    this.#buttonsSection = createAndAddChildElement(container, "div", "buttons-section")
    this.createAddButton()
  }

  createAddButton() {
    const classList = ["add-button"]
    const extraClass = this.#listItem.enabled ? "active" : "inactive"
    classList.push(extraClass)
    this.#addButton = createAndAddChildImage(this.#buttonsSection, "images/laughing-pointing-emoji.png", classList)
    this.#addButton.addEventListener('click', this.#addButtonOnClick)
  }
  
  #addButtonOnClick = () => {
    this.#toggleItem()
  }

  #toggleItem() {
    const newState = !this.#listItem.enabled
    this.#listItem.enabled = newState
    this.#addButton.classList.toggle('active', newState)
    this.#addButton.classList.toggle('inactive', !newState)
    this.#listItemUpdatedCallback()
  }
}