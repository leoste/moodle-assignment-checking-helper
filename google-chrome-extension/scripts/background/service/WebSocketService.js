import WebSocketProvider from "../provider/WebSocketProvider.js"

export default class WebSocketService {

  #provider = new WebSocketProvider()
  #requests = new Map()
  #timeoutDuration = 5000

  constructor() {
    this.#provider.onMessage = (rawMessageString) => this.#handleIncomingMessage(rawMessageString)
    this.#provider.onDisconnect = () => this.#cancelAllRequests()
  }

  async post(channelName, messageContent) {
    return new Promise((resolve, reject) => {
      const id = crypto.randomUUID()
      const timer = this.#startTimer(id, reject)
      this.#requests.set(id, { resolve, reject, timer })

      const payload = JSON.stringify({
        id,
        channel: channelName,
        content: messageContent
      })

      this.#provider.send(payload).catch(error => {
        this.#cleanupRequest(id)
        reject(error)
      })
    })
  }
  
  #handleIncomingMessage(rawMessageString) {
    try {
      const json = JSON.parse(rawMessageString)
      this.#completeRequest(json.id, json.content)      
    } catch (error) {
      this.#failRequest(json.id, "JSON couldn't be parsed")
    }
  }

  #isIdPresentInRequests(id) {
    return id && this.#requests.has(id)
  }

  #completeRequest(id, content) {
    if (!this.#isIdPresentInRequests(id)) return

    const request = this.#requests.get(id)
    clearTimeout(request.timer)
    request.resolve(content)
    this.#requests.delete(id)
  }

  #failRequest(id, error) {
    if (!this.#isIdPresentInRequests(id)) return

    const request = this.#requests.get(id)
    clearTimeout(request.timer)
    request.reject(error)
    this.#requests.delete(id)
  }

  #cancelAllRequests() {
    this.#requests.forEach(request => {
      clearTimeout(request.timer)
      request.reject(new Error("Connection lost"))
    })
    this.#requests.clear()
  }

  #startTimer(id, reject) {
    return setTimeout(() => {
      this.#cleanupRequest(id)
      reject(new Error("Connection timed out"))
    }, this.#timeoutDuration)
  }

  #cleanupRequest(id) {
    if (this.#requests.has(id)) {
      clearTimeout(this.#requests.get(id).timer)
      this.#requests.delete(id)
    }
  }
}
