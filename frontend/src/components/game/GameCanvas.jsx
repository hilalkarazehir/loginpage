import { forwardRef } from "react"
import { motion } from "motion/react"
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "../../lib/gameConstants"

const GameCanvas = forwardRef(function GameCanvas({ children }, ref) {
  return (
    <div className="relative w-full" style={{ maxWidth: CANVAS_WIDTH }}>
      <div
        className="pointer-events-none absolute -inset-3 rounded-[28px] opacity-60 blur-2xl"
        style={{ background: "radial-gradient(circle at 50% 0%, rgba(217,164,65,0.18) 0%, transparent 65%)" }}
      />
      <motion.canvas
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        ref={ref}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        style={{ aspectRatio: `${CANVAS_WIDTH} / ${CANVAS_HEIGHT}` }}
        className="relative w-full h-auto rounded-2xl border border-white/10 bg-[#132538] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)] cursor-none"
      />
      {children}
    </div>
  )
})

export default GameCanvas