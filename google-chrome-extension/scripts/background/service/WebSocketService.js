export default class WebSocketService {

  #webSocketProvider = new WebSocketProvider()
  #requests = new Map()

  async post(channelName, messageContent) {
    const ws = await this.#webSocketProvider.getSocket()
    const payload = { channelName, messageContent }
    ws.send(JSON.stringify(payload))
  }

  
}

class WebSocketProvider {

  #socket = null
  #address = "ws://localhost:54321"

  getSocket() {
    return new Promise(this.#promiseClosure)
  }

  #promiseClosure = (resolve, reject) => {
    if (!this.#socket || this.#socket.readyState === WebSocket.CLOSED || this.#socket.readyState === WebSocket.CLOSING) {
      this.#socket = new WebSocket(this.#address)
    }

    if (this.#socket.readyState === WebSocket.OPEN) {
      resolve(this.#socket)
      return
    }

    const onOpen = () => {
      cleanup()
      resolve(this.#socket)
    }

    const onError = (error) => {
      cleanup()
      reject(error)
    }

    const cleanup = () => {
      this.#socket.removeEventListener('open', onOpen)
      this.#socket.removeEventListener('error', onError)
    }

    this.#socket.addEventListener('open', onOpen)
    this.#socket.addEventListener('error', onError)
  }
}