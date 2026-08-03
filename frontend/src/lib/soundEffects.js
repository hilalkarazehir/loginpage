// Web Audio API ile anlik ton uretimi - disaridan ses dosyasi gerektirmez.
// Tarayicilarin autoplay politikasi geregi AudioContext ilk kullanici etkilesiminde olusturulur.

let ctx = null

function getContext() {
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)()
  }
  if (ctx.state === "suspended") {
    ctx.resume()
  }
  return ctx
}

function playTone({
  frequency,
  duration,
  type = "sine",
  volume = 0.2,
  delay = 0,
}) {
  const audioCtx = getContext()
  const startTime = audioCtx.currentTime + delay

  const osc = audioCtx.createOscillator()
  const gain = audioCtx.createGain()

  osc.type = type
  osc.frequency.setValueAtTime(frequency, startTime)

  gain.gain.setValueAtTime(0, startTime)
  gain.gain.linearRampToValueAtTime(volume, startTime + 0.01)
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration)

  osc.connect(gain)
  gain.connect(audioCtx.destination)

  osc.start(startTime)
  osc.stop(startTime + duration)
}

export function playCatchSuccess(combo = 1) {
  const base = 523.25
  const frequency = base * Math.pow(2, Math.min(combo - 1, 6) / 12)

  playTone({
    frequency,
    duration: 0.18,
    type: "sine",
    volume: 0.22,
  })

  playTone({
    frequency: frequency * 1.5,
    duration: 0.15,
    type: "sine",
    volume: 0.12,
    delay: 0.03,
  })
}

export function playCatchMiss() {
  playTone({
    frequency: 300,
    duration: 0.12,
    type: "triangle",
    volume: 0.15,
  })
}

export function playCatchTrap() {
  playTone({
    frequency: 180,
    duration: 0.2,
    type: "triangle",
    volume: 0.14,
  })
}

export function playLifeLoss() {
  playTone({
    frequency: 220,
    duration: 0.14,
    type: "square",
    volume: 0.18,
  })

  playTone({
    frequency: 180,
    duration: 0.18,
    type: "square",
    volume: 0.18,
    delay: 0.12,
  })
}

export function playGameOver() {
  playTone({
    frequency: 220,
    duration: 0.18,
    type: "square",
    volume: 0.22,
  })

  playTone({
    frequency: 170,
    duration: 0.22,
    type: "square",
    volume: 0.18,
    delay: 0.18,
  })

  playTone({
    frequency: 130,
    duration: 0.35,
    type: "triangle",
    volume: 0.16,
    delay: 0.42,
  })
}