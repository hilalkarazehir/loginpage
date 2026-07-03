import { useState } from "react"

/**
 * Marka imzası — tek bileşen, iki bağlam:
 *  - variant="badge"     → üstte kompakt rozet (ikon + isim), koyu panel içinde
 *  - variant="watermark" → arka planda dev, soluk tekil işaret
 *
 * İkisi de aynı /logo.png dosyasını, aynı fallback ikonunu paylaşır —
 * "tek, tutarlı bir imza" fikri buradan geliyor. Dosya yoksa (ör. henüz
 * yüklenmediyse) ikon+metin fallback'ine sessizce düşer.
 */
export default function SmartSpiritLogo({ variant = "badge", className = "" }) {
  const [imgFailed, setImgFailed] = useState(false)

  if (variant === "watermark") {
    return (
      <div
        className={`select-none pointer-events-none flex items-center justify-center ${className}`}
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
    )
  }

  // variant === "badge"
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {!imgFailed ? (
        <img
          src="/logo.png"
          alt="Smart Spirit"
          onError={() => setImgFailed(true)}
          className="w-7 h-7 rounded-full object-contain"
        />
      ) : (
        <div className="w-7 h-7 shrink-0 rounded-full border border-primary-foreground/30 flex items-center justify-center">
          <span className="text-accent text-[12px] leading-none">◈</span>
        </div>
      )}
      <span className="font-sans text-[11px] font-medium tracking-[0.14em] text-primary-foreground/70 uppercase whitespace-nowrap">
        Smart Spirit
      </span>
    </div>
  )
}