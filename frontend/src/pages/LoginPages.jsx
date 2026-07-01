import { s } from "./loginStyles"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import StarField from "../components/StarField"
import NeuralCore from "../components/NeuralCore"

function LoginPages() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [errors, setErrors] = useState({ username: "", password: "" })
  const [apiError, setApiError] = useState("")
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
useEffect(() => {
  const savedRemember = localStorage.getItem("rememberMe");
  const savedUsername = localStorage.getItem("rememberUsername");

  if (savedRemember === "true" && savedUsername) {
    setRememberMe(true);
    setUsername(savedUsername);
  }
}, []);
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

        if (rememberMe) {
          localStorage.setItem("rememberMe", "true")
          localStorage.setItem("rememberUsername", username)
        } else {
          localStorage.removeItem("rememberMe")
          localStorage.removeItem("rememberUsername")
        }

        navigate("/dashboard")
      }
  else {
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
        <div style={s.left}>
          <div style={s.leftTop}>
            <div style={s.brandRow}>
              <img
                src="/logo.png"
                className="logo-animate"
                alt="logo"
                style={{ width: 250, height: 170, objectFit: "contain" }}
                onError={(e) => { e.target.style.display = "none" }}
              />
            </div>


          </div>

         <div style={s.planetWrap}>
           <NeuralCore />
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
              <button
                type="button"
                style={s.forgotBtn}
                onClick={() => setApiError("Şifre sıfırlama bağlantısı için sistem yöneticinizle iletişime geçin.")}
              >
                Parolayı mı unuttunuz?
              </button>
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

export default LoginPages