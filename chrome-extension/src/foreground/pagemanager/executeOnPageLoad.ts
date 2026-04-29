export default function executeOnPageLoad(callback: () => void): void {
  const observer = new PageUpdateObserver()
  observer.addCallback(callback)
}

class PageUpdateObserver {

  #timeoutDuration = 1200
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
      }, this.#timeoutDuration)
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
    }, 100)
  }
}