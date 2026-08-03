import { useEffect, useState } from "react"
import confetti from "canvas-confetti"
import { RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function GameOverOverlay({
  score,leaderboard,leaderboardStatus,isNewRecord,onRestart,
}) {
  const [displayScore, setDisplayScore] = useState(0)
  const [badgeVisible, setBadgeVisible] = useState(false)

  useEffect(() => {
    setDisplayScore(0)
    if (score <= 0) return

    const duration = 900
    const start = performance.now()
    let frameId

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)

      setDisplayScore(Math.round(eased * score))

      if (progress < 1) {
        frameId = requestAnimationFrame(tick)
      }
    }

    frameId = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(frameId)
  }, [score])

  useEffect(() => {
    if (!isNewRecord) {
      setBadgeVisible(false)
      return
    }

    const timeout = setTimeout(() => setBadgeVisible(true), 900)

    return () => clearTimeout(timeout)
  }, [isNewRecord])

  useEffect(() => {
    if (!isNewRecord) return

    confetti({
      particleCount: 60,
      angle: 60,
      spread: 70,
      origin: { x: 0, y: 0.7 },
      colors: ["#D9A441", "#FFD700", "#FFF3B0"],
    })

    confetti({
      particleCount: 60,
      angle: 120,
      spread: 70,
      origin: { x: 1, y: 0.7 },
      colors: ["#D9A441", "#FFD700", "#FFF3B0"],
    })
  }, [isNewRecord])

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl bg-slate-950/70 backdrop-blur-xl px-8">
      <span className="text-2xl font-bold text-white">
        Oyun Bitti
      </span>

      <div className="flex flex-col items-center gap-2">
        <span className="text-2xl font-extrabold text-[#D9A441] tabular-nums">
          Skor: {displayScore}
        </span>

        {isNewRecord && (
          <span
            className={`flex items-center gap-1 rounded-full border border-[#D9A441]/40 bg-[#D9A441]/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[#FCEFCF] transition-all duration-300 ${
              badgeVisible
                ? "opacity-100 scale-100"
                : "opacity-0 scale-75"
            }`}
          >
            🏆 Yeni Rekor!
          </span>
        )}
      </div>

      <div className="w-full max-w-[560px] rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl p-5 shadow-2xl">
        <div className="mb-3 flex items-center gap-2 border-b border-white/10 pb-3">
          <span className="text-lg">🏆</span>

          <span className="text-sm font-bold uppercase tracking-wider text-white/80">
            Skor Tablosu
          </span>
        </div>

        {leaderboardStatus === "loading" && (
          <p className="mt-2 text-xs text-white/50">
            Yükleniyor...
          </p>
        )}

        {leaderboardStatus === "error" && (
          <p className="mt-2 text-xs text-white/50">
            Liderlik tablosu yüklenemedi.
          </p>
        )}

        {leaderboardStatus === "ready" && (
          <ol className="mt-2 space-y-1.5">
            {leaderboard.length === 0 && (
              <li className="text-xs text-white/50">
                Henüz kayıt yok.
              </li>
            )}

            {leaderboard.map((entry, idx) => (
              <li
                key={idx}
                className="flex items-center justify-between border-b border-white/5 py-3 last:border-0"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full font-bold ${
                      idx === 0
                        ? "bg-yellow-400 text-black"
                        : idx === 1
                        ? "bg-slate-300 text-black"
                        : idx === 2
                        ? "bg-amber-700 text-white"
                        : "bg-white/10 text-white"
                    }`}
                  >
                    {idx + 1}
                  </div>

                  <span className="text-white">
                    {entry.username}
                  </span>
                </div>

                <span className="font-bold text-[#D9A441]">
                  {entry.score}
                </span>
              </li>
            ))}
          </ol>
        )}
      </div>

      <Button
        onClick={onRestart}
        size="lg"
        className="mt-5 w-64 bg-[#D9A441] text-slate-900 hover:bg-[#e7b854] rounded-xl shadow-lg"
      >
        <RotateCcw className="mr-2 h-4 w-4" />
        Tekrar Oyna
      </Button>
    </div>
  )
}