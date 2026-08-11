import { WorkerPool } from "./WorkerPool"

// GameEngine'in (ballWorker.js) kullandığı tek giriş noktası.
// Fizik hesaplamalarını ve renk değişim mantığını kendi worker havuzlarına
// dağıtır, sonuçları Promise tabanlı yüksek seviye bir API olarak sunar.
export class ThreadManager {
  constructor({ physicsPoolSize = 2, colorPoolSize = 1 } = {}) {
    this._physicsPool = new WorkerPool(
      () => new Worker(new URL("../physicsWorker.js", import.meta.url), { type: "module" }),
      physicsPoolSize
    )

    this._colorPool = new WorkerPool(
      () => new Worker(new URL("../colorWorker.js", import.meta.url), { type: "module" }),
      colorPoolSize
    )
  }

  // Top listesini havuzdaki fizik thread'leri arasında böler, hepsini paralel
  // hesaplatır ve sonuçları tek bir listede birleştirir. Dönen her eleman:
  // { ball: { ...güncellenmiş top }, event: "catch" | "miss" | null }
  async computePhysics({ balls, paddle, canvasWidth, canvasHeight, timeStep }) {
    const workerCount = this._physicsPool.size
    const chunks = this._splitIntoChunks(balls, workerCount)

    const chunkResults = await Promise.all(
      chunks.map((chunk) =>
        chunk.length === 0
          ? []
          : this._physicsPool.run("step", { balls: chunk, paddle, canvasWidth, canvasHeight, timeStep })
      )
    )

    return chunkResults.flat()
  }

  // Top yakalandığında/kaçırıldığında yeni rengini renk thread'inden alır.
  resolveNextColor(excludeColor) {
    return this._colorPool.run("resolve-color", { excludeColor })
  }

  pickTargetColor(excludeColor) {
    return this._colorPool.run("pick-target", { excludeColor })
  }

  _splitIntoChunks(list, chunkCount) {
    const chunks = Array.from({ length: chunkCount }, () => [])
    list.forEach((item, index) => {
      chunks[index % chunkCount].push(item)
    })
    return chunks
  }

  terminate() {
    this._physicsPool.terminate()
    this._colorPool.terminate()
  }
}