export async function saveGameScore(finalScore) {
  try {
    const token = localStorage.getItem("token")
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/game/results`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ score: finalScore }),
    })
    if (!res.ok) throw new Error("save-failed")
    return await res.json()
  } catch (err) {
    console.error("Skor kaydedilemedi:", err)
    return null
  }
}

export async function fetchLeaderboard() {
  const token = localStorage.getItem("token")
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/game/results/leaderboard`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error("leaderboard-fetch-failed")
  return res.json()
}