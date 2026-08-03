let ball = null
let canvasWidth = 560
let canvasHeight = 420
let intervalId = null
let baseGravity = 0.22
let difficultyMultiplier = 1

function tick() {
  if (!ball) return

  ball.vy += ball.gravity
  ball.y += ball.vy
  ball.x += ball.vx

  if (ball.x - ball.radius <= 0) {
    ball.x = ball.radius
    ball.vx = Math.abs(ball.vx)
  } else if (ball.x + ball.radius >= canvasWidth) {
    ball.x = canvasWidth - ball.radius
    ball.vx = -Math.abs(ball.vx)
  }

  self.postMessage({ type: "tick", ball })
}

self.onmessage = (e) => {
  const { type, payload } = e.data

  if (type === "init") {
    canvasWidth = payload.canvasWidth
    canvasHeight = payload.canvasHeight
    ball = { ...payload.ball }
    baseGravity = payload.ball.gravity
    difficultyMultiplier = 1

    if (intervalId) clearInterval(intervalId)
    intervalId = setInterval(tick, 16) // ~60 kare/saniye
  }

  if (type === "bounce") {
    if (!ball) return
    ball.y = payload.y
    ball.vy = payload.vy
    ball.color = payload.color
  }

  if (type === "reset") {
    if (!ball) return
    ball.x = payload.x
    ball.y = payload.y
    ball.vx = payload.vx
    ball.vy = payload.vy
    ball.color = payload.color
  }

  if (type === "difficulty") {
    if (!ball) return
    difficultyMultiplier = payload.multiplier
    ball.gravity = baseGravity * difficultyMultiplier
  }

if (type === "pause") {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}

if (type === "resume") {
  if (!intervalId) {
    intervalId = setInterval(tick, 16)
  }
}
  if (type === "stop") {
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
  }
}