function executeOnPageLoad(callback) {
  let idleTimer

  const observer = new MutationObserver(() => {
    clearTimeout(idleTimer)
    idleTimer = setTimeout(() => {
      observer.disconnect()
      callback()
    }, 1200)
  })

  observer.observe(document, {
    childList: true,
    subtree: true,
    attributes: true,
    characterData: true
  })
}

function createAndAddChildElement(parent, childDefinition, textContent = null) {
  const child = document.createElement(childDefinition)
  parent.appendChild(child)

  if (textContent) {
    child.textContent = textContent
  }

  return child
}

function createElementWithClasses(elementDefinition, classes) {
  const element = document.createElement(elementDefinition)
  element.classList.add(classes)
  return element
}