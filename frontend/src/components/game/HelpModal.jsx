import { X, HelpCircle } from "lucide-react"
import { motion } from "framer-motion"

export default function HelpModal({ onClose }) {
  const accentColor = "#D9A441";
  const bgColor = "#0A1629";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
      onClick={onClose}
      className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl bg-slate-950/60 backdrop-blur-md px-8 z-50"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}

        className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#0F1C2E] p-7 shadow-2xl overflow-hidden"
        style={{
            borderColor: `${accentColor}33`,
            background: `linear-gradient(160deg, ${accentColor}14 0%, rgba(255,255,255,0.01) 55%), #0F1C2E`,
            boxShadow: `0 12px 40px -12px rgba(0,0,0,0.5), 0 8px 20px -14px ${accentColor}66`,
        }}
      >
        {/* Sol taraftaki renkli şerit (HudPanel'deki gibi) */}
        <span className="absolute left-0 top-0 h-full w-[3px] opacity-80" style={{ background: accentColor }} />

        {/* Köşe Çizgileri (CornerBrackets gibi) */}
        <span className="pointer-events-none absolute w-3 h-3 border-t-2 border-r-2 top-2 right-2" style={{ borderColor: `${accentColor}55` }} />
        <span className="pointer-events-none absolute w-3 h-3 border-b-2 border-l-2 bottom-2 left-2" style={{ borderColor: `${accentColor}55` }} />

        {/* Kapat Butonu */}
        <button
          onClick={onClose}
          aria-label="Kapat"
          className="absolute top-4 right-4 inline-flex items-center justify-center w-7 h-7 rounded-full text-white/50 hover:bg-white/10 hover:text-white transition-all z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Başlık Alanı (Icon + Metin, HudPanel tarzı) */}
        <div className="relative mb-6 flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-white/50">
          <span
            className="inline-flex items-center justify-center w-5 h-5 rounded-full border"
            style={{ background: `${accentColor}1f`, borderColor: `${accentColor}40` }}
          >
            <HelpCircle className="h-3 w-3" style={{ color: accentColor }} />
          </span>
          Nasıl Oynanır?
        </div>

        <ul className="space-y-3.5 text-[13px] text-white/80 leading-relaxed relative z-10">
          {[
            "Üstte belirli süre aralıklarla rastgele hedef renk belirlenir. Bu renkte inen topları paddle (alttaki çubuk) ile yakalamalısınız.",
            "Paddle'ı fare ile ya da ok tuşlarıyla (← →) hareket ettirebilirsiniz.",
            "Hedef rengi art arda yakalarsanız kombo oluşur ve puanınız katlanarak artar.",
            "Tuzak rengi topu (kırmızı top) yakalarsanız puan kaybedersiniz.",
            "Diğer renkleri kaçırmak serbesttir, ama hedef rengi kaçırırsanız (zemine değerse) bir can kaybedersiniz.",
            "3 can bitince oyun sona erer, \"Tekrar Oyna\" ile yeniden başlayabilirsiniz.",
            "Oyun ilerledikçe toplar giderek hızlanır, dikkatli olun.",
          ].map((text, index) => (
            <li key={index} className="flex gap-2.5 items-start">
              <span className="text-[#D9A441] font-bold text-sm mt-0.5">{index + 1}.</span>
              <span>{text}</span>
            </li>
          ))}
        </ul>

        <span
            className="pointer-events-none absolute inset-y-0 left-0 w-1/2 opacity-20"
            style={{
                background: `linear-gradient(90deg, transparent, ${accentColor}11, transparent)`,
            }}
        />
      </motion.div>
    </motion.div>
  )
}