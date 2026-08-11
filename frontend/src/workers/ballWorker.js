import {
  BASE_POINTS,
  TRAP_COLOR,
  TRAP_PENALTY,
  PADDLE_SPEED,
  START_LIVES,
  clamp,
} from "../lib/gameConstants"
import { ThreadManager } from "./threading/ThreadManager"

class GameEngine {
  constructor() {
    this.threadManager = new ThreadManager({ physicsPoolSize: 2, colorPoolSize: 1 })

    this.canvas = null
    this.ctx = null
    this.canvasWidth = 680
    this.canvasHeight = 480

    this.balls = []
    this.difficultyMultiplier = 1
    this.baseGravity = {}
    this.targetColor = null

    this.paddle = { x: 0, y: 0, width: 0, height: 0 }
    this.keys = { left: false, right: false }

    this.score = 0
    this.lives = START_LIVES
    this.combo = 0
    this.maxCombo = 0
    this.stats = { correct: 0, wrong: 0, trap: 0, missed: 0 }
    this.startTime = Date.now()

    this.squash = {}
    this.popups = []
    this.particles = []
    this.paddleFlash = 0
    this.flash = 0
    this.shake = { intensity: 0, x: 0, y: 0 }
    this.ballGradients = new Map()

    this.isRunning = false
    this.isPaused = false
    this.isGameOver = false
    this.lastTime = 0
    this.rafId = null
  }
  post(type, payload) {
    self.postMessage({ type, payload })
  }

  sendHud() {
    this.post("hud", { score: this.score, lives: this.lives, combo: this.combo, maxCombo: this.maxCombo })
  }

  playSound(name, extra) {
    this.post("sound", { name, ...extra })
  }
  addPopup(x, y, text, color) {
    this.popups.push({ x, y, text, color, life: 1 })
  }

