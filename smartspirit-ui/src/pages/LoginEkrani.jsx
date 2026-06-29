import { useState } from "react"
import { useNavigate } from "react-router-dom"
import StarField from "../components/StarField"

function LoginEkrani() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [errors, setErrors] = useState({ username: "", password: "" })
  const [apiError, setApiError] = useState("")
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setApiError("")
    const newErrors = { username: "", password: "" }
    let hasError = false

    if (username === "") { newErrors.username = "Kullanıcı adı boş geçilemez"; hasError = true }
    if (password === "") { newErrors.password = "Parola boş geçilemez"; hasError = true }
    setErrors(newErrors)
    if (hasError) return

    setLoading(true)
    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })
      const data = await response.json()
      if (data.success) {
        localStorage.setItem("isLoggedIn", "true")
        navigate("/dashboard")
      } else {
        setApiError(data.message || "Kullanıcı adı veya parola hatalı.")
      }
    } catch {
      setApiError("Sunucuya bağlanılamadı.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={s.page}>
      <StarField />
      <div style={s.glow1} />
      <div style={s.glow2} />
      <div style={s.glow3} />

      <div style={s.card}>

        {/* SOL — Planet + Branding */}
        <div style={s.left}>
          <div style={s.leftTop}>
            <div style={s.brandRow}>
              <img
                src="/logo.png"
                className="logo-animate"
                alt="logo"
                style={{ width: 200, height: 120, objectFit: "contain" }}
                onError={(e) => { e.target.style.display = "none" }}
              />
            </div>

            <p style={s.tagline}>
              WHERE HUMAN SOULS<br />MEET WITH AI
            </p>
          </div>

          {/* Planet görseli */}
          <div style={s.planetWrap}>
            <div style={s.planetGlow} />
            <div style={s.planet} />
            <div style={s.planetRim} />
          </div>

          <div style={s.leftBottom}>
            <div style={s.systemBadge}>
              <div style={s.systemDot} />
              <span style={s.systemText}>Sistem Aktif</span>
            </div>
            <div style={s.leftFooter}>Smart Spirit · 2026</div>
          </div>
        </div>

        {/* SAĞ — Form */}
        <div style={s.right}>
          <div style={s.eyebrow}>Yetkili Kullanıcı Paneli</div>

          <form onSubmit={handleLogin} noValidate>
            {/* Kullanıcı Adı */}
            <label style={s.flabel}>Kullanıcı Adı</label>
            <div style={s.iw}>
              <span style={s.iconSpan}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 16, height: 16, color: "rgba(139,92,246,0.6)" }}>
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>
              <input
                style={{ ...s.finput, ...(errors.username ? s.inputError : {}) }}
                type="text"
                placeholder="örn: admin"
                value={username}
                onChange={(e) => { setUsername(e.target.value); if (errors.username) setErrors(p => ({ ...p, username: "" })) }}
              />
              {username && !errors.username && (
                <span style={s.checkIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2.5" style={{ width: 16, height: 16 }}>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
              )}
            </div>
            {errors.username && <span style={s.errorText}>{errors.username}</span>}

            {/* Parola */}
            <label style={s.flabel}>Şifre</label>
            <div style={s.iw}>
              <span style={s.iconSpan}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 16, height: 16, color: "rgba(139,92,246,0.6)" }}>
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </span>
              <input
                style={{ ...s.finput, ...(errors.password ? s.inputError : {}) }}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors(p => ({ ...p, password: "" })) }}
              />
              <button
                type="button"
                style={s.eyeBtn}
                onClick={() => setShowPassword(v => !v)}
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="rgba(139,92,246,0.5)" strokeWidth="2" style={{ width: 16, height: 16 }}>
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="rgba(139,92,246,0.5)" strokeWidth="2" style={{ width: 16, height: 16 }}>
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && <span style={s.errorText}>{errors.password}</span>}

            {/* Beni hatırla + Şifremi unuttum */}
            <div style={s.rememberRow}>
              <label style={s.rememberLabel}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  style={{ display: "none" }}
                />
                <span style={{ ...s.checkbox, ...(rememberMe ? s.checkboxChecked : {}) }}>
                  {rememberMe && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" style={{ width: 11, height: 11 }}>
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </span>
                <span style={s.rememberText}>Beni hatırla</span>
              </label>
              <button type="button" style={s.forgotBtn}>Parolayı mı unuttunuz?</button>
            </div>

            {apiError && <div style={s.apiError}>{apiError}</div>}

            <button type="submit" style={s.btn} className="login-button" disabled={loading}>
              {loading ? "BAĞLANILIYOR..." : (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  GİRİŞ YAP
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: 16, height: 16 }}>
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </span>
              )}
            </button>
          </form>

          <div style={s.footer}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 13, height: 13, marginRight: 6, opacity: 0.5 }}>
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            SMART SPIRIT AI · GÜVENLİ BAĞLANTI
          </div>
        </div>

      </div>
    </div>
  )
}

