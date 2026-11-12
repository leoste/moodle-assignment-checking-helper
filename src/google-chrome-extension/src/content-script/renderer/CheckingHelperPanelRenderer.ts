import type { FeedbackView } from '../../shared/types/FeedbackView';
import { FeedbackSectionRenderer, type FeedbackSectionCallbacks } from './FeedbackSectionRenderer';
import { ApplySectionRenderer, type ApplySectionCallbacks } from './ApplySectionRenderer';
import { createAndAddChildElement, createElementWithClasses } from '@shared/util/element-creation-helper';
import BaseRenderer from '@shared/renderer/BaseRenderer';
import StatusLineRenderer from '@shared/renderer/StatusLineRenderer';

const RESIZE_EDGE_WIDTH = 10
const MIN_PANEL_WIDTH = 200
const RESIZE_EDGE_HOVER_CLASS = 'checking-helper-resize-edge-hover'

export interface CheckingHelperPanelCallbacks extends FeedbackSectionCallbacks, ApplySectionCallbacks {
  onResized: (left: number) => void
}

export default class CheckingHelperPanelRenderer extends BaseRenderer {
  readonly #callbacks: CheckingHelperPanelCallbacks

  #applyArea: HTMLElement | undefined
  #feedbackSectionRenderer: FeedbackSectionRenderer | undefined
  #applySectionRenderer: ApplySectionRenderer | undefined
  #statusLineRenderer: StatusLineRenderer | undefined

  constructor(callbacks: CheckingHelperPanelCallbacks) {
    super()
    this.#callbacks = callbacks
  }

  protected createRoot(): HTMLElement {
    return createElementWithClasses('div', ['checking-helper-panel'])
  }

  protected async renderContent(root: HTMLElement) {
    this.#addResizing(root)
    const scrollArea = createAndAddChildElement(root, 'div', 'checking-helper-scroll-area')
    const bottomStrip = createAndAddChildElement(root, 'div', 'checking-helper-bottom-strip')
    this.#applyArea = createAndAddChildElement(bottomStrip, 'div')

    this.#statusLineRenderer = new StatusLineRenderer(bottomStrip)
    await this.#statusLineRenderer.render()
    this.#feedbackSectionRenderer = new FeedbackSectionRenderer(scrollArea, this.#callbacks)
    await this.#feedbackSectionRenderer.render()
  }

  get statusLine(): StatusLineRenderer {
    return this.#statusLineRenderer!
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
        const onEdge = getEdgeDistance(event) <= RESIZE_EDGE_WIDTH
        root.style.cursor = onEdge ? 'ew-resize' : ''
        root.classList.toggle(RESIZE_EDGE_HOVER_CLASS, onEdge)
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

    root.addEventListener('pointerleave', () => {
      if (grabOffset === null) root.classList.remove(RESIZE_EDGE_HOVER_CLASS)
    })
  }

  async renderFeedback(feedback: FeedbackView[], commentPrefix: string) {
    await this.#feedbackSectionRenderer!.renderFeedback(feedback, commentPrefix)
  }

  async renderGradingElsewhere() {
    await this.#feedbackSectionRenderer!.renderGradingElsewhere()
  }

  async renderApplySection() {
    await this.clearApplySection()
    this.#applySectionRenderer = new ApplySectionRenderer(this.#applyArea!, this.#callbacks)
    await this.#applySectionRenderer.render()
  }

  async clearApplySection() {
    await this.#applySectionRenderer?.clear()
    this.#applySectionRenderer = undefined
  }

  setPreview(grade: number, comment: string): void {
    this.#applySectionRenderer?.setPreview(grade, comment)
  }
}
