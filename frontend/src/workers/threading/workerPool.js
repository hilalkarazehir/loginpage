import { PromiseWorker } from "./PromiseWorker"

export class WorkerPool {
  constructor(workerFactory, size = 1) {
    this._workers = Array.from({ length: size }, () => new PromiseWorker(workerFactory))
  }

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