// Fizik hesaplamalarına ayrılmış, tamamen stateless (durumsuz) modüler thread.
// GameEngine (ballWorker.js) her frame'de top listesini + paddle bilgisini
// gönderir, bu thread her top için gravity integrasyonu, duvar sekmesi ve
// paddle çarpışma/kaçırma tespitini yapıp güncellenmiş sonucu döner.
// Skor/can/kombo gibi oyun kuralları burada YOK — bunlar GameEngine'de kalır.

const MAX_VY = 11
const AIR_RESISTANCE = 0.998

function isCatching(ball, paddle) {
  if (ball.vy <= 0) return false
  const ballBottom = ball.y + ball.radius
  const withinY = ballBottom >= paddle.y && ballBottom <= paddle.y + paddle.height + ball.vy
  const withinX = ball.x + ball.radius > paddle.x && ball.x - ball.radius < paddle.x + paddle.width
  return withinX && withinY
}

function stepBall(ball, paddle, canvasWidth, canvasHeight, timeStep) {
  const next = { ...ball }

  next.vy += next.gravity * timeStep
  next.vy *= AIR_RESISTANCE

  if (next.vy > MAX_VY) {
    next.vy = MAX_VY + (next.vy - MAX_VY) * 0.25
  }

  next.vx *= AIR_RESISTANCE

  next.y += next.vy * timeStep
  next.x += next.vx * timeStep

  if (next.x - next.radius <= 0) {
    next.x = next.radius
    next.vx = Math.abs(next.vx)
  } else if (next.x + next.radius >= canvasWidth) {
    next.x = canvasWidth - next.radius
    next.vx = -Math.abs(next.vx)
  }

  let event = null
  if (isCatching(next, paddle)) {
    event = "catch"
  } else if (next.y - next.radius > canvasHeight) {
    event = "miss"
  }

  return { ball: next, event }
}

self.onmessage = (e) => {
  const { id, type, payload } = e.data

  if (type !== "step") {
    self.postMessage({ id, error: `physicsWorker: bilinmeyen mesaj tipi '${type}'` })
    return
  }

  try {
    const { balls, paddle, canvasWidth, canvasHeight, timeStep } = payload
    const result = balls.map((ball) => stepBall(ball, paddle, canvasWidth, canvasHeight, timeStep))
    self.postMessage({ id, result })
  } catch (err) {
    self.postMessage({ id, error: err.message })
  }
}