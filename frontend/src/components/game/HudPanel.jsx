import { memo } from "react"

function HudPanel({ label, icon: Icon, iconColor = "#D9A441", accent = "#D9A441", children, className = "" }) {
  const corner = "pointer-events-none absolute w-2 h-2"
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border px-3.5 py-3 transition-all duration-200 hover:-translate-y-0.5 ${className}`}
      style={{
        borderColor: `${accent}33`,
        background: `linear-gradient(160deg, ${accent}14 0%, rgba(255,255,255,0.03) 55%)`,
        boxShadow: `0 8px 20px -14px ${accent}66`,
      }}
    >
      <span className="absolute left-0 top-0 h-full w-[3px] opacity-80" style={{ background: accent }} />

      <span className={`${corner} top-1.5 right-1.5 border-t-2 border-r-2`} style={{ borderColor: `${accent}55` }} />
      <span className={`${corner} bottom-1.5 right-1.5 border-b-2 border-r-2`} style={{ borderColor: `${accent}55` }} />

      <span
        className="pointer-events-none absolute inset-y-0 left-0 w-1/3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `linear-gradient(90deg, transparent, ${accent}33, transparent)`,
          animation: "shine-sweep 2.4s ease-in-out infinite",
        }}
      />

      <div className="relative mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/50">
        {Icon && (
          <span
            className="inline-flex items-center justify-center w-4 h-4 rounded-full border"
            style={{ background: `${iconColor}1f`, borderColor: `${iconColor}40` }}
          >
            <Icon className="h-2.5 w-2.5" style={{ color: iconColor }} />
          </span>
        )}
        {label}
      </div>
      <div className="relative">{children}</div>
    </div>
  )
}

export default memo(HudPanel)