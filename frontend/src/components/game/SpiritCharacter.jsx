import { memo } from "react"
import "./SpiritCharacter.css"
import { motion } from "motion/react"

import odakli from "@/assets/odakli.png"
import mutlu from "@/assets/mutlu.png"
import uzgun from "@/assets/uzgun.png"
import tebrik from "@/assets/tebrik.png"
import yanmis from "@/assets/yanmis.png"

const MOODS = {
  odakli: { label: "Odaklanıyor", color: "#D9A441" },
  mutlu: { label: "Harika!", color: "#68D391" },
  uzgun: { label: "Dikkat!", color: "#63B3ED" },
  tebrik: { label: "Tebrikler!", color: "#FACC15" },
  yanmis: { label: "Sistem Hatası", color: "#8B8B85" },
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

        {/*
          Tüm görseller üst üste sabittir (absolute).
          Sadece aktif olan görünür duruma geçer. Böylece sıçrama/kayma %100 önlenir.
        */}
        <div className="spirit-images-container">
          {Object.keys(moodImages).map((mKey) => (
            <motion.img
              key={mKey}
              src={moodImages[mKey]}
              alt={MOODS[mKey]?.label || "Robot"}
              className="spirit-layer"
              initial={false}
              animate={{
                opacity: currentMood === mKey ? 1 : 0,
                scale: currentMood === mKey ? 1 : 0.95,
              }}
              transition={{
                duration: 0.5,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* EFEKT PARTİKÜLLERİ */}

        {/* Üzgün: Akan Gözyaşları */}
        {currentMood === "uzgun" && (
          <div className="spirit-particles spirit-tears" aria-hidden="true">
            <span className="tear tear-left" />
            <span className="tear tear-right" />
          </div>
        )}

        {/* Tebrik: Konfeti / Işıltı Saçılması */}
        {currentMood === "tebrik" && (
          <div className="spirit-particles spirit-sparks" aria-hidden="true">
            <span className="spark spark-1" />
            <span className="spark spark-2" />
            <span className="spark spark-3" />
            <span className="spark spark-4" />
          </div>
        )}

        {/* Yanmış: Yükselen Duman Efekti */}
        {currentMood === "yanmis" && (
          <div className="spirit-particles spirit-smoke" aria-hidden="true">
            <span className="smoke-puff smoke-1" />
            <span className="smoke-puff smoke-2" />
            <span className="smoke-puff smoke-3" />
          </div>
        )}

      </div>
    </div>
  )
}

export default memo(SpiritCharacter)