export default class WebSocketProvider {

  #socket = null
  #address = "ws://127.0.0.1:54321"

  onMessage = (rawString) => {}
  onDisconnect = () => {}

  async send(rawString) {
    const socket = await this.#getSocket()
    socket.send(rawString)
  }

  #getSocket() {
    return new Promise((resolve, reject) => {
      if (this.#socket?.readyState === WebSocket.OPEN) {
        resolve(this.#socket)
        return
      }

      if (this.#socket?.readyState === WebSocket.CONNECTING) {
        this.#socket.addEventListener('open', () => {
          resolve(this.#socket)
        }, { 
          once: true
        })
        return
      }

      this.#connect(resolve, reject)
    })
  }

  #connect(resolve, reject) {
    this.#socket = new WebSocket(this.#address)

    this.#socket.onopen = () => {
      resolve(this.#socket)
    }

    this.#socket.onmessage = async (event) => {
      this.onMessage(event.data)
    }

    this.#socket.onclose = () => {
      this.onDisconnect()
    }

    this.#socket.onerror = (error) => {
      reject(error)
    }
  }
}