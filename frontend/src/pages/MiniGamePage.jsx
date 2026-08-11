import { useCallback, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Trophy, Sparkles, Gauge, Crown, ChevronRight } from "lucide-react"
import { useMiniGame } from "../hooks/useMiniGame"
import { useSpiritMood } from "../hooks/useSpiritMood"
import GameHeader from "../components/game/GameHeader"
import GameCanvas from "../components/game/GameCanvas"
import CornerBrackets from "../components/game/CornerBrackets"
import HudPanel from "../components/game/HudPanel"
import SpiritCharacter from "../components/game/SpiritCharacter"
import GameOverOverlay from "../components/game/GameOverOverlay"
import PauseOverlay from "../components/game/PauseOverlay"
import HelpModal from "../components/game/HelpModal"

export default function MiniGamePage() {
  const navigate = useNavigate()
  const [showHelp, setShowHelp] = useState(false)

  const {checked,canvasRef,score,lives,combo,speedLevel,targetColor,isGameOver,leaderboard,leaderboardStatus
      ,handleRestart,isPaused,isNewRecord,togglePause,maxCombo,accuracy,duration,refreshLeaderboard,
      workerError,scoreSaveError,
  } = useMiniGame(navigate)

  const mood = useSpiritMood({ lives, combo, isGameOver, isNewRecord, isPaused })

  const handleBack = useCallback(() => navigate("/dashboard"), [navigate])
  const handleHelp = useCallback(() => setShowHelp(true), [])
  const handleCloseHelp = useCallback(() => setShowHelp(false), [])

  if (!checked) return null

  if (workerError) {
    return (
      <div
        className="relative min-h-screen flex items-center justify-center text-white px-4"
        style={{ background: "radial-gradient(120% 100% at 50% -10%, #16273D 0%, #0B1728 55%, #060D18 100%)" }}
      >
        <div className="max-w-sm w-full rounded-2xl border border-white/10 bg-[#0E1B2C]/90 p-7 text-center">
          <h2 className="text-lg font-semibold mb-2">Oyun beklenmedik bir hatayla karşılaştı</h2>
          <p className="text-sm text-white/50 mb-6">
            Oyun motoru çöktü. Lütfen sayfayı yenileyip tekrar deneyin.
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleBack}
              className="flex-1 h-11 rounded-xl border border-white/10 text-sm font-medium text-white/70 hover:bg-white/5"
            >
              Panele Dön
            </button>
            <button
              onClick={() => window.location.reload()}
              className="flex-1 h-11 rounded-xl bg-[#D9A441] text-sm font-semibold text-[#07111f] hover:bg-[#e5b454]"
            >
              Sayfayı Yenile
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="relative min-h-screen overflow-hidden text-white"
      style={{ background: "radial-gradient(120% 100% at 50% -10%, #16273D 0%, #0B1728 55%, #060D18 100%)" }}
    >
      <div
        className="pointer-events-none fixed -left-32 bottom-0 w-[460px] h-[460px] rounded-full opacity-[0.10] blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(147,197,253,0.65) 0%, rgba(255,255,255,0.12) 40%, transparent 68%)" }}
      />
      <div
        className="pointer-events-none fixed -right-32 -top-40 w-[560px] h-[560px] rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(217,164,65,0.35) 0%, transparent 70%)" }}
      />

      <main className="relative max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div
          className="relative rounded-[28px] border border-white/10 bg-[#0E1B2C]/85 backdrop-blur-xl shadow-[0_30px_90px_-25px_rgba(0,0,0,0.75)] overflow-hidden"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{ background: "radial-gradient(circle at 50% 0%, rgba(217,164,65,0.10) 0%, transparent 55%)" }}
          />

          <GameHeader onBack={handleBack} onHelp={handleHelp} isPaused={isPaused} onTogglePause={togglePause} />

          <div className="relative px-4 sm:px-6 py-6 sm:py-8">
            <div className="flex flex-col lg:flex-row gap-4 items-center lg:items-start justify-center">
              {/* SOL PANEL */}
              <div className="flex flex-row lg:flex-col gap-4 w-full lg:w-[160px] order-2 lg:order-1">
                <HudPanel label="Hedef" accent={targetColor} className="flex-1 lg:flex-none">
                  <div className="flex items-center gap-2">
                    <span className="relative inline-flex items-center justify-center w-6 h-6 shrink-0">
                      <span
                        className="absolute inline-block w-6 h-6 rounded-full animate-ping opacity-40"
                        style={{ backgroundColor: targetColor }}
                      />
                      <span
                        className="relative inline-block w-5 h-5 rounded-full border border-white/40"
                        style={{ backgroundColor: targetColor }}
                      />
                    </span>
                    <span className="text-base font-semibold text-white">Renk</span>
                  </div>
                </HudPanel>
                <HudPanel label="Can" accent="#F56565" className="flex-1 lg:flex-none">
                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <span
                        key={i}
                        className="text-xl leading-none"
                        style={{ color: i < lives ? "#F56565" : "rgba(255,255,255,0.25)" }}
                      >
                        ♥
                      </span>
                    ))}
                  </div>
                </HudPanel>
              </div>

              {/* OYUN ALANI */}
              <div className="order-1 lg:order-2">
                <GameCanvas ref={canvasRef}>
                  <CornerBrackets />

                  <SpiritCharacter
                    mood={mood}
                    size="lg"
                    className="absolute left-0 bottom-0 -translate-x-1/2 translate-y-1/2 z-20"
                  />

                  {isGameOver && (
                    <GameOverOverlay
                      score={score}
                      leaderboard={leaderboard}
                      leaderboardStatus={leaderboardStatus}
                      isNewRecord={isNewRecord}
                      onRestart={handleRestart}
                      onBack={handleBack}
                      maxCombo={maxCombo}
                      accuracy={accuracy}
                      duration={duration}
                      speedLevel={speedLevel}
                      scoreSaveError={scoreSaveError}
                    />
                  )}
                  {!isGameOver && isPaused && <PauseOverlay onResume={togglePause} />}

                </GameCanvas>
              </div>

              {/* SAĞ PANEL */}
              <div className="flex flex-col gap-4 w-full lg:w-[200px] order-3">
                <div className="flex flex-row lg:flex-row gap-4">
                  <HudPanel label="Skor" icon={Trophy} iconColor="#D9A441" accent="#D9A441" className="flex-1">
                    <span className="text-xl font-bold text-[#D9A441]">{score}</span>
                  </HudPanel>
                  <HudPanel label="Kombo" icon={Sparkles} iconColor="#A855F7" accent="#A855F7" className="flex-1">
                    <span className="text-xl font-bold text-[#68D391]">x{combo}</span>
                  </HudPanel>
                </div>
                <HudPanel label="Hız" icon={Gauge} iconColor="#F97316" accent="#F97316">
                  <span className="text-xl font-bold text-white">x{speedLevel.toFixed(1)}</span>
                </HudPanel>

                <div
                  className="relative overflow-hidden rounded-2xl border px-3.5 py-3.5"
                  style={{
                    borderColor: "#22D3EE33",
                    background: "linear-gradient(160deg, #22D3EE14 0%, rgba(255,255,255,0.03) 55%)",
                  }}
                >
                  <span className="absolute left-0 top-0 h-full w-[3px] opacity-80" style={{ background: "#22D3EE" }} />

                  <div className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/50">
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full border border-[#22D3EE]/40 bg-[#22D3EE]/[0.12]">
                      <Crown className="h-2.5 w-2.5 text-[#22D3EE]" />
                    </span>
                    En İyi Skorlar
                  </div>

                  {leaderboardStatus === "loading" && (
                    <p className="text-xs text-white/40">Yükleniyor...</p>
                  )}
                  {leaderboardStatus === "error" && (
                    <p className="text-xs text-white/40">Yüklenemedi.</p>
                  )}
                  {leaderboardStatus === "ready" && (
                    <ol className="space-y-1">
                      {leaderboard.length === 0 && (
                        <li className="text-xs text-white/40">Henüz kayıt yok.</li>
                      )}
                      {leaderboard.slice(0, 5).map((entry, idx) => (
                        <li key={idx} className="flex items-center justify-between text-xs">
                          <span className="text-white/70">
                            {idx + 1}. {entry.username}
                          </span>
                          <span className="font-semibold text-[#D9A441]">{entry.score}</span>
                        </li>
                      ))}
                    </ol>
                  )}

                  <button
                    onClick={refreshLeaderboard}
                    className="mt-2.5 flex w-full items-center justify-center gap-1 rounded-lg border border-white/10 bg-white/5 py-1.5 text-[11px] font-semibold text-white/70 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white active:scale-[0.98]"
                  >
                    Yenile
                    <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      {showHelp && <HelpModal onClose={handleCloseHelp} />}
    </div>
  )
}