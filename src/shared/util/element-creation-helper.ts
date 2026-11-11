export function createAndAddChildElement(
  parent: HTMLElement,
  childDefinition: string,
  childClasses: string | string[] | null = null,
  textContent: string | null = null
): HTMLElement {
  const child = createElementWithClasses(childDefinition, childClasses)
  parent.appendChild(child)

  if (textContent) {
    child.textContent = textContent
  }

  return child
}

export function createElementWithClasses(
  elementDefinition: string,
  classes: string | string[] | null = null
): HTMLElement {
  const element = document.createElement(elementDefinition)

  if (classes) {
    const classesArray = ([] as string[]).concat(classes)
    if (classesArray.length > 0) {
      element.classList.add(...classesArray)
    }
  }

  return element
}
