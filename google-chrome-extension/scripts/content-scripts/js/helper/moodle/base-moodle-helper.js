function executeOnPageLoad(callback) {
  const observer = new PageUpdateObserver()
  observer.addCallback(callback)
}

class PageUpdateObserver {
  
  #timeoutDuration = 1200
  #lastURL = location.href

  addCallback(callback) {
    this.#executeOnPageRefresh(callback)
    this.#executeOnPageNavigation(callback)
  }

  #executeOnPageRefresh(callback) {
    let idleTimer

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
  
  #executeOnPageNavigation(callback) {
    setInterval(() => {
      if (location.href !== this.#lastURL) {
        this.#lastURL = location.href
        this.#executeOnPageRefresh(callback)
      }
    }, 100)
  }
}

function getMainDiv() {
  return document.querySelector('div[role="main"]')
}