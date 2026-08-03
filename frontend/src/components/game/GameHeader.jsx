import { ArrowLeft, Heart, HelpCircle, Pause, Play } from "lucide-react"
import { START_LIVES } from "../../lib/gameConstants"

export default function GameHeader({ targetColor, combo, speedLevel, score, lives, onBack, onHelp, isPaused, onTogglePause }) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#1E3A5F]/85 backdrop-blur-xl">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-[13.5px] font-medium text-white transition-all hover:border-white/30 hover:bg-white/10 active:scale-[0.98]"
        >
          <ArrowLeft className="w-4 h-4" />
          Panele dön
        </button>

        <span className="font-sans text-[15px] font-semibold tracking-[0.08em] text-white uppercase">
          Smart Spirit Mini Game
        </span>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-white/60">Hedef:</span>
            <span className="relative inline-flex items-center justify-center w-5 h-5">
              <span
                className="absolute inline-block w-5 h-5 rounded-full animate-ping opacity-40"
                style={{ backgroundColor: targetColor }}
              />
              <span
                className="relative inline-block w-4 h-4 rounded-full border border-white/40"
                style={{ backgroundColor: targetColor }}
              />
            </span>
          </div>
          {combo > 1 && (
            <span className="text-sm font-bold text-[#68D391] animate-pulse">x{combo} kombo</span>
          )}
          {speedLevel > 1 && (
            <span className="text-sm font-semibold text-[#F6AD55]">Hız ×{speedLevel.toFixed(1)}</span>
          )}
          <span className="text-sm font-semibold text-[#D9A441]">Skor: {score}</span>
          <div className="flex items-center gap-1">
            {Array.from({ length: START_LIVES }).map((_, i) => (
              <Heart
                key={i}
                className="w-4 h-4"
                fill={i < lives ? "#F56565" : "none"}
                stroke={i < lives ? "#F56565" : "rgba(255,255,255,0.3)"}
              />
            ))}
          </div>
          <button
            onClick={onTogglePause}
            aria-label={isPaused ? "Devam et" : "Duraklat"}
            className="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-full border border-white/15 bg-white/5 text-white/80 transition-all hover:border-white/30 hover:bg-white/10 hover:text-white active:scale-[0.95]"
          >
            {isPaused ? <Play className="w-4 h-4 shrink-0" /> : <Pause className="w-4 h-4 shrink-0" />}
          </button>
          <button
            onClick={onHelp}
            aria-label="Nasıl oynanır"
            className="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-full border border-white/15 bg-white/5 text-white/80 transition-all hover:border-white/30 hover:bg-white/10 hover:text-white active:scale-[0.95]"
          >
            <HelpCircle className="w-4 h-4 shrink-0" />
          </button>
        </div>
      </div>
    </header>
  )
}