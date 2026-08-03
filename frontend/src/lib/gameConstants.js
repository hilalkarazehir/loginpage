export const CANVAS_WIDTH = 680
export const CANVAS_HEIGHT = 480
export const BALL_RADIUS = 18
export const START_LIVES = 3
export const BASE_POINTS = 10
export const TRAP_COLOR = "#FF0000"
export const TRAP_PENALTY = -15
export const TRAIL_LENGTH = 6
export const DIFFICULTY_TICK_MS = 15000
export const DIFFICULTY_STEP = 0.15
export const DIFFICULTY_MAX = 2.2
export const REWARD_COLORS = ["#3B82F6", "#22C55E", "#FACC15","#FFFFFF","#EC4899","#A855F7", "#000000",];
export const PADDLE_WIDTH = 110
export const PADDLE_HEIGHT = 14
export const PADDLE_Y = CANVAS_HEIGHT - 40
export const PADDLE_SPEED = 7

export function randomColor(exclude) {
  const pool = [...REWARD_COLORS, TRAP_COLOR]
  let c
  do {
    c = pool[Math.floor(Math.random() * pool.length)]
  } while (c === exclude)
  return c
}

export function pickTarget(exclude) {
  let c
  do {
    c = REWARD_COLORS[Math.floor(Math.random() * REWARD_COLORS.length)]
  } while (c === exclude && REWARD_COLORS.length > 1)
  return c
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

export const INITIAL_BALLS = [
  { id: 1, x: CANVAS_WIDTH * 0.25, y: 20, vx: 1.6, vy: 0, gravity: 0.22, radius: BALL_RADIUS, color: "#D9A441" },
  { id: 2, x: CANVAS_WIDTH * 0.5, y: 60, vx: -2.0, vy: 0, gravity: 0.2, radius: BALL_RADIUS, color: "#4FD1C5" },
  { id: 3, x: CANVAS_WIDTH * 0.75, y: 10, vx: 2.3, vy: 0, gravity: 0.24, radius: BALL_RADIUS, color: "#63B3ED" },
]