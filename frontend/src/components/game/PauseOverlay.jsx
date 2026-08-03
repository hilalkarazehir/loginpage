import { Play } from "lucide-react"

export default function PauseOverlay({ onResume }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-2xl bg-black/70 backdrop-blur-sm px-6">
      <span className="text-2xl font-bold text-white">Duraklatıldı</span>

      <button
        onClick={onResume}
        className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-2 text-sm font-medium text-white hover:bg-white/20 active:scale-[0.98] transition-all"
      >
        <Play className="w-4 h-4" />
        Devam Et
      </button>
    </div>
  )
}
