import { motion } from "motion/react"
import { ChevronDown } from "lucide-react"

export default function ModuleCard({
  mod,
  isOpen,
  onClick,
  delay = 0,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: .45, delay }}
      whileHover={{ y: -6 }}
      onClick={onClick}
      className={`
        group
        relative
        overflow-hidden
        cursor-pointer
        rounded-3xl
        border
        border-[#D9A441]/20
        bg-[#101F31]/90
        backdrop-blur-md
        p-6
        shadow-[0_20px_60px_-28px_rgba(0,0,0,.45)]
        transition-all
        ${isOpen ? "ring-2 ring-[#D9A441]/35" : ""}
      `}
    >

      {/* Glow */}
      <div
        className="
        absolute
        -right-20
        -top-20
        w-52
        h-52
        rounded-full
        blur-3xl
        opacity-0
        transition-opacity
        duration-500
        group-hover:opacity-100
        "
        style={{
          background:
            "radial-gradient(circle,#D9A44155 0%,transparent 70%)",
        }}
      />


      {/* Icon */}
      <div
        className="
        relative
        z-10
        w-14
        h-14
        rounded-2xl
        flex
        items-center
        justify-center
        border
        border-[#D9A441]/30
        transition-all
        duration-300
        group-hover:scale-105
        group-hover:border-[#D9A441]
        "
        style={{
          background:
            "linear-gradient(180deg,#315276,#1E3653)",
        }}
      >
        <mod.icon
          className="
          w-6
          h-6
          text-[#D9A441]
          transition-all
          group-hover:rotate-6
          "
        />
      </div>

      {/* Title */}

      <h3 className="relative z-10 mt-6 text-white text-lg font-semibold">
        {mod.title}
      </h3>

      {/* Description */}

      <p className="relative z-10 mt-3 text-[14px] leading-6 text-white/65">
        {mod.description}
      </p>

      {/* Divider */}

      <div className="relative z-10 mt-8 border-t border-white/10 pt-5 flex items-center justify-between">

        <span
          className="
          rounded-full
          border
          border-[#D9A441]/35
          bg-[#D9A441]/10
          px-3
          py-1.5
          text-[11px]
          uppercase
          tracking-wider
          font-semibold
          text-[#F4D27A]
          "
        >
          Görüntüle
        </span>

        <div
          className="
          w-10
          h-10
          rounded-xl
          border
          border-white/10
          bg-white/5
          flex
          items-center
          justify-center
          transition-all
          duration-300
          group-hover:bg-[#D9A441]
          "
        >
          <ChevronDown
            className={`
              w-5
              h-5
              transition-all
              duration-300
              ${
                isOpen
                  ? "rotate-180 text-[#17324A]"
                  : "text-white group-hover:text-[#17324A]"
              }
            `}
          />
        </div>

      </div>
    </motion.div>
  )
}