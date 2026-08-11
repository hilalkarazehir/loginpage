// Ham bir Worker'ı Promise tabanlı bir API'ye çeviren wrapper.
// Her istek benzersiz bir id ile gönderilir; worker aynı id ile cevap verdiğinde
// ilgili Promise resolve/reject edilir. Böylece worker ile haberleşme,
// postMessage/onmessage yerine normal async/await ile yönetilebilir.
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

  // Worker'ın kendisi çökerse (syntax hatası, yakalanmamış exception vs.)
  // bekleyen tüm isteklerin askıda kalmaması için hepsini reddet.
  _handleFatalError(error) {
    for (const pending of this._pending.values()) {
      pending.reject(error)
    }
    this._pending.clear()
  }

  // type + payload'ı worker'a gönderir, cevabı bir Promise olarak döner.
  run(type, payload, transfer = []) {
    const id = ++requestIdCounter

    return new Promise((resolve, reject) => {
      this._pending.set(id, { resolve, reject })
      this._worker.postMessage({ id, type, payload }, transfer)
    })
  }

  // Şu an bu worker'da bekleyen (cevaplanmamış) istek sayısı.
  // WorkerPool bunu "en boş worker'ı seç" zamanlaması için kullanır.
  get pendingCount() {
    return this._pending.size
  }

  terminate() {
    this._worker.terminate()
    this._pending.clear()
  }
}