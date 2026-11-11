import queryElement from './queryElement'

const MAIN_REGION_SELECTOR = 'div[role="main"]'

export default abstract class MoodlePage {
  getMainRegion(): HTMLElement {
    return this.query<HTMLElement>(MAIN_REGION_SELECTOR)
  }

  protected query<T extends Element>(selector: string): T {
    return queryElement<T>(this, selector)
  }

  protected getUrlParam(name: string): string {
    return new URLSearchParams(window.location.search).get(name) ?? ''
  }

  protected getDirectTextContent(element: HTMLElement): string {
    const cleanLines = element.textContent
      ?.split('\n')
      .map(line => line.trim())
      .filter(line => line !== '') ?? []

    return cleanLines.length > 0 ? cleanLines[0] : ''
  }
}
