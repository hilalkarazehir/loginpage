import { useCallback, useEffect, useRef, useState } from "react"
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  START_LIVES,
  DIFFICULTY_TICK_MS,
  DIFFICULTY_STEP,
  DIFFICULTY_MAX,
  REWARD_COLORS,
  PADDLE_WIDTH,
  PADDLE_HEIGHT,
  PADDLE_Y,
  INITIAL_BALLS,
  pickTarget,
  clamp,
} from "../lib/gameConstants"

import { saveGameScore, fetchLeaderboard } from "../services/gameApi"
import {
  playCatchSuccess,
  playCatchMiss,
  playCatchTrap,
  playLifeLoss,
  playGameOver,
} from "../lib/soundEffects"

function buildInitPayload(targetColor) {
  return {
    canvasWidth: CANVAS_WIDTH,
    canvasHeight: CANVAS_HEIGHT,
    balls: INITIAL_BALLS.map((b) => ({ ...b })),
    paddle: {
      x: CANVAS_WIDTH / 2 - PADDLE_WIDTH / 2,
      y: PADDLE_Y,
      width: PADDLE_WIDTH,
      height: PADDLE_HEIGHT,
    },
    targetColor,
  }
}

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
  const [maxCombo, setMaxComboUI] = useState(0)
  const [accuracy, setAccuracy] = useState(0)
  const [duration, setDuration] = useState("00:00")
  const [workerError, setWorkerError] = useState(false)
  const [scoreSaveError, setScoreSaveError] = useState(false)

  const canvasRef = useRef(null)
  const workerRef = useRef(null)
  const isGameOverRef = useRef(false)
  const pausedRef = useRef(false)
  const targetColorRef = useRef(REWARD_COLORS[0])
  const targetTimeoutRef = useRef(null)
  const difficultyRef = useRef(1)
  const difficultyIntervalRef = useRef(null)
  const pendingTerminateRef = useRef(null) // StrictMode çift-mount koruması için

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
    if (!checked) return

    setLeaderboardStatus("loading")
    fetchLeaderboard()
      .then((data) => {
        setLeaderboard(data)
        setLeaderboardStatus("ready")
      })
      .catch(() => setLeaderboardStatus("error"))
  }, [checked, isGameOver])

  function refreshLeaderboard() {
    setLeaderboardStatus("loading")
    fetchLeaderboard()
      .then((data) => {
        setLeaderboard(data)
        setLeaderboardStatus("ready")
      })
      .catch(() => setLeaderboardStatus("error"))
  }

  function setGameOver(value) {
    isGameOverRef.current = value
    setIsGameOverState(value)
  }

  function setSpeedLevel(value) {
    difficultyRef.current = value
    setSpeedLevelUI(value)
  }

  function setTargetColor(value) {
    targetColorRef.current = value
    setTargetColorUI(value)
  }

  const stopTimers = useCallback(() => {
    if (targetTimeoutRef.current) {
      clearTimeout(targetTimeoutRef.current)
      targetTimeoutRef.current = null
    }
    if (difficultyIntervalRef.current) {
      clearInterval(difficultyIntervalRef.current)
      difficultyIntervalRef.current = null
    }
  }, [])

  const startTimers = useCallback(() => {
    stopTimers()

    if (difficultyRef.current < DIFFICULTY_MAX) {
      difficultyIntervalRef.current = setInterval(() => {
        const next = Math.min(DIFFICULTY_MAX, difficultyRef.current + DIFFICULTY_STEP)
        setSpeedLevel(next)
        workerRef.current?.postMessage({
          type: "set-difficulty",
          payload: { multiplier: next },
        })

        if (next >= DIFFICULTY_MAX) {
          clearInterval(difficultyIntervalRef.current)
          difficultyIntervalRef.current = null
        }
      }, DIFFICULTY_TICK_MS)
    }

    const scheduleNextTarget = () => {
      const delay = 5000 + Math.random() * 7000


      targetTimeoutRef.current = setTimeout(() => {
        const next = pickTarget(targetColorRef.current)
        setTargetColor(next)
        workerRef.current?.postMessage({
          type: "set-target-color",
          payload: { color: next },
        })
        scheduleNextTarget()
      }, delay)
    }
    scheduleNextTarget()

  }, [stopTimers])

  useEffect(() => {
    if (!checked) return

    if (isGameOver || isPaused) {
      stopTimers()
    } else {
      startTimers()
    }

    return () => stopTimers()
  }, [checked, isGameOver, isPaused, startTimers, stopTimers])

  function handleRestart() {
    const initialColor = pickTarget()

    setScore(0)
    setLives(START_LIVES)
    setGameOver(false)
    setIsNewRecord(false)
    setComboUI(0)
    setMaxComboUI(0)
    setDuration("00:00")
    setAccuracy(0)
    setSpeedLevel(1)
    setTargetColor(initialColor)
    setScoreSaveError(false)

    workerRef.current?.postMessage({
      type: "restart",
      payload: buildInitPayload(initialColor),
    })
  }

  const togglePause = useCallback(() => {
    const nextPaused = !pausedRef.current

    pausedRef.current = nextPaused
    setIsPaused(nextPaused)

    workerRef.current?.postMessage({ type: nextPaused ? "pause" : "resume" })
  }, [])

  useEffect(() => {
    if (!checked) return

    if (pendingTerminateRef.current) {
      clearTimeout(pendingTerminateRef.current)
      pendingTerminateRef.current = null
    }

    const initialColor = pickTarget()
    setTargetColor(initialColor)

    function handleMouseMove(e) {
      if (!canvasRef.current) return
      const rect = canvasRef.current.getBoundingClientRect()
      const scaleX = CANVAS_WIDTH / rect.width
      const relativeX = (e.clientX - rect.left) * scaleX
      workerRef.current?.postMessage({
        type: "pointer-move",
        payload: { x: clamp(relativeX, 0, CANVAS_WIDTH) },
      })
    }

    function handleKeyDown(e) {
      if (e.key === "ArrowLeft")
        workerRef.current?.postMessage({
          type: "key-down",
          payload: { key: "left" },
        })
      if (e.key === "ArrowRight")
        workerRef.current?.postMessage({
          type: "key-down",
          payload: { key: "right" },
        })
    }
    function handleKeyUp(e) {
      if (e.key === "ArrowLeft")
        workerRef.current?.postMessage({
          type: "key-up",
          payload: { key: "left" },
        })
      if (e.key === "ArrowRight")
        workerRef.current?.postMessage({
          type: "key-up",
          payload: { key: "right" },
        })
    }

    canvasRef.current?.addEventListener("mousemove", handleMouseMove)
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

    function handleWorkerMessage(e) {
      const { type, payload } = e.data

      if (type === "hud") {
        setScore(payload.score)
        setLives(payload.lives)
        setComboUI(payload.combo)
        setMaxComboUI(payload.maxCombo)
        return
      }

      if (type === "game-over") {
        setScore(payload.score)
        setDuration(payload.duration)
        setAccuracy(payload.accuracy)
        setMaxComboUI(payload.maxCombo)
        setGameOver(true)
        saveGameScore(payload.score, {
          correctCatches: payload.correctCatches,
          maxCombo: payload.maxCombo,
          durationSeconds: payload.elapsedSeconds,
        }).then((result) => {
          if (result?.isNewRecord) setIsNewRecord(true)
          setScoreSaveError(!result)
        })
        return
      }

      if (type === "sound") {
        if (payload.name === "success") playCatchSuccess(payload.combo)
        else if (payload.name === "miss") playCatchMiss()
        else if (payload.name === "trap") playCatchTrap()
        else if (payload.name === "lifeloss") playLifeLoss()
        else if (payload.name === "gameover") playGameOver()
        return
      }
    }

    if (!workerRef.current) {
      const worker = new Worker(
        new URL("../workers/ballWorker.js", import.meta.url),
        { type: "module" }
      )
      workerRef.current = worker
      worker.onmessage = handleWorkerMessage
      worker.onerror = (err) => {
        console.error("[ballWorker hata]", err.message, err)
        setWorkerError(true)
      }

      const offscreen = canvasRef.current.transferControlToOffscreen()
      worker.postMessage(
        {
          type: "init-canvas",
          payload: { canvas: offscreen, ...buildInitPayload(initialColor) },
        },
        [offscreen]
      )
    } else {
      workerRef.current.onmessage = handleWorkerMessage
    }

    return () => {
      canvasRef.current?.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      window.removeEventListener("blur", handleAutoPause)

      pendingTerminateRef.current = setTimeout(() => {
        workerRef.current?.terminate()
        workerRef.current = null
      }, 0)
    }
  }, [checked, togglePause])

  return {
    checked,
    canvasRef,
    score,
    lives,
    combo,
    speedLevel,
    targetColor,
    isGameOver,
    leaderboard,
    leaderboardStatus,
    handleRestart,
    isNewRecord,
    isPaused,
    togglePause,
    maxCombo,
    accuracy,
    duration,
    refreshLeaderboard,
    workerError,
    scoreSaveError,
  }
}