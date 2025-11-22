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