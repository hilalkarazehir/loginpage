import { Play, Pause } from "lucide-react"
import { motion } from "framer-motion"

export default function PauseOverlay({ onResume }) {
  const accentColor = "#D9A441"

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-6 rounded-3xl bg-slate-950/75 backdrop-blur-md px-6 overflow-hidden"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="relative flex flex-col items-center gap-5 rounded-2xl border px-10 py-8 text-center shadow-2xl overflow-hidden max-w-sm w-full"
        style={{
          borderColor: `${accentColor}33`,
          background: `linear-gradient(160deg, ${accentColor}12 0%, rgba(15, 28, 46, 0.85) 60%)`,
          boxShadow: `0 12px 32px -10px rgba(0,0,0,0.7), 0 0 20px -8px ${accentColor}40`,
        }}
      >
        {/* Sol Vurgu Şeridi & Köşe Çizgileri */}
        <span className="absolute left-0 top-0 h-full w-[3px] opacity-80" style={{ background: accentColor }} />
        <span className="pointer-events-none absolute w-3 h-3 border-t-2 border-r-2 top-2 right-2" style={{ borderColor: `${accentColor}55` }} />
        <span className="pointer-events-none absolute w-3 h-3 border-b-2 border-l-2 bottom-2 left-2" style={{ borderColor: `${accentColor}55` }} />

        {/* Duraklatma İkonu Halkası */}
        <div className="relative flex items-center justify-center h-16 w-16 my-1">
          <span
            className="pointer-events-none absolute inset-0 rounded-full opacity-40 blur-[2px]"
            style={{
              background: `conic-gradient(from 0deg, transparent 0deg, ${accentColor} 30deg, transparent 90deg)`,
              animation: "slow-spin 8s linear infinite",
            }}
          />
          <div
            className="relative flex h-12 w-12 items-center justify-center rounded-full border shadow-inner"
            style={{
              background: `${accentColor}1A`,
              borderColor: `${accentColor}50`
            }}
          >
            <Pause className="h-6 w-6" style={{ color: accentColor }} />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xl font-black uppercase tracking-widest text-white">
            Oyun Duraklatıldı
          </span>
          <span className="text-[11px] text-white/50 tracking-wide">
            Hazır olduğunda devam edebilirsin
          </span>
        </div>

        <button
          onClick={onResume}
          className="group relative inline-flex w-full items-center justify-center gap-2 rounded-xl border-0 px-6 py-3 text-sm font-bold text-slate-900 shadow-[0_8px_20px_-6px_rgba(217,164,65,0.5)] transition-all duration-200 hover:scale-[1.015] hover:shadow-[0_10px_24px_-4px_rgba(217,164,65,0.7)] active:scale-[0.99] cursor-pointer"
          style={{ background: "linear-gradient(180deg, #F3C465 0%, #D9A441 100%)" }}
        >
          <Play className="w-4 h-4 fill-slate-900" />
          Devam Et
        </button>
      </motion.div>
    </motion.div>
  )
}