
let requestIdCounter = 0

export class PromiseWorker {
  constructor(workerFactory) {
    this._worker = workerFactory()
    this._pending = new Map()

    this._worker.onmessage = (event) => this._handleMessage(event)
    this._worker.onerror = (error) => this._handleFatalError(error)
  }

  _handleMessage(event) {
    const { id, result, error } = event.data
    const pending = this._pending.get(id)
    if (!pending) return

    this._pending.delete(id)
    if (error) {
      pending.reject(new Error(error))
    } else {
      pending.resolve(result)
    }
  }

  _handleFatalError(error) {
    for (const pending of this._pending.values()) {
      pending.reject(error)
    }
    this._pending.clear()
  }

  run(type, payload, transfer = []) {
    const id = ++requestIdCounter

    return new Promise((resolve, reject) => {
      this._pending.set(id, { resolve, reject })
      this._worker.postMessage({ id, type, payload }, transfer)
    })
  }

  get pendingCount() {
    return this._pending.size
  }

  terminate() {
    this._worker.terminate()
    this._pending.clear()
  }
}