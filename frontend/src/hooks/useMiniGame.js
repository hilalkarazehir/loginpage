import { useEffect, useRef, useState } from "react"
import {CANVAS_WIDTH,CANVAS_HEIGHT,BALL_RADIUS,START_LIVES,BASE_POINTS,TRAP_COLOR,TRAP_PENALTY,TRAIL_LENGTH
,DIFFICULTY_TICK_MS,DIFFICULTY_STEP,DIFFICULTY_MAX,REWARD_COLORS,PADDLE_WIDTH,PADDLE_HEIGHT,PADDLE_Y,PADDLE_SPEED
,INITIAL_BALLS,randomColor,pickTarget,clamp,} from "../lib/gameConstants"

import { saveGameScore, fetchLeaderboard } from "../services/gameApi"
import { playCatchSuccess, playCatchMiss, playCatchTrap, playLifeLoss, playGameOver } from "../lib/soundEffects"

export function useMiniGame(navigate) {
  const [checked, setChecked] = useState(false)
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(START_LIVES)
  const [combo, setComboUI] = useState(0)
  const [speedLevel, setSpeedLevelUI] = useState(1)
  const [targetColor, setTargetColorUI] = useState(REWARD_COLORS[0])
  const [isGameOver, setIsGameOverState] = useState(false)
  const [leaderboard, setLeaderboard] = useState([])
  const [leaderboardStatus, setLeaderboardStatus] = useState("idle")
  const [isNewRecord, setIsNewRecord] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  const canvasRef = useRef(null)
  const ballsRef = useRef(INITIAL_BALLS.map((b) => ({ ...b })))
  const handledRef = useRef({})
  const trailsRef = useRef({})
  const popupsRef = useRef([])
  const flashRef = useRef(0)
  const workersRef = useRef({})
  const frameIdRef = useRef(null)
  const drawRef = useRef(() => {})
  const isGameOverRef = useRef(false)
  const pausedRef = useRef(false)
  const scoreRef = useRef(0)
  const comboRef = useRef(0)
  const targetColorRef = useRef(REWARD_COLORS[0])
  const targetTimeoutRef = useRef(null)
  const difficultyRef = useRef(1)
  const difficultyIntervalRef = useRef(null)
  const paddleRef = useRef({
    x: CANVAS_WIDTH / 2 - PADDLE_WIDTH / 2,
    y: PADDLE_Y,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
  })
  const keysRef = useRef({ left: false, right: false })

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    const token = localStorage.getItem("token")

    if (isLoggedIn !== "true" || !token) {
      navigate("/")
      return
    }

    setChecked(true)
  }, [navigate])

  useEffect(() => {
    if (!isGameOver) return

    setLeaderboardStatus("loading")
    fetchLeaderboard()
      .then((data) => {
        setLeaderboard(data)
        setLeaderboardStatus("ready")
      })
      .catch(() => setLeaderboardStatus("error"))
  }, [isGameOver])

  function setGameOver(value) {
    isGameOverRef.current = value
    setIsGameOverState(value)
  }

  function setCombo(value) {
    comboRef.current = value
    setComboUI(value)
  }

  function setSpeedLevel(value) {
    difficultyRef.current = value
    setSpeedLevelUI(value)
  }

  function startDifficultyRamp() {
    if (difficultyIntervalRef.current) clearInterval(difficultyIntervalRef.current)
    setSpeedLevel(1)
    difficultyIntervalRef.current = setInterval(() => {
      const next = Math.min(DIFFICULTY_MAX, difficultyRef.current + DIFFICULTY_STEP)
      setSpeedLevel(next)
      Object.values(workersRef.current).forEach((w) =>
        w.postMessage({ type: "difficulty", payload: { multiplier: next } })
      )
    }, DIFFICULTY_TICK_MS)
  }

  function setTargetColor(value) {
    targetColorRef.current = value
    setTargetColorUI(value)
  }

  function addPopup(x, y, text, color) {
    popupsRef.current.push({ x, y, text, color, life: 1 })
  }

  function scheduleNextTarget() {
    const delay = 5000 + Math.random() * 7000
    targetTimeoutRef.current = setTimeout(() => {
      setTargetColor(pickTarget(targetColorRef.current))
      setCombo(0)
      scheduleNextTarget()
    }, delay)
  }

  function handleRestart() {
    setScore(0)
    scoreRef.current = 0
    setLives(START_LIVES)
    setGameOver(false)
     setIsNewRecord(false)
    setCombo(0)
    setTargetColor(pickTarget())
    ballsRef.current = INITIAL_BALLS.map((b) => ({ ...b }))
    handledRef.current = {}
    trailsRef.current = {}
    popupsRef.current = []
    flashRef.current = 0

    INITIAL_BALLS.forEach((ballConfig) => {
      const worker = workersRef.current[ballConfig.id]
      if (worker) {
        worker.postMessage({
          type: "init",
          payload: { canvasWidth: CANVAS_WIDTH, canvasHeight: CANVAS_HEIGHT, ball: ballConfig },
        })
      }
    })

    if (targetTimeoutRef.current) clearTimeout(targetTimeoutRef.current)
    scheduleNextTarget()
    startDifficultyRamp()
    frameIdRef.current = requestAnimationFrame(drawRef.current)
  }
  function togglePause() {
    const nextPaused = !pausedRef.current

    pausedRef.current = nextPaused
    setIsPaused(nextPaused)

      Object.values(workersRef.current).forEach((worker) => {
      worker.postMessage({
        type: nextPaused ? "pause" : "resume",
      })
    })

    if (!nextPaused) {
      frameIdRef.current = requestAnimationFrame(drawRef.current)
    }
  }

  useEffect(() => {
    if (!checked) return

    setTargetColor(pickTarget())
    scheduleNextTarget()
    startDifficultyRamp()

    function handleMouseMove(e) {
      const rect = canvasRef.current.getBoundingClientRect()
      const scaleX = CANVAS_WIDTH / rect.width
      const relativeX = (e.clientX - rect.left) * scaleX
      paddleRef.current.x = clamp(relativeX - paddleRef.current.width / 2, 0, CANVAS_WIDTH - paddleRef.current.width)
    }

    function handleKeyDown(e) {
      if (e.key === "ArrowLeft") keysRef.current.left = true
      if (e.key === "ArrowRight") keysRef.current.right = true
    }
    function handleKeyUp(e) {
      if (e.key === "ArrowLeft") keysRef.current.left = false
      if (e.key === "ArrowRight") keysRef.current.right = false
    }

    canvasRef.current.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    function handleAutoPause() {
      if (!pausedRef.current && !isGameOverRef.current) {
        togglePause()
      }
    }
    function handleVisibilityChange() {
      if (document.hidden) handleAutoPause()
    }
    document.addEventListener("visibilitychange", handleVisibilityChange)
    window.addEventListener("blur", handleAutoPause)

    INITIAL_BALLS.forEach((ballConfig) => {
      const worker = new Worker(new URL("../workers/ballWorker.js", import.meta.url), { type: "module" })

      worker.onmessage = (e) => {
        if (e.data.type === "tick") {
          const updated = e.data.ball
          ballsRef.current = ballsRef.current.map((b) => (b.id === updated.id ? updated : b))
          handledRef.current[updated.id] = false
        }
      }
      worker.onerror = (err) => console.error(`[ballWorker #${ballConfig.id} hata]`, err.message, err)

      worker.postMessage({
        type: "init",
        payload: { canvasWidth: CANVAS_WIDTH, canvasHeight: CANVAS_HEIGHT, ball: ballConfig },
      })

      workersRef.current[ballConfig.id] = worker
      trailsRef.current[ballConfig.id] = []
    })

    const ctx = canvasRef.current.getContext("2d")

    function isCatching(ball, paddle) {
      if (ball.vy <= 0) return false
      const ballBottom = ball.y + ball.radius
      const withinY = ballBottom >= paddle.y && ballBottom <= paddle.y + paddle.height + ball.vy
      const withinX = ball.x + ball.radius > paddle.x && ball.x - ball.radius < paddle.x + paddle.width
      return withinX && withinY
    }

    function drawBall(ctx, ball) {
      ctx.save()
      ctx.shadowColor = "rgba(0,0,0,0.35)"
      ctx.shadowBlur = 8
      ctx.shadowOffsetY = 3

      const gradient = ctx.createRadialGradient(
        ball.x - ball.radius * 0.35,
        ball.y - ball.radius * 0.35,
        ball.radius * 0.15,
        ball.x,
        ball.y,
        ball.radius
      )
      gradient.addColorStop(0, "#ffffff")
      gradient.addColorStop(0.25, ball.color)
      gradient.addColorStop(1, ball.color)

      ctx.beginPath()
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2)
      ctx.fillStyle = gradient
      ctx.fill()
      ctx.restore()
    }

    function drawTrail(ctx, points, color) {
      points.forEach((p, i) => {
        const alpha = ((i + 1) / points.length) * 0.18
        ctx.beginPath()
        ctx.arc(p.x, p.y, BALL_RADIUS * 0.6, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.globalAlpha = alpha
        ctx.fill()
        ctx.globalAlpha = 1
      })
    }

    function drawPaddle(ctx, paddle) {
      ctx.save()
      ctx.shadowColor = "rgba(217,164,65,0.5)"
      ctx.shadowBlur = 10

      const gradient = ctx.createLinearGradient(paddle.x, paddle.y, paddle.x, paddle.y + paddle.height)
      gradient.addColorStop(0, "#FCEFCF")
      gradient.addColorStop(1, "#D9A441")

      ctx.beginPath()
      ctx.roundRect(paddle.x, paddle.y, paddle.width, paddle.height, 7)
      ctx.fillStyle = gradient
      ctx.fill()
      ctx.restore()
    }

    const draw = () => {
    if (pausedRef.current) return
      if (isGameOverRef.current) return

      if (keysRef.current.left) paddleRef.current.x -= PADDLE_SPEED
      if (keysRef.current.right) paddleRef.current.x += PADDLE_SPEED
      paddleRef.current.x = clamp(paddleRef.current.x, 0, CANVAS_WIDTH - paddleRef.current.width)

      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

      for (const ball of ballsRef.current) {
        const worker = workersRef.current[ball.id]

        const trail = trailsRef.current[ball.id] || []
        trail.push({ x: ball.x, y: ball.y })
        if (trail.length > TRAIL_LENGTH) trail.shift()
        trailsRef.current[ball.id] = trail
        drawTrail(ctx, trail, ball.color)

        const alreadyHandled = handledRef.current[ball.id]

        if (!alreadyHandled && isCatching(ball, paddleRef.current)) {
          handledRef.current[ball.id] = true
          const caughtColor = ball.color
          let points = 0

          if (caughtColor === TRAP_COLOR) {
            points = TRAP_PENALTY
            setCombo(0)
            playCatchTrap()
          } else if (caughtColor === targetColorRef.current) {
            const nextCombo = comboRef.current + 1
            setCombo(nextCombo)
            points = BASE_POINTS * nextCombo
            playCatchSuccess(nextCombo)
          } else {
            points = BASE_POINTS
            setCombo(0)
            playCatchMiss()
          }

         setScore((prev) => {
           const next = Math.max(0, prev + points)
           scoreRef.current = next
           return next
         })
          addPopup(ball.x, ball.y - ball.radius, `${points > 0 ? "+" : ""}${points}`, points > 0 ? "#68D391" : "#F56565")

          worker.postMessage({
            type: "bounce",
            payload: {
              y: paddleRef.current.y - ball.radius - 1,
              vy: -(8 + Math.random() * 3),
              color: randomColor(caughtColor),
            },
          })
        } else if (!alreadyHandled && ball.y - ball.radius > CANVAS_HEIGHT) {
          handledRef.current[ball.id] = true
          const wasTarget = ball.color === targetColorRef.current

         if (wasTarget) {
           setCombo(0)
           flashRef.current = 1
           playLifeLoss()
           setLives((prev) => {
             const next = prev - 1
            if (next <= 0) {
              setGameOver(true)
              playGameOver()
              saveGameScore(scoreRef.current).then((result) => {
                if (result?.isNewRecord) setIsNewRecord(true)
              })
              Object.values(workersRef.current).forEach((w) => w.postMessage({ type: "stop" }))
            }
             return Math.max(next, 0)
           })
         }
          worker.postMessage({
            type: "reset",
            payload: {
              x: 30 + Math.random() * (CANVAS_WIDTH - 60),
              y: 10,
              vx: (Math.random() < 0.5 ? -1 : 1) * (1.4 + Math.random() * 1.2) * difficultyRef.current,
              vy: 0,
              color: randomColor(ball.color),
            },
          })
        }

        drawBall(ctx, ball)
      }

      drawPaddle(ctx, paddleRef.current)

      // Ucan puan yazilari
      popupsRef.current = popupsRef.current.filter((p) => p.life > 0)
      popupsRef.current.forEach((p) => {
        ctx.save()
        ctx.globalAlpha = p.life
        ctx.fillStyle = p.color
        ctx.font = "bold 14px sans-serif"
        ctx.textAlign = "center"
        ctx.fillText(p.text, p.x, p.y)
        ctx.restore()
        p.y -= 0.6
        p.life -= 0.02
      })

      // Can kaybi ekran flasi
      if (flashRef.current > 0) {
        ctx.save()
        ctx.fillStyle = `rgba(245, 101, 101, ${flashRef.current * 0.35})`
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
        ctx.restore()
        flashRef.current -= 0.04
      }

      frameIdRef.current = requestAnimationFrame(draw)
    }

    drawRef.current = draw
    draw()

    return () => {
      canvasRef.current?.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      window.removeEventListener("blur", handleAutoPause)
      Object.values(workersRef.current).forEach((w) => w.terminate())
      workersRef.current = {}
      if (targetTimeoutRef.current) clearTimeout(targetTimeoutRef.current)
      if (difficultyIntervalRef.current) clearInterval(difficultyIntervalRef.current)
      cancelAnimationFrame(frameIdRef.current)
    }
  }, [checked])

return {checked,canvasRef,score,lives,combo,speedLevel,targetColor,isGameOver,leaderboard,leaderboardStatus
,handleRestart,isNewRecord,isPaused,togglePause,
}
}