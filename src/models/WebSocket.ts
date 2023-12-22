export interface APIWebSocket {
  url: string
  readyState: 'CLOSED' | 'CLOSING' | 'CONNECTING' | 'OPEN'
  _token: string
  _shouldConnect: boolean
  _isConnected: boolean
  _ws: WebSocket
  _outQueue: Set<string>
  _reconnectInterval: ReturnType<typeof setInterval> | null
  onmessage?: CallableFunction
  onconnected?: CallableFunction
  onclose?: CallableFunction
}

export class APIWebSocket implements APIWebSocket {
  constructor(url: string) {
    this.url = url
    this._outQueue = new Set()
    this._isConnected = false
    this.connect()
  }

  setToken(token: string) {
    this._token = token
    this.close()
  }

  connect() {
    if (!this._ws || this._ws.readyState !== WebSocket.OPEN) {
      if (this._ws) {
        this._ws.onmessage = null
        this._ws.onopen = null
        this._ws.onclose = null
        this._ws.onerror = null
        this._ws.close()
        this._ws = null
      }
      this._ws = new WebSocket(`${this.url}?token=${this._token}`)
      this._ws.onerror = this.connect.bind(this)
      this._ws.onmessage = ({ data: rawData }) => {
        if (this.onmessage) {
          try {
            this.onmessage(JSON.parse(rawData))
          } catch (e) {
            console.error(e, rawData)
          }
        }
      }
      this._ws.onopen = () => {
        for (const message of this._outQueue) {
          this._ws.send(message)
          this._outQueue.delete(message)
        }
        this._isConnected = true
        if (this.onconnected) {
          this.onconnected()
        }
      }
      this._ws.onclose = () => {
        this._isConnected = false
        if (this.onclose) {
          this.onclose()
        }
      }
    }
  }

  close() {
    this._ws?.close()
  }

  send(data: any) {
    const message = JSON.stringify(data)
    if (this._ws?.readyState === WebSocket.OPEN) {
      this._ws.send(message)
    } else {
      this._outQueue.add(message)
    }
  }
}
