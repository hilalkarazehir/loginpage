import { X } from "lucide-react"
import { motion } from "framer-motion"

export default function HelpModal({ onClose }) {
  return (
   <motion.div
     initial={{ opacity: 0 }}
     animate={{ opacity: 1 }}
     transition={{ duration: 0.35 }}
     onClick={onClose}
     className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl bg-slate-950/70 backdrop-blur-xl px-8"
   >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#1E3A5F] p-6 shadow-2xl"
      >
        <button
          onClick={onClose}
          aria-label="Kapat"
          className="absolute top-4 right-4 inline-flex items-center justify-center w-7 h-7 rounded-full text-white/60 hover:bg-white/10 hover:text-white transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        <h2 className="font-sans text-[17px] font-semibold text-white mb-4">Nasıl Oynanır?</h2>

        <ul className="space-y-3 text-[13.5px] text-white/75 leading-relaxed">
          <li className="flex gap-2">
            <span className="text-[#D9A441] font-semibold">1.</span>
            Üstte belirli süre aralıklarla rastgele hedef renk belirlenir. Bu renkte inen topları paddle (alttaki çubuk) ile yakalamalısınız.
          </li>
          <li className="flex gap-2">
            <span className="text-[#D9A441] font-semibold">2.</span>
            Paddle'ı fare ile ya da ok tuşlarıyla (← →) hareket ettirebilirsiniz.
          </li>
          <li className="flex gap-2">
            <span className="text-[#D9A441] font-semibold">3.</span>
            Hedef rengi art arda yakalarsanız kombo oluşur ve puanınız katlanarak artar.
          </li>
          <li className="flex gap-2">
            <span className="text-[#D9A441] font-semibold">4.</span>
            Tuzak rengi topu (kırmızı top) yakalarsanız puan kaybedersiniz.
          </li>
          <li className="flex gap-2">
            <span className="text-[#D9A441] font-semibold">5.</span>
            Diğer renkleri kaçırmak serbesttir, ama hedef rengi kaçırırsanız (zemine değerse) bir can kaybedersiniz.
          </li>
          <li className="flex gap-2">
            <span className="text-[#D9A441] font-semibold">6.</span>
            3 can bitince oyun sona erer, "Tekrar Oyna" ile yeniden başlayabilirsiniz.
          </li>
          <li className="flex gap-2">
            <span className="text-[#D9A441] font-semibold">7.</span>
            Oyun ilerledikçe toplar giderek hızlanır, dikkatli olun.
          </li>
        </ul>
      </motion.div>
    </motion.div>
  )
}