import { memo } from "react"
import { ArrowLeft, HelpCircle, Pause, Play, Gamepad2 } from "lucide-react"

function GameHeader({ onBack, onHelp, isPaused, onTogglePause }) {
  return (
    <div className="relative flex items-center justify-between border-b border-white/10 px-4 sm:px-6 h-16 overflow-hidden">
      <div
        className="pointer-events-none absolute inset-x-0 -top-16 h-32 opacity-30 blur-2xl"
        style={{
          background: "radial-gradient(45% 100% at 50% 100%, #D9A441 0%, transparent 65%)",
        }}
      />

      <button
        onClick={onBack}
        className="relative inline-flex items-center gap-2 rounded-xl border border-[#D9A441]/30 bg-gradient-to-b from-white/[0.06] to-white/[0.02] px-4 py-2 text-[13.5px] font-medium text-white transition-all hover:border-[#D9A441]/60 hover:bg-white/10 hover:shadow-[0_0_16px_-2px_rgba(217,164,65,0.5)] active:scale-[0.98]"
      >
        <ArrowLeft className="w-4 h-4 text-[#D9A441]" />
        Panele dön
      </button>

      {/* title */}
      <div className="relative flex items-center gap-2.5">
        <Gamepad2 className="w-4 h-4 text-[#D9A441] shrink-0" strokeWidth={2.4} />
        <span className="font-sans text-[14px] sm:text-[16px] font-bold tracking-[0.14em] uppercase text-white/95">
          Smart Spirit
          <span className="text-[#D9A441]"> Mini Game</span>
        </span>
        <span className="hidden sm:block w-[6px] h-[6px] rounded-full bg-[#D9A441] shadow-[0_0_10px_3px_rgba(217,164,65,0.7)]" />
      </div>

      <div className="relative flex items-center gap-2.5">
        <button
          onClick={onTogglePause}
          aria-label={isPaused ? "Devam et" : "Duraklat"}
          className="shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-full border border-[#D9A441]/50 text-[#D9A441] transition-all hover:text-[#17324A] hover:bg-[#D9A441] hover:scale-105 active:scale-95"
          style={{
            background: "linear-gradient(135deg, rgba(217,164,65,0.15), rgba(217,164,65,0.05))",
            animation: "glow-pulse 2.6s ease-in-out infinite",
          }}
        >
          {isPaused ? <Play className="w-4 h-4 shrink-0" /> : <Pause className="w-4 h-4 shrink-0" />}
        </button>
        <button
          onClick={onHelp}
          aria-label="Nasıl oynanır"
          className="shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-full border border-[#22D3EE]/50 text-[#22D3EE] transition-all hover:text-[#0B2530] hover:bg-[#22D3EE] hover:scale-105 active:scale-95"
          style={{
            background: "linear-gradient(135deg, rgba(34,211,238,0.15), rgba(34,211,238,0.05))",
          }}
        >
          <HelpCircle className="w-4 h-4 shrink-0" />
        </button>
      </div>
    </div>
  )
}

export default memo(GameHeader)