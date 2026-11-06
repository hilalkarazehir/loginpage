import { memo } from "react"
import "./SpiritCharacter.css"
import { motion } from "motion/react"

import odakli from "@/assets/odakli.png"
import mutlu from "@/assets/mutlu.png"
import uzgun from "@/assets/uzgun.png"
import tebrik from "@/assets/tebrik.png"
import yanmis from "@/assets/yanmis.png"

const MOODS = {
  odakli: { label: "Odaklanıyor", color: "#38BDF8" },
  mutlu: { label: "Harika!", color: "#EAB308" },
  uzgun: { label: "Dikkat!", color: "#60A5FA" },
  tebrik: { label: "Tebrikler!", color: "#F59E0B" },
  yanmis: { label: "Oyun Bitti", color: "#9CA3AF" },
}

const moodImages = {
  odakli,
  mutlu,
  uzgun,
  tebrik,
  yanmis,
}

function SpiritCharacter({ mood = "odakli", size = "md", className = "" }) {
  const currentMood = MOODS[mood] ? mood : "odakli"

  return (
    <div className={className}>
      <div className={`spirit-figure spirit-figure--${size} spirit-${currentMood}`}>
        <div className="spirit-images-container">
          {Object.keys(moodImages).map((mKey) => (
            <motion.img
              key={mKey}
              src={moodImages[mKey]}
              alt={MOODS[mKey]?.label || "Smart Spirit"}
              className="spirit-layer"
              initial={false}
              animate={{
                opacity: currentMood === mKey ? 1 : 0,
                scale: currentMood === mKey ? 1 : 0.94,
              }}
              transition={{
                duration: 0.3,
                ease: "easeOut",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default memo(SpiritCharacter)