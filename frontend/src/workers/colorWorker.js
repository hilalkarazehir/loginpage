
import { randomColor, pickTarget } from "../lib/gameConstants"

self.onmessage = (e) => {
  const { id, type, payload } = e.data

  try {
    let result

    switch (type) {
      case "resolve-color":
        result = { color: randomColor(payload.excludeColor) }
        break

      case "pick-target":
        result = { color: pickTarget(payload.excludeColor) }
        break

      default:
        throw new Error(`colorWorker: bilinmeyen mesaj tipi '${type}'`)
    }

    self.postMessage({ id, result })
  } catch (err) {
    self.postMessage({ id, error: err.message })
  }
}