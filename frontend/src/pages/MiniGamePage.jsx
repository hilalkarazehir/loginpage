import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useMiniGame } from "../hooks/useMiniGame"
import GameHeader from "../components/game/GameHeader"
import GameCanvas from "../components/game/GameCanvas"
import GameOverOverlay from "../components/game/GameOverOverlay"
import PauseOverlay from "../components/game/PauseOverlay"
import HelpModal from "../components/game/HelpModal"

export default function MiniGamePage() {
  const navigate = useNavigate()
  const [showHelp, setShowHelp] = useState(false)

  const {checked,canvasRef,score,lives,combo,speedLevel,targetColor,isGameOver,leaderboard,leaderboardStatus
      ,handleRestart,isPaused,isNewRecord,togglePause,} = useMiniGame(navigate)

  if (!checked) return null

  return (
    <div
      className="relative min-h-screen overflow-hidden text-white"
      style={{ background: "linear-gradient(160deg, #17324A 0%, #1E3A5F 45%, #2A4A6B 100%)" }}
    >
      <div
        className="pointer-events-none fixed -left-32 bottom-0 w-[460px] h-[460px] rounded-full opacity-[0.12] blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(147,197,253,0.65) 0%, rgba(255,255,255,0.12) 40%, transparent 68%)" }}
      />
      <div
        className="pointer-events-none fixed -right-32 -top-40 w-[560px] h-[560px] rounded-full opacity-25 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(217,164,65,0.35) 0%, transparent 70%)" }}
      />

      <GameHeader
        targetColor={targetColor}
        combo={combo}
        speedLevel={speedLevel}
        score={score}
        lives={lives}
        onBack={() => navigate("/dashboard")}
        onHelp={() => setShowHelp(true)}
        isPaused={isPaused}
        onTogglePause={togglePause}
      />
      <main className="relative max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10 flex flex-col items-center">
        <GameCanvas ref={canvasRef}>
          {isGameOver && (
            <GameOverOverlay
              score={score}
              leaderboard={leaderboard}
              leaderboardStatus={leaderboardStatus}
              isNewRecord={isNewRecord}
              onRestart={handleRestart}
              onBack={() => navigate("/dashboard")}
            />
          )}
          {!isGameOver && isPaused && <PauseOverlay onResume={togglePause} />}
        </GameCanvas>
      </main>
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
    </div>
  )
}