import { WEBSOCKET_URL } from '@shared/config/connection'

export default class WebSocketConnection {
  readonly #address = WEBSOCKET_URL
  #socket: WebSocket | null = null

  onConnecting: () => void = () => {}
  onConnect: () => void = () => {}
  onMessage: (rawString: string) => void = () => {}
  onDisconnect: () => void = () => {}

  async send(rawString: string): Promise<void> {
    const socket = await this.#getSocket()
    socket.send(rawString)
  }

  #getSocket(): Promise<WebSocket> {
    return new Promise((resolve, reject) => {
      if (this.#socket?.readyState === WebSocket.OPEN) {
        resolve(this.#socket)
        return
      }

      if (this.#socket?.readyState === WebSocket.CONNECTING) {
        this.#socket.addEventListener('open', () => resolve(this.#socket!), { once: true })
        return
      }

      this.#connect(resolve, reject)
    })
  }

  #connect(resolve: (s: WebSocket) => void, reject: (e: unknown) => void): void {
    this.onConnecting()
    const socket = new WebSocket(this.#address)
    this.#socket = socket

    socket.onopen = () => {
      this.onConnect()
      resolve(socket)
    }
    socket.onmessage = (event) => this.onMessage(event.data as string)
    socket.onclose = () => this.onDisconnect()
    socket.onerror = (err) => reject(err)
  }
}
