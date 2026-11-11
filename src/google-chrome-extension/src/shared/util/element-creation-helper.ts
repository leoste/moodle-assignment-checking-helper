import { createAndAddChildElement } from '@shared/util/element-creation-helper'

// Chrome only, because the image is one of the extension's own files.
export function createAndAddChildImage(
  parent: HTMLElement,
  src: string,
  classes: string | string[] | null = null
): HTMLImageElement {
  const img = createAndAddChildElement(parent, 'img', classes) as HTMLImageElement
  img.src = chrome.runtime.getURL(src)
  return img
}
