import { PromiseWorker } from "./PromiseWorker"

// Aynı worker script'inden N tane instance oluşturup görev dağıtımını yönetir.
// "workerFactory": çağrıldığında yeni bir Worker() döndüren fonksiyon
// (her PromiseWorker kendi ham Worker'ını bu factory ile üretir).
export class WorkerPool {
  constructor(workerFactory, size = 1) {
    this._workers = Array.from({ length: size }, () => new PromiseWorker(workerFactory))
  }

  // En az bekleyen isteği olan worker'ı seçer (basit "least busy" zamanlama).
  _pickLeastBusyWorker() {
    let chosen = this._workers[0]
    for (const worker of this._workers) {
      if (worker.pendingCount < chosen.pendingCount) {
        chosen = worker
      }
    }
    return chosen
  }

  run(type, payload, transfer = []) {
    return this._pickLeastBusyWorker().run(type, payload, transfer)
  }

  get size() {
    return this._workers.length
  }

  terminate() {
    this._workers.forEach((worker) => worker.terminate())
  }
}