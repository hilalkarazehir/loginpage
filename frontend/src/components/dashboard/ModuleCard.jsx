import { motion } from "motion/react"
import { ChevronDown, ArrowRight } from "lucide-react"

export default function ModuleCard({ mod, isOpen, onClick, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      onClick={onClick}
      className={`group rounded-2xl border border-[#DDE3EA] bg-white p-6 shadow-[0_20px_50px_-28px_rgba(4,15,30,0.65)] transition-all hover:-translate-y-1 hover:shadow-[0_28px_65px_-30px_rgba(4,15,30,0.75)] ${
        mod.active ? "cursor-pointer" : ""
      } ${isOpen ? "ring-2 ring-[#1E3A5F]/30" : ""}`}
    >
      <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 bg-[#EEF3F8] text-[#1E3A5F] border border-[#DDE6F0] border-b-2 border-b-[#D9A441]/50 transition-colors group-hover:bg-[#1E3A5F] group-hover:text-white group-hover:border-b-[#D9A441]">
        <mod.icon className="w-5 h-5" />
      </div>

      <h3 className="font-sans text-[16px] font-semibold text-[#111827]">{mod.title}</h3>

      <p className="font-sans text-[13.5px] text-[#6B7280] mt-2 leading-relaxed">{mod.description}</p>

      <div className="mt-5 flex items-center justify-between border-t border-[#EEF2F6] pt-4">
        {mod.active ? (
          <span className="inline-flex items-center rounded-full bg-[#1E3A5F]/10 px-2.5 py-1 font-sans text-[11px] font-semibold tracking-wide uppercase text-[#1E3A5F] border border-[#D9A441]/40">
            Görüntüle
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full bg-[#EEF3F8] px-2.5 py-1 font-sans text-[11px] font-semibold tracking-wide uppercase text-[#1E3A5F]/60">
            Yakında
          </span>
        )}

        <span className="w-8 h-8 rounded-lg bg-[#F8FAFC] border border-[#E5EAF0] flex items-center justify-center text-[#1E3A5F]/40 transition-colors group-hover:bg-[#1E3A5F] group-hover:text-white">
          {mod.active ? (
            <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
          ) : (
            <ArrowRight className="w-4 h-4" />
          )}
        </span>
      </div>
    </motion.div>
  )
}