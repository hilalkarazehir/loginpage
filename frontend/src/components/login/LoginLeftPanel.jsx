import { motion } from "motion/react"
import { useState } from "react"

export default function LoginLeftPanel() {
      const [imgFailed, setImgFailed] = useState(false)
  return (
    <div
      className="hidden md:flex w-[42%] p-11 flex-col justify-between relative overflow-hidden"
      style={{ background: "#1E3A5F" }}
    >
      <motion.div
        className="absolute -inset-y-40 -inset-x-40 pointer-events-none blur-md"
        style={{
          background:
            "linear-gradient(50deg, transparent 32%, rgba(255,255,255,0.09) 44%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.09) 56%, transparent 68%)",
        }}
        animate={{ x: ["-25%", "25%"], y: ["25%", "-25%"] }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          repeatType: "mirror",
        }}
      />
      <motion.div
        className="absolute -left-24 top-8 w-[360px] h-[360px] rounded-full opacity-25 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(147,197,253,0.55) 0%, rgba(255,255,255,0.12) 38%, transparent 68%)",
        }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.25, 0.35, 0.25],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <div
        className="absolute right-0 top-0 w-[70%] h-[55%] opacity-[0.16]"
        style={{
          background:
            "linear-gradient(50deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.12) 55%, transparent 100%)",
          clipPath: "polygon(100% 0%, 100% 100%, 0% 0%)",
        }}
      />
      <div
        className="absolute left-0 bottom-0 w-[70%] h-[55%] opacity-[0.14]"
        style={{
          background:
            "linear-gradient(50deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.1) 55%, transparent 100%)",
          clipPath: "polygon(0% 100%, 0% 0%, 100% 100%)",
        }}
      />

      <svg
        viewBox="0 0 360 540"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full pointer-events-none"
      >
        {/* Sol üst */}
        <motion.line
          x1="55" y1="0" x2="165" y2="130"
          stroke="#D9A441"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.9"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
        />

        <motion.line
          x1="28" y1="0" x2="112" y2="100"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.28"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.35 }}
        />

        <motion.line
          x1="1" y1="0" x2="59" y2="69"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.16"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.5 }}
        />

        {/* Sağ alt */}
        <motion.line
          x1="305" y1="540" x2="195" y2="410"
          stroke="#D9A441"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.9"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
        />

        <motion.line
          x1="332" y1="540" x2="248" y2="440"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.20"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.35 }}
        />

        <motion.line
          x1="359" y1="540" x2="301" y2="471"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.16"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.5 }}
        />
      </svg>

      <div className="absolute top-4 right-2 w-55 h-px bg-white/15" style={{ bottom: "auto" }} />
      <div className="absolute inset-0 flex items-center justify-center opacity-70 pointer-events-none">
        <div
          className="select-none pointer-events-none flex items-center justify-center w-[340px] h-[560px]"
          aria-hidden="true"
        >
          {!imgFailed ? (
            <img
              src="/logo.png"
              alt=""
              onError={() => setImgFailed(true)}
              className="w-full h-full object-contain"
              style={{ filter: "brightness(0) invert(1)" }}
            />
          ) : (
            <div
              className="font-serif text-primary-foreground opacity-[0.06] leading-none"
              style={{ fontSize: "min(46vw, 380px)" }}
            >
              ◈
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-2 left-10 w-full">
        <div className="flex items-center gap-3 -ml-8">
          <span className="font-sans text-[12px] text-blue-100/55 tracking-wide whitespace-nowrap">
            Smart Spirit © 2026
          </span>
          <div className="h-px w-24 bg-white/15" />
        </div>
      </div>
    </div>
  )
}