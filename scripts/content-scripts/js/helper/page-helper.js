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

function createAndAddChildElement(parent, childDefinition, childClasses = null, textContent = null) {
  const child = createElementWithClasses(childDefinition, childClasses)
  parent.appendChild(child)

  if (textContent) {
    child.textContent = textContent
  }

  return child
}

function createAndAddChildImage(parent, src, classes=null) {
  const img = createAndAddChildElement(parent, "img", classes)
  img.src = chrome.runtime.getURL(src)
  return img
}

function createElementWithClasses(elementDefinition, classes) {
  const element = document.createElement(elementDefinition)

  if (classes) {
    const classesArray = [].concat(classes)
    if (classesArray.length >0) {
      element.classList.add(...classesArray)
    }    
  }
  
  return element
}