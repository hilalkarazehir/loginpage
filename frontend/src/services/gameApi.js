import { authFetch } from "../lib/apiClient"

export async function saveGameScore(finalScore, stats = {}) {
  try {
    const res = await authFetch("/api/game/results", {
      method: "POST",
      body: JSON.stringify({
        score: finalScore,
        correctCatches: stats.correctCatches,
        maxCombo: stats.maxCombo,
        durationSeconds: stats.durationSeconds,
      }),
    })
    if (!res.ok) throw new Error("save-failed")
    return await res.json()
  } catch (err) {
    console.error("Skor kaydedilemedi:", err)
    return null
  }
}

export async function fetchLeaderboard() {
  const res = await authFetch("/api/game/results/leaderboard")
  if (!res.ok) throw new Error("leaderboard-fetch-failed")
  return res.json()
}