const s = {
  page: {
    minHeight: "100vh",
    background: "radial-gradient(ellipse at 30% 20%, #2d0a5e 0%, #0d0620 40%, #000008 100%)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: "Inter, sans-serif", position: "relative", overflow: "hidden",
  },
  glow1: {
    position: "fixed", left: -80, top: "20%", width: 320, height: 320,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(120,40,200,0.3) 0%, transparent 70%)",
    filter: "blur(70px)", pointerEvents: "none",
  },
  glow2: {
    position: "fixed", right: -60, bottom: "10%", width: 260, height: 260,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(200,40,120,0.2) 0%, transparent 70%)",
    filter: "blur(70px)", pointerEvents: "none",
  },
  glow3: {
    position: "fixed", left: "50%", top: "50%", transform: "translate(-50%,-50%)",
    width: 400, height: 400, borderRadius: "50%",
    background: "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)",
    filter: "blur(80px)", pointerEvents: "none",
  },
  card: {
    display: "flex", width: 780, minHeight: 500,
    borderRadius: 24, overflow: "hidden",
    border: "1px solid rgba(139,92,246,0.25)",
    boxShadow: "0 0 0 1px rgba(139,92,246,0.06), 0 24px 80px rgba(0,0,0,0.7)",
    position: "relative", zIndex: 1,
  },

  /* ---- SOL ---- */
  left: {
    width: "42%", padding: "2.2rem 1.8rem",
    borderRight: "1px solid rgba(139,92,246,0.12)",
    display: "flex", flexDirection: "column", justifyContent: "space-between",
    background: "linear-gradient(160deg, rgba(60,20,120,0.6) 0%, rgba(20,5,50,0.85) 60%, rgba(10,2,30,0.95) 100%)",
    position: "relative", overflow: "hidden",
  },
  leftTop: { display: "flex", flexDirection: "column", gap: 16 },
  brandRow: { display: "flex", alignItems: "center",justifyContent: "center",width:280, height: 200, objectFit: "contain"},
  tagline: {
    fontSize: 15, color: "rgba(196,132,252,0.6)", lineHeight: 1.6,
    fontWeight: 400, letterSpacing: "0.02em",marginTop: 50,
    marginBottom: 50,
  },

  /* Planet */
  planetWrap: {
    position: "absolute", bottom: -30, left: "50%",
    transform: "translateX(-50%)",
    width: 260, height: 200, overflow: "hidden",
  },
  planetGlow: {
    position: "absolute", bottom: 30, left: "50%", transform: "translateX(-50%)",
    width: 220, height: 60,
    background: "radial-gradient(ellipse, rgba(168,85,247,0.5) 0%, transparent 70%)",
    filter: "blur(20px)",
  },
  planet: {
    position: "absolute", bottom: -100, left: "50%", transform: "translateX(-50%)",
    width: 220, height: 220, borderRadius: "50%",
    background: "radial-gradient(ellipse at 35% 35%, #3d1a70 0%, #1a0840 40%, #0a0420 100%)",
    border: "1px solid rgba(139,92,246,0.3)",
    boxShadow: "0 0 40px rgba(139,92,246,0.2), inset 0 0 60px rgba(0,0,0,0.5)",
  },
  planetRim: {
    position: "absolute", bottom: -92, left: "50%", transform: "translateX(-50%)",
    width: 260, height: 30, borderRadius: "50%",
    background: "linear-gradient(90deg, transparent 5%, rgba(236,72,153,0.4) 30%, rgba(168,85,247,0.6) 50%, rgba(236,72,153,0.4) 70%, transparent 95%)",
    filter: "blur(4px)",
  },

  leftBottom: {
    display: "flex", flexDirection: "column", alignItems: "center",
    gap: 12, paddingBottom: 4, position: "relative", zIndex: 2,
  },
  systemBadge: {
    display: "flex", alignItems: "center", gap: 8,
    padding: "8px 18px", borderRadius: 20,
    background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.2)",
  },
  systemDot: {
    width: 8, height: 8, borderRadius: "50%",
    background: "#22c55e",
    boxShadow: "0 0 8px #22c55e",
    animation: "pulse 2s ease-in-out infinite",
  },
  systemText: {
    fontSize: 11, color: "rgba(196,132,252,0.8)", letterSpacing: "0.18em",
    textTransform: "uppercase", fontWeight: 500,
  },
  leftFooter: {
    fontSize: 12, color: "rgba(196,132,252,0.2)",
    letterSpacing: "0.1em", textTransform: "uppercase",paddingBottom: 60,
  },

  /* ---- SAĞ ---- */
  right: {
    flex: 1, padding: "2.4rem 2rem",
    display: "flex", flexDirection: "column", justifyContent: "center",
    background: "linear-gradient(150deg, rgba(45,15,90,0.55) 0%, rgba(20,6,50,0.75) 50%, rgba(10,2,30,0.9) 100%)",
  },
  eyebrow: {
    fontSize: 15, letterSpacing: "0.22em", textTransform: "uppercase",
    color: "rgba(168,85,247,0.75)", marginBottom: 40, fontWeight: 500,
    textAlign: "center"
  },
  rtitle:  { fontSize: 15, fontWeight: 600, color: "#f3e8ff", marginBottom:20, letterSpacing: "-0.01em",textAlign:"center" },

  rsub:    { fontSize: 14, color: "rgba(196,132,252,0.4)", marginBottom: 28 },
  flabel:  {
    fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase",
    color: "rgba(196,132,252,0.65)", marginBottom: 8, display: "block", fontWeight: 600,
  },
  iw:      { position: "relative", marginBottom: 6 },
  iconSpan:{
    position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
    display: "flex", alignItems: "center", pointerEvents: "none",
  },
  checkIcon: {
    position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
    display: "flex", alignItems: "center",
  },
  eyeBtn: {
    position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
    background: "none", border: "none", cursor: "pointer",
    display: "flex", alignItems: "center", padding: 4,
  },
  finput:  {
    width: "100%", padding: "13px 42px 13px 42px",
    background: "rgba(10,5,25,0.6)",
    border: "1px solid rgba(139,92,246,0.22)",
    borderRadius: 12, fontSize: 13, color: "#f3e8ff", outline: "none",
    fontFamily: "Inter, sans-serif",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
  inputError: { borderColor: "rgba(248,113,113,0.6)" },
  errorText:  { display: "block", color: "#f87171", fontSize: 11, marginBottom: 10, paddingLeft: 2 },

  /* Beni hatırla satırı */
  rememberRow: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    marginTop: 4, marginBottom: 4,
  },
  rememberLabel: {
    display: "flex", alignItems: "center", gap: 8, cursor: "pointer",
  },
  checkbox: {
    width: 18, height: 18, borderRadius: 5,
    border: "1.5px solid rgba(139,92,246,0.4)",
    background: "rgba(139,92,246,0.08)",
    display: "flex", alignItems: "center", justifyContent: "center",
    transition: "all 0.2s", flexShrink: 0,
  },
  checkboxChecked: {
    background: "linear-gradient(135deg, #7c3aed, #a855f7)",
    border: "1.5px solid #a855f7",
  },
  rememberText: { fontSize: 12, color: "rgba(196,132,252,0.55)" },
  forgotBtn: {
    background: "none", border: "none", cursor: "pointer",
    color: "rgba(168,85,247,0.75)", fontSize: 12,
    fontFamily: "Inter, sans-serif", padding: 0,
  },

  apiError: {
    background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.3)",
    borderRadius: 10, padding: "10px 14px", color: "#fca5a5", fontSize: 12,
    textAlign: "center", marginBottom: 14, marginTop: 8,
  },
  btn: {
    width: "100%", padding: 14, border: "none", borderRadius: 12, marginTop: 16,
    background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #ec4899 100%)",
    color: "#fff", fontSize: 12, fontWeight: 700, letterSpacing: "3px",
    textTransform: "uppercase", cursor: "pointer",
    boxShadow: "0 4px 24px rgba(139,92,246,0.45)",
    fontFamily: "Inter, sans-serif",
  },
  footer: {
    display: "flex", alignItems: "center", justifyContent: "center",
    marginTop: 24, color: "rgba(196,132,252,0.25)",
    fontSize: 13, letterSpacing: "1.5px", textTransform: "uppercase",
  },
}

export default LoginEkrani