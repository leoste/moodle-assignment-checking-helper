// Minimum practical delay after the last DOM change, after which the page can be expected to be usable.
const MIN_PRACTICAL_PAGE_READY_DELAY_MS = 1200
// Fast, but not spamming, rate for checking whether the URL has changed.
const URL_CHANGE_POLL_INTERVAL_MS = 100

export default function executeOnPageReady(callback: () => void): void {
  const observer = new PageUpdateObserver()
  observer.addCallback(callback)
}

class PageUpdateObserver {

  #lastURL = location.href

  addCallback(callback: () => void): void {
    this.#executeOnPageRefresh(callback)
    this.#executeOnPageNavigation(callback)
  }

  #executeOnPageRefresh(callback: () => void): void {
    let idleTimer: ReturnType<typeof setTimeout>

    const observer = new MutationObserver(() => {
      clearTimeout(idleTimer)
      idleTimer = setTimeout(() => {
        observer.disconnect()
        callback()
      }, MIN_PRACTICAL_PAGE_READY_DELAY_MS)
    })

    observer.observe(document, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true
    })
  }

  #executeOnPageNavigation(callback: () => void): void {
    setInterval(() => {
      if (location.href !== this.#lastURL) {
        this.#lastURL = location.href
        this.#executeOnPageRefresh(callback)
      }
    }, URL_CHANGE_POLL_INTERVAL_MS)
  }
}
