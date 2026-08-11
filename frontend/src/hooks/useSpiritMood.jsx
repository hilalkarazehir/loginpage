import { useEffect, useRef, useState } from "react"

const HOLD_HAPPY_MS = 3500
const SAD_REACTION_MS = 1800
const HAPPY_COMBO_THRESHOLD = 2

export function useSpiritMood({
  lives,
  combo,
  isGameOver,
  isNewRecord,
  isPaused,
}) {
  const [sadReaction, setSadReaction] = useState(false)
  const [activeMood, setActiveMood] = useState("odakli")

  const prevLivesRef = useRef(lives)
  const holdTimeoutRef = useRef(null)
  const sadTimeoutRef = useRef(null)

  useEffect(() => {
    if (lives < prevLivesRef.current) {
      setSadReaction(true)
      if (sadTimeoutRef.current) clearTimeout(sadTimeoutRef.current)
      sadTimeoutRef.current = setTimeout(() => {
        setSadReaction(false)
      }, SAD_REACTION_MS)
    }
    prevLivesRef.current = lives
  }, [lives])

  useEffect(() => {
    if (combo >= HAPPY_COMBO_THRESHOLD) {
      setActiveMood("mutlu")

      if (holdTimeoutRef.current) clearTimeout(holdTimeoutRef.current)
      holdTimeoutRef.current = setTimeout(() => {
        setActiveMood("odakli")
      }, HOLD_HAPPY_MS)
    }
  }, [combo])

  // Unmount temizliği
  useEffect(() => {
    return () => {
      if (holdTimeoutRef.current) clearTimeout(holdTimeoutRef.current)
      if (sadTimeoutRef.current) clearTimeout(sadTimeoutRef.current)
    }
  }, [])

  if (isGameOver) return isNewRecord ? "tebrik" : "yanmis"
  if (isPaused) return "odakli"
  if (sadReaction) return "uzgun"

  return activeMood
}