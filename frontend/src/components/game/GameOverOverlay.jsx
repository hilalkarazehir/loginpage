import { useEffect, useState } from "react"
import confetti from "canvas-confetti"
import { RotateCcw, ArrowLeft, Crown, Star, Zap, Target, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

function StatCard({ label, value, accent = "#D9A441" }) {
  return (
    <div
      className="relative overflow-hidden flex flex-col items-center justify-center gap-1 rounded-xl border px-2 py-3 text-center"
      style={{
        borderColor: `${accent}33`,
        background: `linear-gradient(160deg, ${accent}14 0%, rgba(255,255,255,0.03) 55%)`,
        boxShadow: `0 8px 20px -14px ${accent}66`,
      }}
    >
      <span className="absolute left-0 top-0 h-full w-[3px] opacity-80" style={{ background: accent }} />
      <span className="text-[9px] font-semibold uppercase tracking-wide text-white/50">
        {label}
      </span>
      <span className="text-base font-extrabold tabular-nums" style={{ color: accent }}>
        {value}
      </span>
    </div>
  )
}
function AchievementBadge({ icon: Icon, title, subtitle, unlocked, color }) {
  return (
    <div
      className="relative overflow-hidden flex flex-col items-center gap-1 rounded-xl border px-2 py-3 text-center transition-all duration-300"
      style={
        unlocked
          ? {
              borderColor: `${color}40`,
              background: `linear-gradient(160deg, ${color}18 0%, rgba(255,255,255,0.03) 55%)`,
              boxShadow: `0 8px 20px -14px ${color}66`,
            }
          : { borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)", opacity: 0.4 }
      }
    >
      {unlocked && <span className="absolute left-0 top-0 h-full w-[3px] opacity-80" style={{ background: color }} />}
      <span
        className="flex h-8 w-8 items-center justify-center rounded-full"
        style={{ backgroundColor: unlocked ? `${color}26` : "rgba(255,255,255,0.06)" }}
      >
        <Icon className="h-4 w-4" style={{ color: unlocked ? color : "#94A3B8" }} />
      </span>
      <span className="text-[10px] font-bold uppercase tracking-wide text-white">
        {title}
      </span>
      <span className="text-[9px] leading-tight text-white/50">{subtitle}</span>
    </div>
  )
}

export default function GameOverOverlay({
  score,leaderboard,leaderboardStatus,isNewRecord,onRestart,onBack,maxCombo = 0,accuracy = 0,duration = "00:00",speedLevel = 1,scoreSaveError = false,
}) {
  const [displayScore, setDisplayScore] = useState(0)

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

  const rank = leaderboard.filter((entry) => entry.score > score).length + 1

  const achievements = [
    {
      icon: Star,
      title: "Kesintisiz Seri",
      color: "#A855F7",
      unlocked: maxCombo >= 10,
      subtitle: maxCombo >= 10 ? `${maxCombo} komboya ulaştın` : "10 komboya ulaş",
    },
    {
      icon: Zap,
      title: "Yüksek Frekans",
      color: "#F97316",
      unlocked: speedLevel >= 2,
      subtitle: speedLevel >= 2 ? `x${speedLevel.toFixed(1)} hıza ulaştın` : "x2.0 hıza ulaş",
    },
    {
      icon: Target,
      title: "Tam İsabet",
      color: "#4FD1C5",
      unlocked: accuracy >= 80,
      subtitle: accuracy >= 80 ? `%${accuracy} isabet oranı` : "%80 isabet oranına ulaş",
    },
  ]

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-3xl bg-slate-950/80 backdrop-blur-xl px-6 py-5 overflow-hidden">
      <div className="relative flex w-full flex-1 min-h-0 flex-col items-center gap-3 overflow-y-auto">
      <div className="relative flex flex-col items-center gap-1">
        <div className="relative flex items-center justify-center h-20 w-20 my-1">
          {/* rotating light rays */}
          <span
            className="pointer-events-none absolute inset-0 rounded-full opacity-70 blur-[2px]"
            style={{
              background:
                "conic-gradient(from 0deg, transparent 0deg, rgba(217,164,65,0.55) 12deg, transparent 30deg, transparent 180deg, rgba(217,164,65,0.4) 192deg, transparent 210deg)",
              animation: "slow-spin 7s linear infinite",
            }}
          />
          <span
            className="pointer-events-none absolute inset-1 rounded-full opacity-50 blur-[1px]"
            style={{
              background:
                "conic-gradient(from 90deg, transparent 0deg, rgba(255,255,255,0.4) 8deg, transparent 20deg)",
              animation: "slow-spin 4s linear infinite reverse",
            }}
          />
          <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-b from-[#FFD700] to-[#D9A441] shadow-[0_0_32px_6px_rgba(217,164,65,0.55)]">
            <Crown className="h-7 w-7 text-slate-900" />
          </div>
        </div>

        <span className="text-xl font-extrabold tracking-wide text-white">TEBRİKLER!</span>

        {isNewRecord && (
          <span className="mt-1 flex items-center gap-1 rounded-full border border-[#D9A441]/40 bg-[#D9A441]/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[#FCEFCF]">
            🏆 Yeni Rekor!
          </span>
        )}
      </div>

      <div className="grid w-full max-w-[520px] grid-cols-4 gap-2">
        <StatCard label="Skor" value={displayScore} />
        <StatCard label="En Uzun Kombo" value={`x${maxCombo}`} accent="#68D391" />
        <StatCard label="İsabet Oranı" value={`%${accuracy}`} accent="#63B3ED" />
        <StatCard label="Süre" value={duration} accent="#FCEFCF" />
      </div>

      {scoreSaveError && (
        <div className="flex w-full max-w-[520px] items-center gap-2 rounded-xl border border-red-500/25 bg-red-500/10 px-3.5 py-2.5">
          <AlertTriangle className="h-4 w-4 shrink-0 text-red-400" />
          <p className="text-xs text-red-300">
            Skorun sunucuya kaydedilemedi, bu yüzden lider tablosuna yansımamış olabilir.
          </p>
        </div>
      )}

      <div className="w-full max-w-[520px]">
        <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-white/50">
          Kazanılan Başarımlar
        </div>
        <div className="grid grid-cols-3 gap-2">
          {achievements.map((a) => (
            <AchievementBadge key={a.title} {...a} />
          ))}
        </div>
      </div>

      {/* GameOverOverlay içindeki Buton Alanı */}
      <div className="flex w-full max-w-[520px] gap-3">
        <Button
          onClick={onRestart}
          size="lg"
          className="flex-1 rounded-xl border-0 text-slate-900 font-bold shadow-[0_8px_24px_-8px_rgba(217,164,65,0.6)] transition-all duration-200 hover:scale-[1.015] hover:shadow-[0_10px_28px_-6px_rgba(217,164,65,0.75)] active:scale-[0.99]"
          style={{ background: "linear-gradient(180deg, #F3C465 0%, #D9A441 100%)" }}
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Tekrar Dene
        </Button>
        {onBack && (
          <Button
            onClick={onBack}
            size="lg"
            variant="outline"
            className="flex-1 rounded-xl border-[#22D3EE]/40 bg-gradient-to-b from-[#22D3EE]/[0.08] to-transparent text-white transition-all duration-200 hover:scale-[1.015] hover:border-[#22D3EE]/70 hover:bg-[#22D3EE]/10 hover:text-white! hover:shadow-[0_0_18px_-4px_rgba(34,211,238,0.5)] active:scale-[0.99]"
          >
            <ArrowLeft className="mr-2 h-4 w-4 text-[#22D3EE]" />
            Panele Dön
          </Button>
        )}
      </div>
      </div>
    </div>
  )
}