  spawnBurst(x, y, color, count = 8, speedRange = [2, 4.5]) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.6
      const speed = speedRange[0] + Math.random() * (speedRange[1] - speedRange[0])
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        radius: 1.5 + Math.random() * 2.2,
        color,
        life: 1,
        decay: 0.025 + Math.random() * 0.02,
      })
    }
  }

  triggerShake(intensity) {
    this.shake.intensity = Math.max(this.shake.intensity, intensity)
  }

  getBallGradient(ball) {
    let gradient = this.ballGradients.get(ball.color)
    if (!gradient) {
      gradient = this.ctx.createRadialGradient(
        -ball.radius * 0.35,
        -ball.radius * 0.35,
        ball.radius * 0.15,
        0,
        0,
        ball.radius
      )
      gradient.addColorStop(0, "#ffffff")
      gradient.addColorStop(0.25, ball.color)
      gradient.addColorStop(1, ball.color)
      this.ballGradients.set(ball.color, gradient)
    }
    return gradient
  }

  drawTrapAura(ball) {
    const ctx = this.ctx
    const time = Date.now() / 1000
    const pulse = 0.5 + Math.sin(time * 4) * 0.5

    ctx.save()
    ctx.translate(ball.x, ball.y)

    const spikeCount = 10
    const innerR = ball.radius + 2
    const outerR = ball.radius + 6 + pulse * 5

    ctx.beginPath()
    for (let i = 0; i < spikeCount * 2; i++) {
      const angle = (Math.PI * i) / spikeCount
      const r = i % 2 === 0 ? outerR : innerR
      const x = Math.cos(angle) * r
      const y = Math.sin(angle) * r
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.closePath()
    ctx.fillStyle = `rgba(255, 40, 40, ${0.18 + pulse * 0.18})`
    ctx.shadowColor = "#FF0000"
    ctx.shadowBlur = 14 + pulse * 12
    ctx.fill()

    ctx.restore()
  }

  drawBall(ball) {
    const ctx = this.ctx
    const isTarget = ball.color === this.targetColor
    const isTrap = ball.color === TRAP_COLOR
    const sq = this.squash[ball.id] || 0
    const scaleX = 1 + sq * 0.32
    const scaleY = 1 - sq * 0.32

    if (isTrap) {
      this.drawTrapAura(ball)
    }

    ctx.save()
    ctx.translate(ball.x, ball.y)

    if (isTrap) {
      const jitterPhase = Date.now() / 60
      ctx.translate(Math.sin(jitterPhase) * 0.6, Math.cos(jitterPhase * 1.3) * 0.6)
    }

    ctx.scale(scaleX, scaleY)
    ctx.shadowColor = ball.color
    ctx.shadowBlur = isTarget ? 20 : isTrap ? 16 : 9
    ctx.beginPath()
    ctx.arc(0, 0, ball.radius, 0, Math.PI * 2)
    ctx.fillStyle = this.getBallGradient(ball)
    ctx.fill()

    ctx.shadowBlur = 0
    ctx.lineWidth = 1.4
    ctx.strokeStyle = "rgba(255,255,255,0.35)"
    ctx.beginPath()
    ctx.arc(0, 0, ball.radius - 0.8, 0, Math.PI * 2)
    ctx.stroke()

    ctx.beginPath()
    ctx.fillStyle = "rgba(255,255,255,0.55)"
    ctx.arc(-ball.radius * 0.32, -ball.radius * 0.38, ball.radius * 0.16, 0, Math.PI * 2)
    ctx.fill()

    ctx.restore()

    if (isTarget) {
      ctx.save()
      ctx.strokeStyle = "rgba(255,255,255,0.4)"
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.arc(ball.x, ball.y, ball.radius + 4, 0, Math.PI * 2)
      ctx.stroke()
      ctx.restore()
    }
  }

  drawParticles(list) {
    const ctx = this.ctx
    list.forEach((p) => {
      ctx.save()
      ctx.globalAlpha = Math.max(p.life, 0)
      ctx.fillStyle = p.color
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    })
  }

  drawPaddle(p) {
    const ctx = this.ctx
    const fl = this.paddleFlash
    const r = p.height / 2

    ctx.save()
    ctx.shadowColor = fl > 0 ? "rgba(255,255,255,0.9)" : "rgba(217,164,65,0.75)"
    ctx.shadowBlur = 16 + fl * 16

    const bodyGradient = ctx.createLinearGradient(p.x, p.y, p.x, p.y + p.height)
    bodyGradient.addColorStop(0, fl > 0 ? "#FFFFFF" : "#3A2C12")
    bodyGradient.addColorStop(0.5, fl > 0 ? "#FFF3D6" : "#1E1608")
    bodyGradient.addColorStop(1, fl > 0 ? "#FFFFFF" : "#3A2C12")

    ctx.beginPath()
    ctx.roundRect(p.x, p.y, p.width, p.height, r)
    ctx.fillStyle = bodyGradient
    ctx.fill()

    ctx.shadowBlur = fl > 0 ? 10 : 6
    ctx.shadowColor = fl > 0 ? "#FFFFFF" : "#F6D48A"
    const coreGradient = ctx.createLinearGradient(p.x, 0, p.x + p.width, 0)
    coreGradient.addColorStop(0, "rgba(217,164,65,0.15)")
    coreGradient.addColorStop(0.5, fl > 0 ? "#FFFFFF" : "#F6D48A")
    coreGradient.addColorStop(1, "rgba(217,164,65,0.15)")
    ctx.beginPath()
    ctx.roundRect(p.x + 4, p.y + p.height / 2 - 1.6, p.width - 8, 3.2, 2)
    ctx.fillStyle = coreGradient
    ctx.fill()

    ctx.shadowBlur = 8
    ctx.fillStyle = fl > 0 ? "#FFFFFF" : "#FCEFCF"
    ctx.beginPath()
    ctx.arc(p.x + r, p.y + r, 2.4, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(p.x + p.width - r, p.y + r, 2.4, 0, Math.PI * 2)
    ctx.fill()

    ctx.restore()
  }

  async handleCatch(ball) {
    const caughtColor = ball.color
    let points = 0

    if (caughtColor === TRAP_COLOR) {
      points = TRAP_PENALTY
      this.combo = 0
      this.stats.trap += 1
      this.playSound("trap")
      this.spawnBurst(ball.x, ball.y, TRAP_COLOR, 12, [3, 6])
      this.triggerShake(7)
    } else if (caughtColor === this.targetColor) {
      this.combo += 1
      if (this.combo > this.maxCombo) this.maxCombo = this.combo
      points = BASE_POINTS * this.combo
      this.stats.correct += 1
      this.playSound("success", { combo: this.combo })
      this.spawnBurst(ball.x, ball.y, caughtColor, Math.min(8 + this.combo * 2, 20), [2, 4.5])
      this.paddleFlash = 1
    } else {
      points = 0
      this.combo = 0
      this.stats.wrong += 1
      this.playSound("miss")
      this.spawnBurst(ball.x, ball.y, caughtColor, 6, [1.5, 3])
      this.paddleFlash = 0.6
    }

    this.squash[ball.id] = 1
    this.score = Math.max(0, this.score + points)
    if (points !== 0) {
      this.addPopup(ball.x, ball.y - ball.radius, `${points > 0 ? "+" : ""}${points}`, points > 0 ? "#68D391" : "#F56565")
    }

    ball.y = this.paddle.y - ball.radius - 1
    ball.vy = -(7 + Math.random() * 2)
    ball.vx = (Math.random() - 0.5) * 1.5

    const { color } = await this.threadManager.resolveNextColor(caughtColor)
    ball.color = color

    this.sendHud()
  }

  async handleMiss(ball) {
    const wasTarget = ball.color === this.targetColor

    if (wasTarget) {
      this.combo = 0
      this.stats.missed += 1
      this.flash = 1
      this.triggerShake(10)
      this.playSound("lifeloss")
      this.lives -= 1
      if (this.lives <= 0) {
        this.lives = 0
        this.endGame()
      }
    }

    const padding = 40
    ball.x = padding + Math.random() * (this.canvasWidth - padding * 2)
    ball.y = -(ball.radius ? ball.radius * 2 : 25)
    ball.vx = (Math.random() - 0.5) * 1.0
    ball.vy = (0.5 + Math.random() * 0.8) * this.difficultyMultiplier

    const { color } = await this.threadManager.resolveNextColor(ball.color)
    ball.color = color

    this.sendHud()
  }

  endGame() {
    this.isGameOver = true
    this.isRunning = false

    const elapsedSeconds = Math.max(0, Math.floor((Date.now() - this.startTime) / 1000))
    const mm = String(Math.floor(elapsedSeconds / 60)).padStart(2, "0")
    const ss = String(elapsedSeconds % 60).padStart(2, "0")
    const duration = `${mm}:${ss}`

    const totalEvents = this.stats.correct + this.stats.wrong + this.stats.trap + this.stats.missed
    const accuracy = totalEvents > 0 ? Math.round((this.stats.correct / totalEvents) * 100) : 0

    this.playSound("gameover")
    this.post("game-over", {
      score: this.score,
      duration,
      elapsedSeconds,
      accuracy,
      maxCombo: this.maxCombo,
      correctCatches: this.stats.correct,
    })
  }

  // ---- Ana döngü ----

  async loop(currentTime) {
    if (!this.isRunning || this.isPaused || this.isGameOver) return

    if (!this.lastTime) this.lastTime = currentTime
    let dt = (currentTime - this.lastTime) / 1000
    this.lastTime = currentTime
    if (dt > 0.1) dt = 0.016
    const timeStep = dt * 60

    if (this.keys.left) this.paddle.x -= PADDLE_SPEED
    if (this.keys.right) this.paddle.x += PADDLE_SPEED
    this.paddle.x = clamp(this.paddle.x, 0, this.canvasWidth - this.paddle.width)

    const stepResults = await this.threadManager.computePhysics({
      balls: this.balls,
      paddle: this.paddle,
      canvasWidth: this.canvasWidth,
      canvasHeight: this.canvasHeight,
      timeStep,
    })
    const resultById = new Map(stepResults.map((r) => [r.ball.id, r]))
    const catchOrMissHandlers = []

    this.balls = this.balls.map((ball) => {
      const stepResult = resultById.get(ball.id)
      if (!stepResult) return ball

      const updated = { ...ball, ...stepResult.ball }

      if (stepResult.event === "catch") {
        catchOrMissHandlers.push(this.handleCatch(updated))
      } else if (stepResult.event === "miss") {
        catchOrMissHandlers.push(this.handleMiss(updated))
      }

      return updated
    })

    if (catchOrMissHandlers.length > 0) {
      await Promise.all(catchOrMissHandlers)
    }

    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)

    if (this.shake.intensity > 0.05) {
      this.shake.x = (Math.random() - 0.5) * this.shake.intensity
      this.shake.y = (Math.random() - 0.5) * this.shake.intensity
      this.shake.intensity *= 0.85
    } else {
      this.shake.x = 0
      this.shake.y = 0
      this.shake.intensity = 0
    }
    this.ctx.save()
    this.ctx.translate(this.shake.x, this.shake.y)

    Object.keys(this.squash).forEach((id) => {
      this.squash[id] *= 0.8
      if (this.squash[id] < 0.02) delete this.squash[id]
    })
    this.paddleFlash = Math.max(0, this.paddleFlash - 0.06)

    for (const ball of this.balls) {
      this.drawBall(ball)
    }

    this.drawPaddle(this.paddle)

    this.particles.forEach((p) => {
      p.x += p.vx
      p.y += p.vy
      p.vy += 0.18
      p.life -= p.decay
    })
    this.particles = this.particles.filter((p) => p.life > 0)
    this.drawParticles(this.particles)

    this.ctx.restore()

    this.popups = this.popups.filter((p) => p.life > 0)
    this.popups.forEach((p) => {
      this.ctx.save()
      this.ctx.globalAlpha = p.life
      this.ctx.fillStyle = p.color
      this.ctx.font = "bold 14px sans-serif"
      this.ctx.textAlign = "center"
      this.ctx.fillText(p.text, p.x, p.y)
      this.ctx.restore()
      p.y -= 0.6
      p.life -= 0.02
    })

    if (this.flash > 0) {
      this.ctx.save()
      this.ctx.fillStyle = `rgba(245, 101, 101, ${this.flash * 0.35})`
      this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight)
      this.ctx.restore()
      this.flash -= 0.04
    }

    if (this.isRunning && !this.isGameOver) {
      this.rafId = requestAnimationFrame((t) => this.loop(t))
    }
  }

  startLoop() {
    this.isRunning = true
    this.isPaused = false
    this.lastTime = 0
    if (this.rafId) cancelAnimationFrame(this.rafId)
    this.rafId = requestAnimationFrame((t) => this.loop(t))
  }

  resetState(payload) {
    const padding = 40
    this.balls = payload.balls.map((b) => ({
      ...b,
      x: padding + Math.random() * (this.canvasWidth - padding * 2),
      y: -(b.radius ? b.radius * 2 : 25),
      vx: (Math.random() - 0.5) * 1.0,
      vy: 0.5 + Math.random() * 0.8,
    }))

    this.baseGravity = {}
    this.balls.forEach((b) => {
      this.baseGravity[b.id] = b.gravity
    })
    this.difficultyMultiplier = 1

    this.paddle = { ...payload.paddle }
    this.targetColor = payload.targetColor

    this.score = 0
    this.lives = START_LIVES
    this.combo = 0
    this.maxCombo = 0
    this.stats = { correct: 0, wrong: 0, trap: 0, missed: 0 }
    this.startTime = Date.now()

    this.squash = {}
    this.popups = []
    this.particles = []
    this.paddleFlash = 0
    this.flash = 0
    this.shake = { intensity: 0, x: 0, y: 0 }
    this.ballGradients.clear()

    this.isPaused = false
    this.isGameOver = false
    this.lastTime = 0

    this.sendHud()
  }

  // ---- Ana thread'den gelen mesajların dağıtımı ----

  handleMessage({ type, payload }) {
    switch (type) {
      case "init-canvas": {
        this.canvas = payload.canvas
        this.ctx = this.canvas.getContext("2d")
        this.canvasWidth = payload.canvasWidth
        this.canvasHeight = payload.canvasHeight
        this.resetState(payload)
        this.startLoop()
        break
      }

      case "restart": {
        this.resetState(payload)
        this.startLoop()
        break
      }

      case "pointer-move": {
        if (this.paddle.width) {
          this.paddle.x = clamp(payload.x - this.paddle.width / 2, 0, this.canvasWidth - this.paddle.width)
        }
        break
      }

      case "key-down": {
        this.keys[payload.key] = true
        break
      }

      case "key-up": {
        this.keys[payload.key] = false
        break
      }

      case "set-target-color": {
        this.targetColor = payload.color
        this.combo = 0
        this.sendHud()
        break
      }

      case "set-difficulty": {
        this.difficultyMultiplier = payload.multiplier
        this.balls.forEach((ball) => {
          ball.gravity = (this.baseGravity[ball.id] ?? ball.gravity) * this.difficultyMultiplier
        })
        break
      }

      case "pause": {
        this.isPaused = true
        break
      }

      case "resume": {
        if (!this.isGameOver) {
          this.isPaused = false
          this.lastTime = 0
          this.rafId = requestAnimationFrame((t) => this.loop(t))
        }
        break
      }

      case "stop": {
        this.isRunning = false
        break
      }

      default:
        break
    }
  }
}

const engine = new GameEngine()
self.onmessage = (e) => engine.handleMessage(e.data)