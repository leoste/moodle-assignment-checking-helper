import type { FeedbackView } from '../../shared/types/FeedbackView';
import { FeedbackSectionRenderer, type FeedbackSectionCallbacks } from './FeedbackSectionRenderer';
import { createElementWithClasses } from '../../shared/util/element-creation-helper';
import BaseRenderer from '../../shared/renderer/BaseRenderer';

const RESIZE_EDGE_WIDTH = 10
const MIN_PANEL_WIDTH = 200

export interface CheckingHelperPanelCallbacks extends FeedbackSectionCallbacks {
  onResized: (left: number) => void
}

export default class CheckingHelperPanelRenderer extends BaseRenderer {
  readonly #callbacks: CheckingHelperPanelCallbacks

  #feedbackSectionRenderer: FeedbackSectionRenderer | undefined

  constructor(callbacks: CheckingHelperPanelCallbacks) {
    super()
    this.#callbacks = callbacks
  }

  protected createRoot(): HTMLElement {
    return createElementWithClasses('div', ['checking-helper-panel'])
  }

  protected async renderContent(root: HTMLElement) {
    this.#addResizing(root)
    this.#feedbackSectionRenderer = new FeedbackSectionRenderer(root, this.#callbacks)
    await this.#feedbackSectionRenderer.render()
  }

  #addResizing(root: HTMLElement): void {
    let grabOffset: number | null = null
    const getEdgeDistance = (event: PointerEvent) => event.clientX - root.getBoundingClientRect().left

    root.addEventListener('pointerdown', event => {
      if (getEdgeDistance(event) > RESIZE_EDGE_WIDTH) return
      grabOffset = getEdgeDistance(event) + parseFloat(getComputedStyle(root).marginLeft)
      root.setPointerCapture(event.pointerId)
      event.preventDefault()
    })

    root.addEventListener('pointermove', event => {
      if (grabOffset === null) {
        root.style.cursor = getEdgeDistance(event) <= RESIZE_EDGE_WIDTH ? 'ew-resize' : ''
        return
      }
      const parentRect = root.offsetParent!.getBoundingClientRect()
      const left = Math.min(Math.max(event.clientX - parentRect.left - grabOffset, 0), parentRect.width - MIN_PANEL_WIDTH)
      root.style.left = `${left}px`
      this.#callbacks.onResized(left)
    })

    root.addEventListener('pointerup', event => {
      grabOffset = null
      root.releasePointerCapture(event.pointerId)
    })
  }

  async renderFeedback(feedback: FeedbackView[]) {
    await this.#feedbackSectionRenderer!.renderFeedback(feedback)
  }
}
